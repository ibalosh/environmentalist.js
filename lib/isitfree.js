const bodyParser = require('body-parser')
const express = require('express')

// setup expressjs
// along with bodyParser to be able to read POST parameters
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const handler = require('./handler')
const envHandler = handler.initHandler;

const slk = require('./slack/slack.js');
const config = slk.config;
const slack = new slk.Slack(config.slack.auth_header);

// Routes

// Slack commands

// free taken environment
app.post('/free', function (req, res) {
  let response = envHandler.freeEnvironment(req.body.text, req.body.user_name);

  res.setHeader('Content-Type', 'application/json');
  res.status(response.status).send(response.message);
})

// take one of existing environments
app.post('/take', function (req, res) {
  let response = envHandler.takeEnvironment(req.body.text, req.body.user_name, req.body.user_id, req.body.channel_id)

  res.setHeader('Content-Type', 'application/json');
  res.status(response.status).send(response.message);

})

// retrieve status of all available environments
app.post('/status', function (req, res) {
  let response = envHandler.status()
  
  res.setHeader('Content-Type', 'application/json');
  res.status(response.status).send(response.message);
})


//  API commands

// Add environment - need to provide JSON body like:
// { "environment": "test" }
app.post('/environment', function (req, res) { 
  let response = envHandler.addEnvironment(req.body.environment)

  res.setHeader('Content-Type', 'application/json');
  res.status(response.status).send(response.message);
})

// Delete existing environment - need to provide JSON body like:
// { "environment": "test" }
app.delete('/environment', function (req, res) { 
  let response = envHandler.deleteEnvironment(req.body.environment)

  res.setHeader('Content-Type', 'application/json');
  res.status(response.status).send(response.message);
})

// take one of existing environments
app.post('/takeByApi', function (req, res) {
  slack.userByEmail(req.body.user_email, function (data) {
      let response = envHandler.takeEnvironment(req.body.text, data.user.name, data.user.id, config.slack.default_channel)
      
      res.setHeader('Content-Type', 'application/json');
      res.status(response.status).send(response.message);
  })
})

// free taken environment
app.post('/freeByApi', function (req, res) {
  slack.userByEmail(req.body.user_email, function (data) {
    let response = envHandler.freeEnvironment(req.body.text, data.user.name);
    
    res.setHeader('Content-Type', 'application/json');
    res.status(response.status).send(response.message);
})
})

app.listen(8889)