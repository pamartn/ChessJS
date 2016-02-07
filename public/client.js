var init = function(){
	socket = io.connect('http://localhost:8080');	

	// Add event on refresh button
	var button = document.getElementById("refresh");
	button.addEventListener('click',
		function() {
			console.log("request refresh");
			socket.emit('game_list');
		}
	, false);
	
	//Create socket listeners
	socket.on('game_list', function(games) {
		console.log("game list");
		var list = document.getElementById('game_list');
		list.innerHTML = "<h2>Server List</h2>";
		for(var i = 0; i < games.length; i++)
			list.innerHTML = list.innerHTML + "<p>"+ games.name +"</p>";
	});
	socket.on('game_connect', function() {
		console.log("connected")
	});
	
	//Connect to server
	var name = prompt("Votre pseudo", "");
	socket.emit('username', name);
	socket.emit('game_create', "coucou");
	socket.emit('game_list');
	
}

window.onload = init;
