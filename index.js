/**
 * Primary file for the API
 * 
 */

// Dependencies
var http = require('http');
var url = require('url');
var StringDecoder = require('string_decoder').StringDecoder;
var config = require('./config');

console.log('Starting in ' + config.envName + ' mode');

// Instantiate the HTTP server
var httpServer = http.createServer(function(req, res){
    unifiedServer(req, res);
});

// Start the HTTP server
httpServer.listen(config.httpPort, function(){
  console.log('HTTP server is listening on port ' + config.httpPort);
});

// All the server logic for both the http and https servers
var unifiedServer = function(req, res) {

    // obtener la Url y parsearla
    var parsedUrl = url.parse(req.url, true);

    // obtener el Path
    var path = parsedUrl.pathname;
    var trimmedPath = path.replace(/^\/+|\/+$/g,'');

    // obtener el query string como un objeto
    var queryStringObject = parsedUrl.query;

    // obtener el metodo HTTP
    var method = req.method.toLowerCase();

    // obtener los headers como un objeto
    var headers = req.headers;

    // obtener el payload, si hubiese
    var decoder = new StringDecoder('utf-8');
    var buffer = '';
    req.on('data', function(data){
        buffer += decoder.write(data);
    });
    req.on('end', function(){
        buffer += decoder.end();

        // escoge el handler que debe atender el request
        var chosenHandler = typeof(router[trimmedPath]) !== 'undefined' ? router[trimmedPath] : handlers.notFound;

        // crea la data que se enviara al handler seleccionado
        var data = {
            'trimmedPath': trimmedPath,
            'queryStringObject': queryStringObject,
            'method': method,
            'headers': headers,
            'payload': buffer
        };

        chosenHandler(data, function(statusCode, responsePayload){
            // valida que el status code sea numerico, si no usa por defecto 200
            statusCode = typeof(statusCode) == 'number' ? statusCode : 200;

            // valida que el payload que se entregara en el reponse sea un objeto, si no crea uno vacio
            responsePayload = typeof(responsePayload) == 'object' ? responsePayload : {};

            // convierte el objeto payload a un JSON string
            var payloadString = JSON.stringify(responsePayload);

            // enviar la respuesta
            res.setHeader('Content-Type','application/json')
            res.writeHead(statusCode);
            res.end(payloadString);

            // se manda al log la respuesta
            console.log('Returning this response: ', statusCode, payloadString);
        });
    });
};

// Define the handlers
var handlers = {};

// Ping handler
handlers.hello = function(data, callback) {
    callback(200, {'message' : 'Hello world! This is a very simple RESTful JSON API in NodeJS. Welcome!'});
};

// Not found handler
handlers.notFound = function(data, callback) {
    callback(404);
};

// Define a request router
var router = {
    'hello': handlers.hello,
};