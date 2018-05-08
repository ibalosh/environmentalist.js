// Single environment object
class Environment {

  constructor(name, free = true, user_name = null, user_id = null, channel_id = null) {
    this.name = name;
    this.free = true;
    this.user_name = user_name;
    this.user_id = user_id;
    this.channel_id = channel_id;
    this.taken_at = null;
  }

}

// Object to hold all environment details
class Environments {
  constructor() {
    this.environments = [];
  }

  deleteEnvironment(environment) {
    this.environments.pop(environment);
  }

  addEnvironment(environment) {
    this.environments.push(environment);
  }

  getEnvironments() {
    return this.environments;
  }

  getEnvironmentNames() { 
    return this.environments.map( env => env.name );
  }

  getEnvironmentDetails(name) {
    var result = this.environments.find(function (element) {
      return element.name === name
    })

    return result;
  }

  environmentExists(name) {
    var result = this.environments.find(function (element) {
      return element.name === name
    })

    return result !== undefined;
  }

  environmentOwner(name, user_name) {
    var result = this.environments.find(function (element) {
      return element.name === name
    })

    return result.user_name === user_name;
  }

  takeEnvironment(name, user_name, user_id, channel_id) {
    var result = this.environments.find(function (element) {
      return element.name === name
    })

    result.user_name = user_name;
    result.user_id = user_id;
    result.free = false;
    result.channel_id = channel_id;
    result.taken_at = new Date();
  }

  freeEnvironment(name) {
    var result = this.environments.find(function (element) {
      return element.name === name
    })

    result.user_name = null;
    result.user_id = null;
    result.free = true;
    result.channel_id = null;
    result.taken_at = null;
  }

}

function initEnvironments() {
  var env = new Environments();
  env.addEnvironment(new Environment("staging1"));
  env.addEnvironment(new Environment("staging2"));
  env.addEnvironment(new Environment("production"));

  return env;
}

module.exports.Environment = Environment;
module.exports.Environments = Environments;
module.exports.initEnvironments = initEnvironments;

