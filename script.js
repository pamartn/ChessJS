/*
 *	Author: Pamart Nicolas
 *	Github : pamartn
 *	Purpose : Shool
 *	Created in February 2016
 *
 *	License : GNU General public license
 */


var canvas;
var gfx;
var board;
var chessSymbols;
var highlightedCells = [];
var choosenPiece;

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

Piece.prototype.getMoves = function() {
	var moves = [];
	moves.push([this.line, this.column]);
	return moves;
}

Piece.prototype.sortMoves = function(moves) {
	var x, y;
	for(var i = 0; i < moves.length; i++) {
		y = moves[i][0];
		x = moves[i][1];
		if(x < 0 || x >= board[0].length || y < 0 || y >= board.length)
			moves = moves.splice(i, 1);
	}
	return moves;
}
		
// Constructeur du type Pawn, observez attentivement l'appel au constructeur de Piece !
// pieceId correspond aux coordonnées d'extraction des images du pion en blanc puis noir
var Pawn = function(color, line, column) {
	Piece.prototype.constructor.call(this, 'Pawn', color, line, column);
	this.pieceId = [[0, 5], [480, 5]];
}
Pawn.prototype = new Piece();

Pawn.prototype.getMoves = function() {
	var moves = [];
	moves.push([this.line+this.orientation(), this.column]);
	return this.sortMoves(moves);
}


// Constructeur du type Rook, observez attentivement l'appel au constructeur de Piece !
// pieceId correspond aux coordonnées d'extraction des images du pion en blanc puis noir
var Rook = function(color, line, column) {
    Rook.prototype.constructor.call(this, 'Rook', color, line, column);
    this.pieceId = [[240, 5], [720, 5]];
}
Rook.prototype = new Piece();

Rook.prototype.getMoves = function() {
	var moves = [];
	var up = true;
	var down = true;
	var left = true;
	var right = true;
	for(var i = 1; i < board.length; i++) {
		if(down && isEmpty(this.line + i, this.column))
			moves.push([this.line + i, this.column]);
		else
			down = false;
		if(up && isEmpty(this.line - i, this.column))
			moves.push([this.line - i, this.column]);
		else
			up = false;
		if(right && isEmpty(this.line, this.column + i))
			moves.push([this.line, this.column + i]);
		else
			right = false;
		if(left && isEmpty(this.line, this.column - i))
			moves.push([this.line, this.column - i]);
		else
			left = false;

	}
	return this.sortMoves(moves);
}
// Constructeur du type Knight, observez attentivement l'appel au constructeur de Piece !
// pieceId correspond aux coordonnées d'extraction des images du pion en blanc puis noir
var Knight = function(color, line, column) {
    Knight.prototype.constructor.call(this, 'Knight', color, line, column);
    this.pieceId = [[80, 5], [560, 5]];
}
Knight.prototype = new Piece();


// Constructeur du type Bishop, observez attentivement l'appel au constructeur de Piece !
// pieceId correspond aux coordonnées d'extraction des images du pion en blanc puis noir
var Bishop = function(color, line, column) {
    Bishop.prototype.constructor.call(this, 'Bishop', color, line, column);
    this.pieceId = [[160, 5], [640, 5]];
}
Bishop.prototype = new Piece();


// Constructeur du type King, observez attentivement l'appel au constructeur de Piece !
// pieceId correspond aux coordonnées d'extraction des images du pion en blanc puis noir
var King = function(color, line, column) {
    King.prototype.constructor.call(this, 'King', color, line, column);
    this.pieceId = [[320, 5], [800, 5]];
}
King.prototype = new Piece();


// Constructeur du type Queen, observez attentivement l'appel au constructeur de Piece !
// pieceId correspond aux coordonnées d'extraction des images du pion en blanc puis noir
var Queen = function(color, line, column) {
    Queen.prototype.constructor.call(this, 'Queen', color, line, column);
    this.pieceId = [[400, 5], [880, 5]];
}
Queen.prototype = new Piece();


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
	return lig >= 0 && col >= 0 && lig < board.length && col < board[0].length && board[lig][col].name === 'empty'; 
}
var move = function(lig, col, piece){
	var x = piece.line;
	var y = piece.column;
	var tmp = board[lig][col];
	piece.line = lig;
	piece.column = col;
	board[lig][col] = piece;
	tmp.line = x;
	tmp.column = y;
	board[x][y] = tmp;
}


