/*
 *	Author: Pamart Nicolas
 *	Github : pamartn
 *	Purpose : Shool
 *	Created in February 2016
 *
 *	License : GNU General public license
 */

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
	var matrix = [[1, 0, true], [-1, 0, true], [0, 1, true], [0, -1, true]];
	for(var i = 1; i < board.length; i++)
		for(var j = 0; j < matrix.length; j++){
			var cell = matrix[j];
			var line = this.line + (cell[0]*i);
			var column = this.column + (cell[1]*i);
			if(cell[2] && isEmpty(line, column))
				moves.push([line, column]);
			else
				matrix[j][2] = false;
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

Knight.prototype.getMoves = function() {
	var moves = [];
	var matrix = [[-2, -1], [2, -1], [1, -2], [1, 2]];
	for(var i = 0; i < matrix.length; i++)
		for(var j = 0; j < 2; j++) {
			var sens = j === 0 ? 1 : -1;
			var line = this.line + (matrix[i][0] * sens);
			var column = this.column + (matrix[i][1] * sens);
			if(isEmpty(line, column))
				moves.push([line, column]);
		}
	return this.sortMoves(moves);
}
// Constructeur du type Bishop, observez attentivement l'appel au constructeur de Piece !
// pieceId correspond aux coordonnées d'extraction des images du pion en blanc puis noir
var Bishop = function(color, line, column) {
    Bishop.prototype.constructor.call(this, 'Bishop', color, line, column);
    this.pieceId = [[160, 5], [640, 5]];
}
Bishop.prototype = new Piece();

Bishop.prototype.getMoves = function() {
	var moves = [];
	var matrix = [[1, 1, true], [-1, -1, true], [-1, 1, true], [1, -1, true]];
	for(var i = 1; i < board.length; i++)
		for(var j = 0; j < matrix.length; j++){
			var cell = matrix[j];
			var line = this.line + (cell[0]*i);
			var column = this.column + (cell[1]*i);
			if(cell[2] && isEmpty(line, column))
				moves.push([line, column]);
			else
				matrix[j][2] = false;
		}
	return this.sortMoves(moves);
}
// Constructeur du type King, observez attentivement l'appel au constructeur de Piece !
// pieceId correspond aux coordonnées d'extraction des images du pion en blanc puis noir
var King = function(color, line, column) {
    King.prototype.constructor.call(this, 'King', color, line, column);
    this.pieceId = [[320, 5], [800, 5]];
}
King.prototype = new Piece();

King.prototype.getMoves = function() {
	var moves = [];
	for(var i = -1; i < 2; i++)
		for(var j = -1; j < 2; j++)
			if(isEmpty(i+this.line, j+this.column))
				moves.push([i+this.line, j+this.column]);
	return this.sortMoves(moves);
}

// Constructeur du type Queen, observez attentivement l'appel au constructeur de Piece !
// pieceId correspond aux coordonnées d'extraction des images du pion en blanc puis noir
var Queen = function(color, line, column) {
    Queen.prototype.constructor.call(this, 'Queen', color, line, column);
    this.pieceId = [[400, 5], [880, 5]];
}
Queen.prototype = new Piece();

Queen.prototype.getMoves = function() {
	var moves = [];
	var matrix = [[1, 1, true], [-1, -1, true], [-1, 1, true], [1, -1, true], [1, 0, true], [-1, 0, true], [0, 1, true], [0, -1, true]];
	for(var i = 1; i < board.length; i++)
		for(var j = 0; j < matrix.length; j++){
			var cell = matrix[j];
			var line = this.line + (cell[0]*i);
			var column = this.column + (cell[1]*i);
			if(cell[2] && isEmpty(line, column))
				moves.push([line, column]);
			else
				matrix[j][2] = false;
		}
	return this.sortMoves(moves);
}
