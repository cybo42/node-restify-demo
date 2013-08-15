/*
 * Copyright (c) 2013 Timo Behrmann. All rights reserved.
 */

var restify = require('restify');
var restifyValidation = require('node-restify-validation');
var restifySwagger = require('node-restify-swagger');

var server = module.exports.server = restify.createServer();
server.use(restify.queryParser());
server.use(restify.bodyParser());
server.use(restifyValidation.validationPlugin({ errorsAsArray: false }));
var personModel = {
  "id": "Person",
  "required": ["name"],
  "properties": {
    "name": {
      "type": "string",
      "required": true
    },
    "status": {
      "type": "string"
    },
    "email": {
      "type": "string"
    },
    "age": {
      "type": "int64"
    },
    "password": {
      "type": "string"
    },
    "passwordRepeat": {
      "type": "string"
    }
}};

var models = {models:[ {"Person": personModel}]};
restifySwagger.configure(server, models);

var userResource = restifySwagger.swagger.createResource('/user', {models: {"Person": personModel}});

var params = [{
  dataType: "Person",
  paramType: "body",
}];

userResource["post"]("/user", "my summary", {nickname: "myUser", parameters: params});


/**
 * Test Controller
 */
server.get({url: '/hello/:name',
    swagger: {
        summary: 'My hello call description',
        notes: 'My hello call notes',
        nickname: 'sayHelloCall',
        type: "Person"
    },
    validation: {
        name: { isRequired: true, isIn: ['foo', 'bar'], scope: 'path', description: 'Your unreal name' },
        status: { isRequired: false, isIn: ['foo', 'bar'], scope: 'query', description: 'Are you foo or bar?' },
        email: { isRequired: false, isEmail: true, scope: 'query', description: 'Your real email address' },
        age: { isRequired: true, isInt: true, scope: 'query', description: 'Your age' },
        password: { isRequired: true, description: 'New password' },
        passwordRepeat: { equalTo: 'password', description: 'Repeated password'}
    }}, function (req, res, next) {
    res.send(req.params);
});



server.post({url: '/user',
 validation: {
    name: { isRequired: true, isIn: ['foo', 'bar'], scope: 'path', description: 'Your unreal name' },
        status: { isRequired: false, isIn: ['foo', 'bar'], scope: 'query', description: 'Are you foo or bar?' },
        email: { isRequired: false, isEmail: true, scope: 'query', description: 'Your real email address' },
        age: { isRequired: true, isInt: true, scope: 'query', description: 'Your age' },
        password: { isRequired: true, description: 'New password' },
        passwordRepeat: { equalTo: 'password', description: 'Repeated password'}
    } 

        // person: {dataType: "Person", scope: "body"}
    // }

    // , validation: {
    //     name: { isRequired: true, isIn: ['foo', 'bar'], scope: 'body', description: 'Your unreal name' },
    //     status: { isRequired: false, isIn: ['foo', 'bar'], scope: 'body', description: 'Are you foo or bar?' },
    //     email: { isRequired: false, isEmail: true, scope: 'body', description: 'Your real email address' },
    //     age: { paramType: 'integer', isRequired: true, isInt: true, type: 'integer', scope: 'body', description: 'Your age' },
    //     password: { isRequired: true, scope: 'body', description: 'New password' },
    //     passwordRepeat: { equalTo: 'password', scope: 'body', description: 'Repeated password'}
    // }
}, function (req, res, next) {
    res.send(req.params);
});

/**
 * Serve static swagger resources
 **/
server.get(/^\/docs\/?.*/, restify.serveStatic({directory: './swagger-ui'}));
server.get('/', function (req, res, next) {
    res.header('Location', '/docs/index.html');
    res.send(302);
    return next(false);
});

restifySwagger.loadRestifyRoutes();

/**
 * Start server
 */
server.listen(8001, function () {
    console.log('%s listening at %s', server.name, server.url);
});