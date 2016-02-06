var fs = require('fs');
var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);


app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res) {
    res.setHeader('Content-Type', 'text/html');
	fs.readFile('index.html', 'utf-8', function(error, content) {
        res.writeHead(200, {"Content-Type": "text/html"});
	res.end(content);
    });
});

var Player = function(username, socket) {
	this.socket = socket;
	this.username = username;
}

var Game = function(game_name, creator){
	this.name = game_name;
	this.white = creator;
	this.black;
}

var games = [];

io.sockets.on('connection', function (socket) {
	
	//Player identify himself
	socket.on('username', function(username) {
		socket.p = new Player(username, socket);
	}
	// Player wants to create a new game
	socket.on('game_create', function(game_name) {
		socket.game = new Game(game_name, socket.p);
	}
	// Player wants the game list
	socket.on('game_list', function() {
			
	}
	// Player wants to connect to a game
	socket.on('game_connect', function() {
		
	}
	//Disconnect player
	socket.on('disconnect', function () {
	
	});
	
});

server.listen(8080);
