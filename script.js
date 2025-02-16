let board = null;
let game = new Chess();
let $status = $('#status');

function onDragStart(source, piece, position, orientation) {
    // Only allow white pieces to be dragged (player is white)
    if (game.game_over() || piece.search(/^b/) !== -1) {
        return false;
    }
}

function makeRandomMove() {
    const possibleMoves = game.moves();

    // Game over
    if (possibleMoves.length === 0) return;

    const randomIdx = Math.floor(Math.random() * possibleMoves.length);
    game.move(possibleMoves[randomIdx]);
    board.position(game.fen());
    updateStatus();
}

function onDrop(source, target) {
    // Check if the move is legal
    const move = game.move({
        from: source,
        to: target,
        promotion: 'q' // Always promote to queen for simplicity
    });

    // Illegal move
    if (move === null) return 'snapback';

    updateStatus();

    // Make the AI move after a short delay
    setTimeout(makeRandomMove, 250);
}

function updateStatus() {
    let status = '';

    if (game.in_checkmate()) {
        status = 'Game over, ' + (game.turn() === 'w' ? 'black' : 'white') + ' wins!';
    } else if (game.in_draw()) {
        status = 'Game over, drawn position';
    } else {
        status = (game.turn() === 'w' ? 'White' : 'Black') + ' to move';
        if (game.in_check()) {
            status += ', ' + (game.turn() === 'w' ? 'White' : 'Black') + ' is in check';
        }
    }

    $status.html(status);
}

function onSnapEnd() {
    board.position(game.fen());
}

// Board configuration
const config = {
    draggable: true,
    position: 'start',
    onDragStart: onDragStart,
    onDrop: onDrop,
    onSnapEnd: onSnapEnd,
    pieceTheme: 'https://chessboardjs.com/img/chesspieces/wikipedia/{piece}.png'
};

// Initialize the board
board = Chessboard('board', config);

// Add event listener for the reset button
$('#resetBtn').on('click', function() {
    game = new Chess();
    board.position('start');
    updateStatus();
});

updateStatus(); 