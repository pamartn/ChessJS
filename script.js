var canvas;
var gfx;
var board;
// définition du constructeur du type Piece
var Piece = function(name, color, line, column){
    this.name    = name   || 'empty'; // si il n'y a pas de paramètre 'name', utiliser 'empty' 
    this.line    = line   || 0;
    this.column  = column || 0;
    this.color   = color  || 'grey';
    this.pieceId = undefined;
};

// définition d'une méthode du type Piece: il est crucial de la créer 
// au niveau du prototype et non pas de l'objet !
// Cette fonction sera pratique pour calculer le déplacement des pièces
// quelle que soit leur orientation
Piece.prototype.orientation = function() {
    return (this.color === 'white') ? +1 : -1;
}

// Constructeur du type Pawn, observez attentivement l'appel au constructeur de Piece !
// pieceId correspond aux coordonnées d'extraction des images du pion en blanc puis noir
var Pawn = function(color, line, column) {
    Piece.prototype.constructor.call(this, 'Pawn', color, line, column);
    this.pieceId = [[0, 5], [480, 5]];
}
Pawn.prototype = new Piece();

var createBoard = function(nbLine, nbColumn){
	var b = [];
	for(var i = 0; i < nbLine; i++){
		var lig = [];
		for(var j = 0; j < nbColumn; j++)
			lig.push(new Piece('empty', 'grey', i, j));
		b.push(lig);
	}
	return b;
} 
var isEmpty = function(lig, col){
	return board[lig][col].name === 'empty'; 
}
var put = function(lig, col, piece){
	var x = piece.line;
	var y = piece.column;
	var tmp = board[lig][col];
	piece.x = lig;
	piece.y = col;
	board[lig][col] = piece;
	tmp.line = x;
	tmp.column = y;
	board[x][y] = tmp;
}


var initBoard = function() {
	board = createBoard(8, 8);
	for(var i = 0; i < board.length; i++)
		board[i][1] = new Pawn('white', i, 1);		
}

var convertCoordinates = function(ligPixel, colPixel) {
    var lig = Math.ceil(ligPixel / (canvas.height/8)) - 1;
    var col = Math.ceil(colPixel / (canvas.width /8)) - 1;
    return [lig, col];
}

var highlightedCells = [];

var drawCell = function(coord, color, width, height){
	var cell = board[coord[0]][coord[1]];
	if(!isEmpty(coord[0], coord[1])){
		console.dir(cell);
		gfx.drawImage(chessSymbols, cell.pieceId[0][0], cell.pieceId[0][1], 75, 75, cell.line * width, cell.column * height, width, height);	
	}
}
    
//var highlight = function(on)
    
var drawGrid = function(x, y, width, height, nbLig, nbCol) {
	var color;
	var tile_width = width/nbLig;
	var tile_height = height/nbCol;
	for(var i = 0; i < nbLig; i++)
		for(var j = 0; j < nbCol; j++){
			if( (i % 2 == 0))
				if(j % 2 == 0)
					color = 'grey';
				else
					color = 'white';	
			else
				if(j % 2 == 0)
					color = 'white';
				else
					color = 'grey';
			gfx.fillStyle = color;
			gfx.fillRect( x + tile_width*i , y + tile_height*j, tile_width, tile_height );
			drawCell([i, j], 'none', tile_width, tile_height);
		}
	gfx.strokeStyle = "black";
	gfx.fillStyle = "black";
	gfx.strokeRect(0,0, width, height);
}
var chessSymbols;
var initGame = function(){
	chessSymbols = new Image();
	chessSymbols.src = 'chess.png';
	chessSymbols.onload = function() {
    		console.info("Chess symbols loaded !");
    		// dessine la grille, une fois l'image chargée
		initBoard();
    		drawGrid(0,0, canvas.width, canvas.height, 8, 8); 
	};
	canvas = document.getElementById("screen");
	gfx = canvas.getContext("2d");
	

	canvas.addEventListener("mousedown", mouseClicked, false);
	//var mouseClicked = function(event) { // Pourquoi cela ne fonctionne pas avec var ?!
	function mouseClicked(event) {
		var ligCoord = event.pageY - canvas.offsetTop;
		var colCoord = event.pageX - canvas.offsetLeft;
		var coord    = convertCoordinates(ligCoord, colCoord);
		console.info(coord);
		if (highlightedCells.length > 0) {
			highlight(false);
			highlightedCells = [];
		}
		var piece = board[coord[0]][coord[1]];
		if (piece.name !== '.') {
			var moves = piece.getMoves();
			highlightedCells.push(moves);
			highlight(true);
		} else {
			// TODO: if empty and highlighted, move the piece !
			// doMove();
		}
	}
	console.log("coucou");
}
window.onload = initGame;
