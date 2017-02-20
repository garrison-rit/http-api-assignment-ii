const fs = require('fs');
// our pages to serve
const index = fs.readFileSync(`${__dirname}/../client/client.html`);
const page2 = fs.readFileSync(`${__dirname}/../client/style.css`);

// serving the pages!
const getIndex = (request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/html' });
  response.write(index);
  response.end();
};

const getPage2 = (request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/css' });
  response.write(page2);
  response.end();
};

// expose the methods
module.exports.getIndex = getIndex;
module.exports.getCSS = getPage2;
