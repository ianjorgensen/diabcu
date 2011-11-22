var diabcu = require('./diabcu');
var config = require('./config');
var server = require('router').create();

server.get('/', function(request, response) {
	diabcu.display(config.email, config.password, function(err, data) {
		response.writeHead(200, {'content-type':'application/json'});
		response.end(JSON.stringify(data));
	}); 
});

server.get('/offline', function(request, response) {
	diabcu.parseXLS(function(err, data) {
		response.writeHead(200, {'content-type':'application/json'});
		response.end(JSON.stringify(data));
	});
});

server.listen(8484);