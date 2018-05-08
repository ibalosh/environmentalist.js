// import Environments handling package
const env = require('./environments')
const Environment = env.Environment;
const environments = env.initEnvironments();

class EnvHandler {

    constructor(environments, responseFormatter) {
        this.environments = environments;
        this.responseFormatter = responseFormatter;
    }

    status() {
        return this.generateDetailedResponse(this.environments)
    }

    takeEnvironment(environment, user_name, user_id, channel_id) {
        let force = false;

        function forceTakingEnvironment(message) {
          if (message.includes("force") === true) {
            let data = message.split(" ");
            environment = data[0];
            force = true;
          }
          else {
            environment = message;
          }
        }

        forceTakingEnvironment(environment);
        let environmentDetails = this.environments.getEnvironmentDetails(environment)

        // if environment doesn't exist
        if (!this.environments.environmentExists(environment)) {
            return this.generateResponse("Environment *" + environment + "* doesn't exist. Available environments are *" + this.environments.getEnvironmentNames().join(", ") + "*", 200)
        }
        // take environment if free|force option used
        else if (environmentDetails.free || force === true) {
            this.environments.takeEnvironment(environment, user_name, user_id, channel_id);
            return this.generateResponse("Environment *" + environment + "* taken by user *" + user_name + "*", 200, true)
        }
        // request environment if not free  
        else {
            return this.generateResponse("Can <@" + user_id + "> take *" + environment + "* <@" + environmentDetails.user_id + ">?", 200, true);
        }
    }

    freeEnvironment(environment, user_name) {
        // environment doesn't exist
        if (!this.environments.environmentExists(environment)) {
            return this.generateResponse("Environment *" + environment + "* doesn't exist. Available environments are *" + this.environments.getEnvironmentNames().join(", ") + "*", 200)
        }
        // free environment if owner
        else if (this.environments.environmentOwner(environment, user_name)) {
            this.environments.freeEnvironment(environment);
            return this.generateResponse("Environment *" + environment + "* freed by user *" + user_name + "*.", 200, true)
        }
        // not owner
        else {
            return this.generateResponse("Environment *" + environment + "* can't be freed by user *" + user_name + "*.");
        }
    }

    addEnvironment(environment) {
        // environment name not specified
        if (environment === undefined) {
            return this.generateResponse('Invalid content provided.', 200)
        }
        // environment exists
        else if (this.environments.environmentExists(environment)) {
            return this.generateResponse('Environment already exists.', 200)
        }
        // add environment
        else {
            this.environments.addEnvironment(new Environment(environment));
            return this.generateResponse("Environment '" + environment + "' added.")
        }
    }

    deleteEnvironment(environment) {
        // environment name not specified
        if (environment === undefined) {
            return this.generateResponse('Invalid content provided.', 200)
        }
        // environment doesn't exist
        else if (!this.environments.environmentExists(environment)) {
            return this.generateResponse('Environment doesnt exist.', 200)
        }
        // delete environment
        else {
            this.environments.deleteEnvironment(environment);
            return this.generateResponse("Environment '" + environment + "' deleted.")
        }
    }

    generateResponse(message, status = 200, in_channel = false) {
        let response = {}
        response.status = status;
        response.message = this.responseFormatter.simpleMessage(message, in_channel);
        return response;
    }

    generateDetailedResponse(message, status = 200) {
        let response = {}
        response.status = status;
        response.message = this.responseFormatter.statusMessage(environments)
        return response;
    }
}


// import request response formatter
const ResponseFormatter = require('./response')
const response = new ResponseFormatter();


//const envHandler = new EnvHandler(environments, response);


module.exports.initHandler = new EnvHandler(environments, response); 
