// const text = require('./textResponses.js');
const crypto = require('crypto');

const users = {};

let digest = crypto.createHash('sha1').update(JSON.stringify(users)).digest('hex');

const genEtag = () => {
  digest = crypto.createHash('sha1').update(JSON.stringify(users)).digest('hex');
};

// helper function
const getParam = (url, param) => {
  const lst = url.split(/[&?]/g);
  for (let i = 1; i < lst.length; i++) {
    if (lst[i].indexOf(param) === 0 && lst[i].indexOf('=') === param.length) {
      return lst[i].substr(lst[i].indexOf('=') + 1);
    }
  }
  return undefined;
};

const respondMeta = (num, modified, response) => {
    // write head
  response.writeHead(num, {
    'Content-Type': 'application/json',
    etag: digest,
  });// explicit as json is only supported type

  if (!modified) {
    response.end();
  }
};

const respondWrite = (obj, num, response) => {
  respondMeta(num, true, response);
  response.write(JSON.stringify(obj));
  response.end();
};


const getUsers = (request, response) => {
  // if (request.headers !== undefined) {
  const modified = request.headers['if-none-match'] !== digest;
  console.log(request.headers['if-none-match']);
  console.log(digest);
  // }
  const meta = request.header === 'HEAD';
  const respCode = modified ? 200 : 304;

  if (!meta && modified) {
    respondWrite({ users }, respCode, response);
  } else {
    respondMeta(respCode, false, response);
  }
};

const addUser = (request, response) => {
  const name = getParam(request.url, 'name');
  const age = getParam(request.url, 'age');

  if (name !== undefined && name !== '' && age !== '' && age !== undefined) {
    if (users[name] !== undefined) {
      users[name].age = age;
      respondMeta(204, false, response);
      genEtag();
      return;
    }
    const newUser = {
      name, age,
    };

    users[newUser.name] = newUser;
    respondWrite({ newUser }, 201, response);
    genEtag();
    return;
  }

  respondWrite({
    message: 'Name and age are both required.',
    id: 'missingParams',
  }, 400, response);
};

const notFound = (request, response) => {
  const meta = request.header === 'HEAD';
  const respCode = 404;

  if (meta) {
    respondMeta(respCode, false, response);
    return;
  }

  respondWrite({
    message: 'The page you are looking for was not found.',
    id: 'notFound',
  }, respCode, response);
};


// expose the methods
module.exports.getUsers = getUsers;
module.exports.notFound = notFound;
module.exports.addUser = addUser;
