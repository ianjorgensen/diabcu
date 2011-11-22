var curly = require('curly');
var fs = require('fs');
var xls = require('xls');
var magic = require('./magic');
var login = require('./login').login;
var common = require('common');

var file = 'data-1.xls';
var sad = [ 1, 4, 4, 4, 4, 4, 4, 3,
			1, 0, 0, 0, 0, 0, 0, 3,
			1, 0, 1, 0, 0, 1, 0, 3,
			1, 0, 0, 0, 0, 0, 0, 3,
			1, 0, 0, 0, 0, 0, 0, 3,
			1, 0, 4, 4, 4, 4, 0, 3,
			1, 0, 4, 0, 0, 4, 0, 3,
			1, 0, 0, 0, 0, 0, 0, 3,
			1, 2, 2, 2, 2, 2, 2, 2,];


exports.parseXLS = function(callback) {
	xls.parse(file, function(err, data) {
		if (err) {
			callback(null, sad);
			return;
		}

		callback(null, magic.display(data));
	});
};

exports.display = function(email, password, callback) {
	common.step([
		function(next) {
			login('petersorensen@live.com','kwadra84', next);
		},
		
		function(cookie, next) {
			ssid = cookie;
			console.log(ssid);
			curly.get('https://se.diasend.com/diasend/view.php?period=arbitrary&starttime=2000-11-6&endtime=3000-11-19')
				.headers({Cookie: ssid}, next);
		},
		function(data, next) {
			console.log(data);
			curly.get('https://se.diasend.com/diasend/excel.php')
				.headers({Cookie: ssid})
				.to(fs.createWriteStream(file), next);	
		},
		function(next) {
			parseXLS(next);
		},
		function(display, next) {
			callback(null, display);
		}
	], function(err) {
		callback(null, sad);
	});	
};