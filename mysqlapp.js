var mysql			= require('mysql'),
		ConfigFile	= require('config');

// mysqlの接続設定
var connection = mysql.createConnection({
	host		: ConfigFile.mysql.host,
	user		: ConfigFile.mysql.user,
	password: ConfigFile.mysql.pass,
	database: ConfigFile.mysql.database
});

// mysqlの接続とその確認
connection.connect(function(err){
  // エラー処理
	if(err){
		console.error('error connecting: ' + err.stack);
		return;
	}

	// console.log('connected as id ' + connection.threadId);
});

// mysqlでqueryの使用
connection.query('SELECT * FROM test', function(error, results, fields){
	if(error){throw error;}

	console.log(results);
});

connection.end();
