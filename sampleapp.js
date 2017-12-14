var http	= require('http'),
		fs		= require('fs'),
		ejs		= require('ejs'),
		url		= require('url'),
		qs		= require('querystring');

var template = fs.readFileSync('./template.ejs', 'utf8');
var content2 = fs.readFileSync('./content2.ejs', 'utf8');
var content3 = fs.readFileSync('./content3.ejs', 'utf8');
var content4 = fs.readFileSync('./content4.ejs', 'utf8');

var routes = {
	"/": {
		"title": "Main Page",
		"message": "これはサンプルのページです。",
		"content": content2
	},
	"/index": {
		"title": "Main Page",
		"message": "これはサンプルのページです。",
		"content": content2
	},
	"/other": {
		"title": "Other Page",
		"message": "別のページです。",
		"content": content3
	},
	"/post": {
		"title": "Post Page",
		"content": content4
	}
};

// 外部ファイルにあるJSの読み込み&実行
var export_function = require('./export.js');
export_function.func1();
export_function.func2('hoge');

// サーバーの作成
var server = http.createServer();
server.on('request', doRequest);
server.listen(1234);
console.log('Server running!');

// リクエストの処理
function doRequest(req, res){
	var url_parts = url.parse(req.url);
	// console.log(url_parts);
	// return;

	// route check
	if(routes[url_parts.pathname] == null){
		if(req.url == '/favicon.ico'){
			return;
		}
		console.log("NOT FOUND PAGE: " + req.url);
		res.writeHead(200, {'Content-Type': 'text/html'});
		res.write("<html><body><h1>NOT FOUND PAGE:" + req.url + "</h1></body></html>");
		res.end();
		return;
	}

	// page render
	// get
	if(req.method == "GET"){
		var content = ejs.render(template, {
			title: routes[url_parts.pathname].title,
			content: ejs.render(
				routes[url_parts.pathname].content,
				{
					message: routes[url_parts.pathname].message
				}
			)
		});
		res.writeHead(200, {'Content-Type': 'text/html'});
		res.write(content);
		res.end();
		return;
	}else if(req.method == "POST"){
		if(url_parts.pathname == "/post"){
			var body = '';
			req.on('data', function(data){
				body += data;
			});
			req.on('end', function(){
				var post = qs.parse(body);
				var content = ejs.render(template, {
					title: routes[url_parts.pathname].title,
					content: ejs.render(
						routes[url_parts.pathname].content,
						{
							idname: post.idname,
							pass: post.pass
						}
					)
				});
				res.writeHead(200, {'Content-Type': 'text/html'});
				res.write(content);
				res.end();
				return;
			});
		}else{
			res.writeHead(200, {'Content-Type': 'text/plain'});
			res.write("NO-POST!!");
			res.end();
			return;
		}
	}
}