var initBoard = function() {
	board = createBoard(8, 8);
	//Pawn
	for(var i = 0; i < board.length; i++){
		board[1][i] = new Pawn('white', 1, i);
		board[6][i] = new Pawn('black', 6, i);
	}	
	//Rook
	board[0][0] = new Rook('white', 0, 0);
	board[0][7] = new Rook('white', 0, 7);
	board[7][0] = new Rook('black', 7, 0);
	board[7][7] = new Rook('black', 7, 7);
	//Knight
	board[0][1] = new Knight('white', 0, 1);
	board[0][6] = new Knight('white', 0, 6);
	board[7][1] = new Knight('black', 7, 1);
	board[7][6] = new Knight('black', 7, 6);
	//Bishop
	board[0][2] = new Bishop('white', 0, 2);
	board[0][5] = new Bishop('white', 0, 5);
	board[7][2] = new Bishop('black', 7, 2);
	board[7][5] = new Bishop('black', 7, 5);
	//King
	board[0][4] = new King('white', 0, 4);
	board[7][3] = new King('black', 7, 3);
	//Queen	
	board[0][3] = new Queen('white', 0, 3);
	board[7][4] = new Queen('black', 7, 4);
}

var convertCoordinates = function(ligPixel, colPixel) {
    var lig = Math.ceil(ligPixel / (canvas.height/8)) - 1;
    var col = Math.ceil(colPixel / (canvas.width /8)) - 1;
    return [lig, col];
}


var drawCell = function(coord, color, width, height){
	var cell = board[coord[0]][coord[1]];
	var imod = coord[0]%2 === 0;
	var jmod = coord[1]%2 === 0;
	var bgColor = 'white';
	//Draw background color
	if(imod && jmod || !imod && !jmod)
		bgColor = 'grey';
	gfx.fillStyle = bgColor;
	gfx.fillRect(cell.column*width, cell.line*height, width, height);

	//Draw highlight circle if needed
	if(color !== 'none') {
		gfx.fillStyle = color;
		var radius = width/4;
		gfx.beginPath();
		gfx.arc(cell.column*width + width/2,cell.line*height + height/2,radius,0,2*Math.PI);
		gfx.fill();
		gfx.stroke();
	}

	//Draw piece image
	if(!isEmpty(cell.line, cell.column)){
		var id = cell.color === 'white' ? 0 : 1;
		gfx.drawImage(chessSymbols, cell.pieceId[id][0], cell.pieceId[id][1], 75, 75, cell.column * width, cell.line * height, width, height);	
	}
}
    
var highlight = function(on){
	for(var i = 0; i < highlightedCells.length; i++){
		var cell = highlightedCells[i];
		var color = on ? 'red' : 'none';
		drawCell(cell, color, canvas.width/board.length, canvas.height/board[0].length);
	}
}
    
var drawGrid = function(x, y, width, height, nbLig, nbCol) {
	var color;
	var tile_width = width/nbCol;
	var tile_height = height/nbLig;
	for(var i = 0; i < nbLig; i++)
		for(var j = 0; j < nbCol; j++)
			drawCell([i, j], 'none', tile_width, tile_height);
	gfx.strokeStyle = "black";
	gfx.fillStyle = "black";
	gfx.strokeRect(0,0, width, height);
}

var refreshView = function(){
    	drawGrid(0,0, canvas.width, canvas.height, 8, 8); 
}
var initGame = function(){
	chessSymbols = new Image();
	chessSymbols.src = 'res/chess.png';
	chessSymbols.onload = function() {
    		console.info("Chess symbols loaded !");
    		// dessine la grille, une fois l'image chargée
		initBoard();
		refreshView();
	};
	canvas = document.getElementById("screen");
	gfx = canvas.getContext("2d");

	canvas.addEventListener("mousedown", mouseClicked, false);
	function mouseClicked(event) {
		var ligCoord = event.pageY - canvas.offsetTop;
		var colCoord = event.pageX - canvas.offsetLeft;
		var coord    = convertCoordinates(ligCoord, colCoord);
		if (highlightedCells.length > 0) {
			highlight(false);
		}
		var piece = board[coord[0]][coord[1]];
		if (!isEmpty(coord[0], coord[1])) {
			choosenPiece = piece;
			var moves = piece.getMoves();
			highlightedCells = moves;
			highlight(true);
		} else {
			// TODO: if empty and highlighted, move the piece !
			// doMove();
			if(choosenPiece) {
				var cells = choosenPiece.getMoves();
				for(var i = 0; i < cells.length; i++) {
					if(cells[i][0] === piece.line && cells[i][1] === piece.column) {
						console.log("Correct move");
						move(piece.line, piece.column, choosenPiece);
						refreshView();
					}
				}
			}
		}
	}
}
window.onload = initGame;
