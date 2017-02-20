// const text = require('./textResponses.js');

const requestOutline = (obj, num, type, response) => {
  let stringMessage;
  console.log(type);

  if (type === 'text/xml') {
    if (obj.id !== undefined) { stringMessage = `<response><message>${obj.message}</message><id>${obj.id}</id></response>`; } else { stringMessage = `<response><message>${obj.message}</message>response>`; }
    response.writeHead(num, { 'Content-Type': 'text/xml' });
  } else {
    stringMessage = JSON.stringify(obj);
    response.writeHead(num, { 'Content-Type': 'application/json' });// explicit as json is default type
  }
  response.write(stringMessage);
  response.end();
};

const getParam = (url, param) => {
  const lst = url.split('?');
  for (let i = 1; i < lst.length; i++) {
    if (lst[i].indexOf(param) === 0 && lst[i].indexOf('=') === param.length) {
      return lst[i].substr(lst[i].indexOf('=') + 1);
    }
  }
  return undefined;
};

const getSuccess = (request, response) => {
  let header;
  if (request.headers !== undefined) {
    header = request.headers.accept;
  }
  requestOutline({
    message: 'This is a successful response',
    id: 'Success',
  }, 200, header, response);
};

const badRequest = (request, response) => {
  let header;

  if (request.headers !== undefined) {
    header = request.headers.accept;
  }
  if (getParam(request.url, 'valid') === 'true') {
    requestOutline({
      message: 'The request has the required paramaters',
    }, 200, header, response);
    return;
  }

  requestOutline({
    message: 'Missing valid query parameter set to true',
    id: 'badRequest',
  }, 400, header, response);
};

const unauthorized = (request, response) => {
  let header;

  if (request.headers !== undefined) {
    header = request.headers.accept;
  }
  if (getParam(request.url, 'loggedIn') === 'yes') {
    requestOutline({
      message: 'You have successfully viewed the content.',
    }, 200, header, response);
    return;
  }

  requestOutline({
    message: 'Missing loggedIn query parameter set to yes.',
    id: 'unauthorized',
  }, 401, header, response);
};

const forbidden = (request, response) => {
  let header;

  if (request.headers !== undefined) {
    header = request.headers.accept;
  }

  requestOutline({
    message: 'You do not have access to this content.',
    id: 'forbidden',
  }, 403, header, response);
};

const internal = (request, response) => {
  let header;

  if (request.headers !== undefined) {
    header = request.headers.accept;
  }
  requestOutline({
    message: 'Internal server error. Something went wrong.',
    id: 'internalError',
  }, 500, header, response);
};

const notFound = (request, response) => {
  let header;

  if (request.headers !== undefined) {
    header = request.headers.accept;
  }
  requestOutline({
    message: 'The page you are looking for was not found.',
    id: 'notFound',
  }, 404, header, response);
};

const notImplemented = (request, response) => {
  let header;

  if (request.headers !== undefined) {
    header = request.headers.accept;
  }
  requestOutline({
    message: 'A get request for this page has not been implemented yet. Check again later for updated content.',
    id: 'notImplemented',
  }, 501, header, response);
};


// expose the methods
module.exports.getSuccess = getSuccess;
module.exports.badRequest = badRequest;
module.exports.unauthorized = unauthorized;
module.exports.internal = internal;
module.exports.forbidden = forbidden;
module.exports.notFound = notFound;
module.exports.notImplemented = notImplemented;
