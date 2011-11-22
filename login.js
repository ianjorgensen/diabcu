var curly = require('curly');
var querify = require('querystring').stringify;
var common = require('common');

exports.login = function(user, password, callback) {
	curly.post('https://se.diasend.com/diasend/login.php')
		.headers({
			Host:'se.diasend.com',
			Origin:'http://diasend.com',
			Referer:'http://diasend.com/site/index.php?lang=sv',
			'content-type':'application/x-www-form-urlencoded',
			'User-Agent':'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_7_2) AppleWebKit/535.2 (KHTML, like Gecko) Chrome/15.0.874.121 Safari/535.2'
		})
		.follow(false)
		.allow(302)
		.head(true)
		.send(querify({
			user:user,
			passwd:password,
			submit:'Logga in',
			lang:'swedish'
		}), common.fork(callback, function(headers) {
			if (!headers['set-cookie']) {
				callback(new Error('set-cookie header missing'));
			}
			callback(null, headers['set-cookie'][0]);
		}));
};