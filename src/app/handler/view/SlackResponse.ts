import {ApiResponse} from "./Response";
import {Environment, Deployment, User, RepoDepoyments, Hash} from "..";
import moment = require("moment");
import {Message, Blocks} from 'slack-block-builder';

enum SlackColor {
    GREEN = "#36a64f",
    RED = "#FF0000",
    ORANGE = "#FF8C00",
}

class SlackAttachment {
    public color: string;
    public mrkdwn_in: string[];
    public fields: SlackAttachmentField[];

    constructor(color: string, fields: SlackAttachmentField[] = []) {
        this.color = color;
        this.fields = fields;
        this.mrkdwn_in = ["text"];
    }
}

class SlackAttachmentField {
    title: string | null;
    value: string | null;
    short: boolean;

    constructor(title: string | null, value: string | null, short: boolean = false) {
        this.title = title;
        this.value = value;
        this.short = short;
    }
}

enum SlackResponseType {
    VISIBLE_TO_PUBLIC = 'in_channel',
    HIDDEN_TO_PUBLIC = ''
}

class SlackMessage {
    public text: string;
    public attachments?: SlackAttachment[];
    public response_type: SlackResponseType;
    
    constructor(text: string, responseType: SlackResponseType = SlackResponseType.HIDDEN_TO_PUBLIC) {
        this.response_type = responseType;
        this.text = text;
    }
}

/**
 * Response model adjusted to match Slack.
 */
export class SlackResponse extends ApiResponse {

    private formatApiMessageForSlack(response_type: SlackResponseType = SlackResponseType.HIDDEN_TO_PUBLIC): void {
        this.message = this.message.replace(/"/g,'*');
        let data: SlackMessage = new SlackMessage(this.message, response_type);
        this.message = JSON.stringify(data);
    }

    public generateTakeMessage(environmentName: string, user: User): void {
        super.generateTakeMessage(environmentName, user);
        this.formatApiMessageForSlack();
    }

    public generateAlreadyTakenMessage(environment: Environment, user: User): void {
        this.message = `Can <@${user.id}> take environment ${environment.name} <@${environment.takenBy.id}>?`;
        this.formatApiMessageForSlack(SlackResponseType.VISIBLE_TO_PUBLIC);
    }

    public generateFreeMessage(environmentName: string, user: User): void {
        super.generateFreeMessage(environmentName, user);
        this.formatApiMessageForSlack();
    }

    public generateDeniedFreeMessage(environment: Environment): void {
        super.generateDeniedFreeMessage(environment);
        this.formatApiMessageForSlack();
    }

    public generateNotExistingEnvironmentMessage(environmentName: string, environmentNames: string[]) {
        super.generateNotExistingEnvironmentMessage(environmentName, environmentNames);
        this.formatApiMessageForSlack();
    }

    public generateEnvironmentStatusMessage(environments: Environment[]) {
        let blocks: any = []
        blocks.push(Blocks.Divider());
        environments.forEach(function(environment: Environment){
            if (!environment.taken) {
                blocks.push(Blocks.Section({text: `:green_heart: *${environment.name}*`}));
                blocks.push(Blocks.Section({text: "free"}));
            }
            else {
                if (environment.takenAt === null) { environment.takenAt = new Date(); }
                const timeString: string = moment(environment.takenAt).utcOffset('-0400').format('MMMM DD - HH:mm A');
                const text = `taken by: ${environment.takenBy.username}\ntaken at: ${timeString} EST`;
                blocks.push(Blocks.Section({text: `:heart: *${environment.name}*`}));
                blocks.push(Blocks.Section({text: text}));
            }

            if (!environment.health.healthy && environment.health.note !== null) {
                const note: string = `${environment.health.note} - report by: ${environment.health.updateBy.username}`
                blocks.push(Blocks.Section({text: `:warning: *broken environment* - ${note}`}));
            }

            blocks.push(Blocks.Divider());
        });

        this.message = Message().blocks(
            Blocks.Header({text: 'Environments status'}), blocks).buildToJSON();
    }

    public generateEnvironmentDeploymentStatusMessage(deployments: Deployment[]) {
        return this.generateDeploymentBlocksByRepo(deployments);
    }

    private generateDeploymentBlocksByRepo(deployments: Deployment[]):void {
        let blocks: any = [];
        blocks.push(Blocks.Divider());

        let repoDeployments: Hash<Deployment[]> = RepoDepoyments.transformDeployments(deployments);

        Object.keys(repoDeployments).forEach(function (repoName: string) {
            const deploymentServiceString = `\`${repoName}\``;
            blocks.push(Blocks.Section({text: deploymentServiceString}));

            repoDeployments[repoName].forEach(function (deployment: Deployment) {
                const service: string = deployment.service;
                const branchOrRelease = deployment.branch || deployment.release;
                const branchOrReleaseLabel = (deployment.branch === '') ? "release": "branch";
                const branchOrReleaseString = `*${branchOrReleaseLabel}* ${branchOrRelease}`;
                const serviceString = (deployment.service === deployment.serviceFormatted) ? '' : `*${service}*`;
                const shaString = (deployment.shortSha === '') ? '' : `*sha* ${deployment.shortSha}`;
                const userString = `*user* ${deployment.user || 'unknown'}`;
                const timeString = `*time* ${deployment.timestamp}`

                const text =    `${serviceString}\n${branchOrReleaseString}, ${shaString}` +
                                `\n${userString}, ${timeString}`

                blocks.push(Blocks.Section({text: text}));
            })
            blocks.push(Blocks.Divider());
        });

        this.message = Message().blocks(
            Blocks.Header({text: 'Releases status'}), blocks).buildToJSON();
    }

    private generateDeploymentBlocks(deployments: Deployment[]):void {
        let blocks: any = [];
        blocks.push(Blocks.Divider());

        deployments.forEach(function (deployment: Deployment) {
            const branchOrRelease = deployment.branch || deployment.release;
            const branchOrReleaseLabel = (deployment.branch === '') ? "release" : "branch";
            const branchOrReleaseString = `*${branchOrReleaseLabel}* ${branchOrRelease}`
            const deploymentServiceString = `\`${deployment.serviceFormatted}\``;
            const shaString = (deployment.shortSha === '') ? '' : `*sha* ${deployment.shortSha}`;
            const userString = `*user* ${deployment.user || 'unknown'}`;
            const timeString = `*time* ${deployment.timestamp}`

            const text =    `${deploymentServiceString}` +
                `\n${branchOrReleaseString}, ${shaString}` +
                `\n${userString}, ${timeString}`

            blocks.push(Blocks.Section({text: text}));
            blocks.push(Blocks.Divider());
        });

        this.message = Message().blocks(
            Blocks.Header({text: 'Releases status'}), blocks).buildToJSON();
    }

    public generateEnvironmentBrokenNoteMissingMessage(): void {
        super.generateEnvironmentBrokenNoteMissingMessage();
        this.formatApiMessageForSlack();
    }

}