var defaultCorsHeaders = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'access-control-allow-headers': 'Origin, X-Requested-With, Content-Type, Accept, Authorization',
  'access-control-max-age': 10 // Seconds.
};

var data = {results: []};

var requestHandler = function(request, response) {
  var statusCode = 200;
  var headers = defaultCorsHeaders;
  headers['Content-Type'] = 'text/plain, application/json';
  headers['Allow'] = 'POST, GET, PUT, DELETE, OPTIONS';
  const method = request.method;
  const url = request.url;

  console.log('Serving request type ' + request.method + ' for url ' + request.url);

  if (request.method === 'OPTIONS') {

    response.writeHead(200, headers);
    response.end();

  } else if (request.method === 'GET' && request.url.includes('/classes/messages')) {

    response.writeHead(200, headers);
    response.end(JSON.stringify(data));

  } else if (request.method === 'POST' && request.url.includes('/classes/messages')) {

    response.writeHead(201, headers);
    request.on('data', (chunk) => {
      
      var chunkObj = JSON.parse(chunk);
      var messageObj = {};

      messageObj.username = chunkObj.username;
      messageObj.text = chunkObj.text;
      messageObj.roomname = chunkObj.roomname;
      messageObj['message_id'] = new Date();

      data.results.push(messageObj);
    }).on('end', () => {

      response.end(JSON.stringify(data));
    });

  } else if (request.url !== '/classes/messages') {
    response.writeHead(404, headers);

    response.end();
  }

};

exports.requestHandler = requestHandler;

