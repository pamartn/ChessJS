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
	this.board;
}

Game.prototype.remove = function(player){
	// Remove player if white or black
	if(player === this.white)
		this.white = null;
	if(player === this.black)
		this.black = null;
	
	// Remove game from list if is empty	
	if(this.black === null && this.white === null)
		for(var i = 0; i < games.length; i++)
			if(games[i] === this){
				games = games[i].splice(i, 1);
				break;
			}
}

var games = [];

io.sockets.on('connection', function (socket) {
	
	//Player identify himself
	socket.on('username', function(username) {
		socket.p = new Player(username, socket);
		socket.emit('game_list', games);
	}
	// Player wants to create a new game
	socket.on('game_create', function(game_name) {
		// Create new games and push it to game list
		socket.game = new Game(game_name, socket.p);
		games.push(socket.game);
		
		// Notify player that he is connected
		socket.emit('game_connect', socket.game);
	}
	// Player wants the game list
	socket.on('game_list', function() {
		socket.emit('game_list', games);
	}
	// Player wants to connect to a game
	socket.on('game_connect', function(game_name) {
		// Search game
		for(var i = 0; i < games.length; i++)
			if(games[i].name === game_name){
				// Try to join game then emit if ok
				if(games[i].join(socket.p)){
					socket.game = games[i];
					socket.emit('game_connect', socket.game);
					break;
				}
			}
	}
	//Disconnect player
	socket.on('disconnect', function () {
		if(socket.game.isPlaying(socket.p))
			socket.game.remove(socket.p);
		socket.p = null;
	});
});

server.listen(8080);
