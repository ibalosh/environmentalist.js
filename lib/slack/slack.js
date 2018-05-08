const axios = require('axios');
yaml = require('js-yaml');
fs   = require('fs');

class Slack {

    constructor(authHeader) {
        this.api = {
            url: 'https://slack.com',
            endpoints: {
                chatMessage: '/api/chat.postMessage',
                usersList: '/api/users.list',
                userByEmail: '/api/users.lookupByEmail'
            }
        };

        this.headers = {
            'Content-Type': 'application/json',
            'Authorization': authHeader
        };
    }

    executeRequest(type, endpoint, data = null, callBack = null) {
        axios({
            method: type,
            headers: this.headers,
            url: this.api.url + endpoint,
            data: data
        }).then(function (response) {
            if (callBack !== null) {
                callBack(response.data);          
            }
        })
            .catch(function (error) {
                console.log(error);
            });
    }

    chatMessage(postData) {
        this.executeRequest("post", this.api.endpoints.chatMessage, postData)
    }

    usersList(callBack) {
        this.executeRequest("get", this.api.endpoints.usersList, "", callBack)
    }

    userByEmail(email, callBack) {
        this.executeRequest("get", this.api.endpoints.userByEmail + "?email=" + email, "", callBack)
    }

}

function readConfig() {
    let doc = null;
    try {
        doc = yaml.safeLoad(fs.readFileSync(__dirname + '/config.yaml', 'utf8'));
      } catch (e) {
        console.log(e);
      }
    
      return doc;
}


let config = readConfig();
let slack = new Slack(config.slack.auth_header);

module.exports.Slack = Slack;
module.exports.config = readConfig();



// TESTING

var message = {
    "ok": true,
    "text": "still test this finally! <@" + config.slack.default_user + ">",
    "channel": config.slack.default_channel
}

message = JSON.stringify(message)

var counter = 0;

function test() {
    counter++;
    slack.chatMessage(message) 
    
    if (counter > 3) {
        clearInterval(timer);
    }
}

var timer = setInterval(test ,1000);




/*
slack.userByEmail("igor@wildbit.com", function (data) {
    console.log(data.user.id)
})
*/











