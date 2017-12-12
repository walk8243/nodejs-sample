var http	= require('http'),
		fs		= require('fs'),
		ejs		= require('ejs'),
		url		= require('url');

var template = fs.readFileSync('./template.ejs', 'utf8');
var content2 = fs.readFileSync('./content2.ejs', 'utf8');
var content3 = fs.readFileSync('./content3.ejs', 'utf8');

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
	}
};

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
		console.log("NOT FOUND PAGE: " + req.url);
		res.writeHead(200, {'Content-Type': 'text/html'});
		res.write("<html><body><h1>NOT FOUND PAGE:" + req.url + "</h1></body></html>");
		res.end();
		return;
	}

	// page render
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
}
