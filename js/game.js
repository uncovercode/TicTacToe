/**
 * Classe TicTacToe
 */
function TicTacToe() {

    // Jogador 1
    this.player1 = { name: "Jogador 1", symbol: "O", color: "#2ce0b7" };

    // Jogador 2
    this.player2 = { name: "Jogador 2", symbol: "X", color: "#33b4d6" };

    // Status do jogo (vitoria ou empate)
    this.status = "";

    // Jogador atual
    this.currentPlayer = this.player1;

    // Largura do canvas
    this.canvasWidth = 400;

    // Altura do canvas
    this.canvasHeight = 400;

    // Contexto de renderização do canvas
    this._ctx = null;

    // Matriz representando o tabuleiro
    this._matrix = null;

    // Indica se a partida está em andamento ou não
    this._isRunning = false;

    // Largura da coluna no tabuleiro
    this._colWidth = 0;

    // Altura da linha no tabuleiro
    this._colHeight = 0;

    // Método de inicialização
    this.init();
};

// Define o valor de algumas propriedades e inicia um novo jogo
TicTacToe.prototype.init = function () {
    var $canvas = $("canvas");

    // Dimensões do canvas
    $canvas[0].width = this.canvasWidth;
    $canvas[0].height = this.canvasHeight;
    $canvas[0].style.width = this.canvasWidth;
    $canvas[0].style.height = this.canvasHeight;

    // Dimensões das colunas (um terço da largura e da altura do canvas, respectivamente)
    this._colWidth = this.canvasWidth / 3;
    this._rowHeight = this.canvasHeight / 3;

    // Estamos dizendo que vamos desenhar imagens 2D
    this._ctx = $canvas[0].getContext("2d");

    this.newGame();
};

// Inicia um novo jogo
TicTacToe.prototype.newGame = function () {

    // Limpa o status
    this.status = "";

    // Limpa o canvas
    this._clearCanvas();

    // Limpa a matriz
    this._matrix = [
        ["", "", ""],
        ["", "", ""],
        ["", "", ""]
    ];

    // Limpa o resultado
    this._setResult('');

    // Cria um novo tabuleiro
    this._createBoard();

    // Altera a flag de jogo em andamento
    this._isRunning = true;
};

// Define uma nova jogada quando o jogador clica em uma região do canvas
TicTacToe.prototype.newPlay = function () {
    if (this._isRunning) {

        // Obtem a coluna e a linha onde o jogador clicou
        var col = Math.floor(event.offsetX / this._colWidth);
        var row = Math.floor(event.offsetY / this._rowHeight);

        // Verifica se a posição na matriz está vazia
        if (this._matrix[row][col] == "") {
            return { row: row, col: col };
        }
    }
    return { row: -1, col: -1 };
};

// Alterna entre um jogador e outro
TicTacToe.prototype.changePlayer = function () {
    if (this.currentPlayer.name == this.player2.name) {
        this.currentPlayer = this.player1;
    }
    else {
        this.currentPlayer = this.player2;
    }
};

// Desenha um símbolo no tabuleiro
TicTacToe.prototype.renderSymbol = function (row, col) {

    if (row != -1 && col != -1) {
        
        // Configura o canvas antes de desenhar o símbolo
        this._ctx.fillStyle = this.currentPlayer.color;
        this._ctx.font = (this.canvasWidth / 5) + "px Arial";
        this._ctx.textAlign = "center";
        this._ctx.textBaseline = "middle";
        this._ctx.fillText(this.currentPlayer.symbol, col * this._colWidth + this._colWidth / 2, row * this._rowHeight + this._rowHeight / 2);
        this._matrix[row][col] = this.currentPlayer.symbol;

        // Verifica se houve vitória ou empate e encerra o jogo
        if (this._isVictory()) {
            this._setResult(this.currentPlayer.name + " venceu!");
            this._isRunning = false;
        }
        else if (this._isTie()) {
            this._setResult("Empate!");
            this._isRunning = false;
        }
    }
};

