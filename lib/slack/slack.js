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

module.exports.Slack = Slack;
module.exports.config = readConfig();