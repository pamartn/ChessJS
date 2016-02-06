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
var chessSymbols;
var highlightedCells = [];
var choosenPiece;

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
