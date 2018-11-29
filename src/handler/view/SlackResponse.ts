import {ApiResponse, Response} from "./Response";
import {Environment, User} from "..";
import moment = require("moment");

enum SlackColor {
    GREEN = "#36a64f",
    RED = "#FF0000"
}

class SlackAttachment {
    color: string;
    fields: SlackAttachmentField[];

    constructor(color: string, fields: SlackAttachmentField[]) {
        this.color = color;
        this.fields = fields;
    }
}

class SlackAttachmentField {
    title: string;
    value: string;
    short: boolean;

    constructor(title: string, value: string, short: boolean = true) {
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
    text: string;
    attachments?: SlackAttachment[];
    response_type: SlackResponseType;

    constructor(text: string, responseType: SlackResponseType = SlackResponseType.HIDDEN_TO_PUBLIC) {
        this.response_type = responseType;
        this.text = text;
    }
}

export class SlackResponse extends ApiResponse {

    private formatApiMessageForSlack(response_type: SlackResponseType = SlackResponseType.HIDDEN_TO_PUBLIC): void {
        this.message = this.message.replace(/"/g,'*');
        this.message = new SlackMessage(this.message, response_type);
    }

    public generateTakeMessage(environmentName: string, user: User): void {
        super.generateTakeMessage(environmentName, user);
        this.formatApiMessageForSlack();
    }

    public generateAlreadyTakenMessage(environment: Environment, user: User): void {
        super.generateAlreadyTakenMessage(environment, user);
        this.formatApiMessageForSlack();
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
            let color: SlackColor;
            let text: string;

            if (environment.taken === false) {
                color = SlackColor.GREEN;
                text = "free";
            }
            else {
                color = SlackColor.RED;
                if (environment.takenAt === null) { environment.takenAt = new Date(); }
                const timeString: string = moment(environment.takenAt).utcOffset('-0500').format('MMMM DD - HH:mm A');
                text = `taken by: ${environment.takenBy.username} at ${timeString} EST`;
            }

            let attachment: SlackAttachment = that.createAttachment(color,environment.name,text);
            attachments.push(attachment);
        });

        data.attachments = attachments;
        this.message = data;
    }

    private createAttachment(color: SlackColor, title: string, value: string): SlackAttachment {
        let attachmentFields: SlackAttachmentField[] = [];
        attachmentFields.push(this.createAttachmentField(title, value));

        return new SlackAttachment(color, attachmentFields);
    }

    private createAttachmentField(title: string, value: string): SlackAttachmentField {
        return new SlackAttachmentField(title, value);
    }

}