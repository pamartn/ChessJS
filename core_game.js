/*
 *	Author: Pamart Nicolas
 *	Github : pamartn
 *	Purpose : Shool
 *	Created in February 2016
 *
 *	License : GNU General public license
 */
var board;

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

