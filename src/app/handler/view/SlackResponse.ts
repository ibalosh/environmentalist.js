import {ApiResponse} from "./Response";
import {Environment, User} from "..";
import moment = require("moment");

enum SlackColor {
    GREEN = "#36a64f",
    RED = "#FF0000",
    ORANGE = "#FF8C00"
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
    public channel?: string;

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
        let that = this;

        let attachments: SlackAttachment[] = [];
        let data: SlackMessage = new SlackMessage("Environments status");

        environments.forEach(function(environment: Environment){
            let attachment: SlackAttachment = new SlackAttachment(that.getAttachmentColor(environment))
            let fields: SlackAttachmentField[] = [];

            if (environment.taken === false) {
                fields.push(that.createAttachmentField(environment.name, "free"));
            }
            else {
                if (environment.takenAt === null) { environment.takenAt = new Date(); }
                const timeString: string = moment(environment.takenAt).utcOffset('-0400').format('MMMM DD - HH:mm A');
                fields.push(that.createAttachmentField(environment.name,
                    `taken by: ${environment.takenBy.username}`));
                fields.push(that.createAttachmentField(null, `taken at: ${timeString} EST`));
            }

            if (environment.health.healthy === false && environment.health.note !== null) {
                fields.push(that.createAttachmentField(null, `⚠️  ${environment.health.note}`));
            }

            attachment.fields = fields;
            attachments.push(attachment);
        });

        data.attachments = attachments;
        this.message = JSON.stringify(data);
    }

    private getAttachmentColor(environment: Environment): SlackColor {
        let color: SlackColor;

        if (environment.health.healthy === false) {
            color = SlackColor.ORANGE
        }
        else if (environment.taken === true) {
            color = SlackColor.RED;
        }
        else {
            color = SlackColor.GREEN;
        }

        return color;
    }

    private createAttachmentField(title: string | null, value: string): SlackAttachmentField {
        return new SlackAttachmentField(title, value);
    }

}