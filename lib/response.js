const moment = require('moment');

class ResponseFormatter {

    constructor() {
        this.greenColor = "#36a64f";
        this.redColor = "#FF0000";
    }
    
    simpleMessage(text, in_channel = false) {
        var data = {};
        if (in_channel === true) {
          data.response_type = "in_channel";
        }
        data.text = text;
      
        return JSON.stringify(data);
    }

    statusMessage(environments) {
        return this.detailedMessage(environments)
    }

    detailedMessage(environments) {
        var data = {}
        data.text =  "Environments status";
        //data.channel = channel_id;
        
        var attachments = []
        var that = this;
        environments.getEnvironments().forEach(function(env){
            var color, text; 
            if (env.free === true) { 
                color = that.greenColor;
                text = "free";
            }
            else {
                color = that.redColor;
                text = "taken by: " + env.user_name + " at " + moment(env.taken_at).utcOffset('-0500').format('MMMM DD - HH:mm A') + " EST";
            }
            
            attachments.push(that.attachment(color,env.name,text))
          })

        data.attachments = attachments;
        return JSON.stringify(data)
    }

    attachment(color, title, value) {
        var attachment = {}
        attachment.color = color;
        attachment.fields = []
        attachment.fields.push(this.attachmentFields(title, value))

        return attachment
    }

    attachmentFields(title, value) {
        var field = {
            "title": title,
            "value": value,
            "short": false,
        }

        return field;
    }
  
  }

module.exports = ResponseFormatter;

