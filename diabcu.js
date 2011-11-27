var curly = require('curly');
var fs = require('fs');
var xls = require('xls');
var magic = require('./magic');
var login = require('./login').login;
var common = require('common');

var file = 'data.xls';

var parseXLS = function(callback) {
	xls.parse(file, function(err, data) {
		if (err) {
			callback(err);
			return;
		}
		
		callback(null, magic.display(data));
	});
};
exports.parseXLS = parseXLS;

exports.display = function(email, password, callback) {
	common.step([
		function(next) {
			login('petersorensen@live.com','kwadra84', next);
		},
		
		function(cookie, next) {
			ssid = cookie;
			curly.get('https://se.diasend.com/diasend/view.php?period=arbitrary&starttime=2000-11-6&endtime=3000-11-19')
				.headers({Cookie: ssid}, next);
		},
		function(data, next) {
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
		callback(err);
	});	
};