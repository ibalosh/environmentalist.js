import {Environment, Manager, Response, User} from "../index";
import * as moment from 'moment';

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
    text?: string;
    attachments?: SlackAttachment[];
    response_type?: string;

    constructor(responseType: string = SlackResponseType.HIDDEN_TO_PUBLIC) {
        this.response_type = responseType;
    }
}

export class SlackManager extends Manager {

    public respondInChannel: boolean;

    constructor(response: Response = new Response()) {
        super(response);
        this.respondInChannel = false;
    }

    public takeEnvironmentAndRespond(message: string, user: User): Response {
        super.takeEnvironmentAndRespond(message, user);
        this.response.message = this.response.message.replace(/"/g,"*");
        return this.response;
    }

    protected environmentsStatus():any {
        let that = this;
        let attachments: SlackAttachment[] = [];
        let data: SlackMessage = new SlackMessage();
        data.text =  "Environments status";

        Manager.environments.forEach(function(environment: Environment){
            let color: SlackColor;
            let text: string;

            if (environment.taken === false) {
                color = SlackColor.GREEN;
                text = "free";
            }
            else {
                color = SlackColor.RED;
                if (environment.takenAt === null) { environment.takenAt = new Date(); }

                text = `taken by: ${environment.takenBy.username} at ${moment(environment.takenAt.toString()).utcOffset('-0500').format('MMMM DD - HH:mm A')} EST`;
            }

            let attachment: SlackAttachment = that.createAttachment(color,environment.name,text);
            attachments.push(attachment);
        });

        data.attachments = attachments;
        return data;
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