// Verifica se houve empate
TicTacToe.prototype._isTie = function () {
    var count = 0;
    var cols = this._matrix[0].length;
    var rows = this._matrix.length;

    // Conta a quantidade de posições com algum símbolo e compara com o total de posições
    for (var i = 0; i < cols; i++) {
        for (var j = 0; j < rows; j++) {
            if (this._matrix[i][j] != "") {
                count++;
            }
        }
    }

    var isTie = count == cols * rows;

    if (isTie) {
        this.status = "empate";
    }

    return isTie;
};

// Verifica se houve vitória
TicTacToe.prototype._isVictory = function () {
    if (
        // Compara os símbolos na vertical
        this._compareSymbols(this._matrix[0][0], this._matrix[1][0], this._matrix[2][0]) ||
        this._compareSymbols(this._matrix[0][1], this._matrix[1][1], this._matrix[2][1]) ||
        this._compareSymbols(this._matrix[0][2], this._matrix[1][2], this._matrix[2][2]) ||

        // Compara os símbolos na horizontal
        this._compareSymbols(this._matrix[0][0], this._matrix[0][1], this._matrix[0][2]) ||
        this._compareSymbols(this._matrix[1][0], this._matrix[1][1], this._matrix[1][2]) ||
        this._compareSymbols(this._matrix[2][0], this._matrix[2][1], this._matrix[2][2]) ||

        // Compara os símbolos na diagonal
        this._compareSymbols(this._matrix[0][0], this._matrix[1][1], this._matrix[2][2]) ||
        this._compareSymbols(this._matrix[0][2], this._matrix[1][1], this._matrix[2][0])) {

        // Houve vitória
        this.status = "vitoria";

        return true;
    }
    return false;
};

// Compara três símbolos
TicTacToe.prototype._compareSymbols = function (a, b, c) {
    return a == b && b == c && c != "";
};

// Exibe o resultado
TicTacToe.prototype._setResult = function (text) {
    $("#result").html(text);
};

// Exibe o placar
TicTacToe.prototype.showScoreboard = function (score) {

    this._setResult('');
    this._clearCanvas();
    this._isRunning = false;
    this._ctx.fillStyle = "#ddd";
    this._ctx.font = "30px Arial";
    this._ctx.textAlign = "center";
    this._ctx.textBaseline = "top";

    this._clearCanvas();
    
    // Título
    this._ctx.fillText("Placar", this.canvasWidth / 2, 40);

    if (score == null) {
        this._ctx.fillText("Nenhum placar", this.canvasWidth / 2, this.canvasHeight / 3);
    }
    else {
        if (score.length > 0) {
            for (var i = 0; i < score.length; i++) {
                var player = score[i];
                this._ctx.fillText(player.name + ": " + player.score + " pontos", this.canvasWidth / 2, (i + 1) * 80 + 40);
            }
        }
        else {
            this._ctx.fillText("Nenhum placar", this.canvasWidth / 2, this.canvasHeight / 3);
        }
    }
};

// Limpa o canvas
TicTacToe.prototype._clearCanvas = function () {
    this._ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
};

// Cria o tabuleiro
TicTacToe.prototype._createBoard = function () {
    
    // Cor da linhas
    this._ctx.strokeStyle = "#596575";

    // Espessura das linhas
    this._ctx.lineWidth = 3;

    // Desenha a linha vertical 1
    this._ctx.beginPath();
    this._ctx.moveTo(this._colWidth, 0);
    this._ctx.lineTo(this._colWidth, this.canvasHeight);
    this._ctx.stroke();

    // Desenha a linha vertical 2
    this._ctx.beginPath();
    this._ctx.moveTo(2 * this._colWidth, 0);
    this._ctx.lineTo(2 * this._colWidth, this.canvasHeight);
    this._ctx.stroke();

    // Desenha a linha horizontal 1
    this._ctx.beginPath();
    this._ctx.moveTo(0, this._rowHeight);
    this._ctx.lineTo(this.canvasWidth, this._rowHeight);
    this._ctx.stroke();

    // Desenha a linha horizontal 2
    this._ctx.beginPath();
    this._ctx.moveTo(0, 2 * this._rowHeight);
    this._ctx.lineTo(this.canvasWidth, 2 * this._rowHeight);
    this._ctx.stroke();
};

