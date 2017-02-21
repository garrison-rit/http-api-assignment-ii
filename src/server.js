const http = require('http');

const htmlHandler = require('./htmlResponses.js');
// const textHandler = require('./textResponses.js');
const jsonHandler = require('./jsonResponses.js');
/*
const imageHandler = require('./imageResponses.js');*/

const port = process.env.PORT || process.env.NODE_PORT || 3000;

// creating the server
const onRequest = (request, response) => {
  console.log(request.url);

  switch (request.url.split('?')[0]) {
    case '/':
      htmlHandler.getIndex(request, response);
      break;
    case '/style.css':
      htmlHandler.getCSS(request, response);
      break;
    case '/getUsers':
      jsonHandler.getUsers(request, response);
      break;
    case '/addUser':
      jsonHandler.addUser(request, response);
      break;
    default:
      jsonHandler.notFound(request, response);
      break;
  }
};

http.createServer(onRequest).listen(port);

// let the world know we're listening
console.log(`Listening on 127.0.0.1: ${port}`);
