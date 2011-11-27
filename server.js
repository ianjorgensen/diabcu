var diabcu = require('./diabcu');
var config = require('./config');
var server = require('router').create();
var buffoon = require('buffoon');
var bark = require('bark');
var parse = require('url').parse;
var qs = require('querystring');

//var readings = [4,1,1,1,1,2,1,3,4,2,1,2,1,2,1,2,4,2,1,1,2,1,1,2,4,2,2,3,3,1,2,2,4,3,1,1,1,2,3,2,4,1,1,2,1,2,3,1,4,3,3,1,2,1,2,3,4,0,0,0,0,0,0,0];
var readings = [4,1,1,1,1,2,1,3,4,2,1,2,1,2,1,2,4,2,1,1,2,1,1,2,4,2,2,3,3,1,2,2,4,3,1,1,1,2,3,2,4,1,1,2,1,2,3,1,4,3,3,1,2,1,2,3,4,3,3,1,0,0,0,0];

var values = [4, 4, 4, 4, 2, 2, 3, 4, 4, 4, 4, 3, 4, 4, 3, 4, 4, 3, 3, 3, 4, 4, 4, 4, 4, 4, 4, 2, 4, 4, 2, 4, 4, 3, 4, 3, 1, 2, 4, 4, 2, 5, 1, 2, 4, 4, 4, 4, 4, 4, 4, 4, 4, 6, 5, 4, 4, 4, 4, 4, 4, 7, 4, 4];
var update = function() {
	diabcu.display(config.email, config.password, function(err, data) {
		if (data) { 
			readings = data;	
		}
	});
};

setInterval(update,180000);
update();


server.get('/', function(request, response) {
	response.writeHead(200, {'content-type':'application/json'});
	response.end(JSON.stringify(readings));
});

server.get('/loadxls', function(request, response) {
	diabcu.parseXLS(function(err, data) {
		if (data) { 
			readings = data;	
		}
		response.writeHead(200, {'content-type':'application/json'});
		response.end(JSON.stringify(readings));
	});
});

server.get('/force', function(request, response) {
	diabcu.display(config.email, config.password, function(err, data) {
		if (data) { 
			readings = data;	
		}
		response.writeHead(200, {'content-type':'application/json'});
		response.end(JSON.stringify(readings));
	}); 
});

var state = 'random';

server.get('/remote', function(request, response) {
	response.writeHead(200, {'content-type':'application/json'});
	response.end('remote feed');
	state = 'remote';
});


server.get('/diabetes', function(request, response) {
	response.writeHead(200, {'content-type':'application/json'});
	response.end('diabetes feed');
	state = 'diabetes';
});

server.get('/random', function(request, response) {
	response.writeHead(200, {'content-type':'application/json'});
	response.end('random feed');
	state = 'random';
});

var heart = [0, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0];
server.get('/heart', function(request, response) {
	response.writeHead(200, {'content-type':'application/json'});
	response.end('heart feed');
	state = 'heart';
});

var smile = [4, 4, 4, 0, 0, 0, 0, 0, 4, 5, 5, 0, 3, 3, 0, 0, 4, 5, 5, 0, 0, 3, 0, 0, 4, 4, 0, 0, 0, 3, 1, 0, 4, 4, 0, 0, 0, 3, 1, 0, 4, 5, 5, 0, 0, 3, 0, 0, 4, 5, 5, 0, 3, 3, 0, 0, 4, 4, 4, 0, 0, 0, 0, 0];
server.get('/smile', function(request, response) {
	response.writeHead(200, {'content-type':'application/json'});
	response.end('smile feed');
	state = 'smile';
});

var sad = [4, 4, 4, 0, 0, 0, 0, 0, 4, 5, 5, 0, 0, 0, 3, 0, 4, 5, 5, 0, 0, 3, 0, 0, 4, 4, 0, 0, 0, 3, 0, 0, 4, 4, 0, 0, 0, 3, 0, 0, 4, 5, 5, 0, 0, 3, 0, 0, 4, 5, 5, 0, 0, 0, 3, 0, 4, 4, 4, 0, 0, 0, 0, 0];
server.get('/sad', function(request, response) {
	response.writeHead(200, {'content-type':'application/json'});
	response.end('sad feed');
	state = 'sad';
});

var clown = [4, 4, 4, 4, 0, 0, 0, 0, 4, 5, 5, 0, 0, 3, 3, 3, 4, 5, 5, 0, 0, 3, 0, 3, 4, 0, 0, 1, 1, 3, 0, 3, 4, 0, 0, 1, 1, 3, 0, 3, 4, 5, 5, 0, 0, 3, 0, 3, 4, 5, 5, 0, 0, 3, 3, 3, 4, 4, 4, 4, 0, 0, 0, 0];
server.get('/clown', function(request, response) {
	response.writeHead(200, {'content-type':'application/json'});
	response.end('clown feed');
	state = 'clown';
});

server.get('/feed', function(request, response) {
	var data = [];
	
	switch(state) {
		case 'diabetes':
			data = readings;
		break;
		case 'remote':
			data = values;
		break;
		case 'smile':
			data = smile;
		break;
		case 'sad':
			data = sad;
		break;
		case 'clown':
			data = clown;
		break;
		case 'heart':
			data = heart;
		break;
		default:
			for(var i = 0; i < 64; i++) {
				data.push(Math.round(Math.random() * 7));
			}
		break;
	}
	
	response.writeHead(200, {'content-type':'application/json'});
	response.end(JSON.stringify(data));
});

server.get('/updateremote', function(request, response) {
	response.writeHead(200, {'content-type':'application/json'});

	query = qs.parse(parse(request.url).query);
	
	if(query.values) {
		var qval = JSON.parse(query.values);	
		if (qval.length == 64) {
			values = qval;
			response.end('updated!')
			return;
		}
	}

	response.end('fail!');
});

server.get('/frame', bark.file('./matrix.html'));

server.get('/js/*', bark.file('./js/{*}'));

var port = process.argv[2] || 10545;

server.listen(port);

console.log('server running on port ', port);