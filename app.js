// Módulo HTTP
var http = require('http');

// Módulo File System
var fs = require('fs');

// Cria o objeto server
var app = http.createServer(callback);

app.listen(3000); // Especifica a porta que vai escutar as requisições

function callback(req, res) {

     // Nome do arquivo
     var filename = req.url == "/" ? 'index.html' : __dirname + req.url;

     fs.readFile(filename,
          function (err, data) {
               if (err) {
                    res.writeHead(404);
                    return res.end('Arquivo não encontrado!');
               }

               if (req.url.indexOf(".css") != -1)
                    res.setHeader('content-type', 'text/css');
               else if (req.url.indexOf(".js") != -1)
                    res.setHeader('content-type', 'text/javascript');
               else
                    res.setHeader('content-type', 'text/html');

               res.writeHead(200);
               res.end(data);
          }
     );
}

// -----------------------------------------------------------------------------------

// Módulo Database
var db = require('./db');

// Módulo Socket.IO
var io = require('socket.io')(app);

// Conexão do cliente com o servidor
io.on("connection", function (socket) {

     socket.on("nova jogada", function (params, callback) {
          io.sockets.emit("nova jogada", params);
          if (callback) callback();
     });

     socket.on("novo jogo", function (params, callback) {
          io.sockets.emit("novo jogo", params);
          if (callback) callback();
     });

     socket.on("exibir placar", function (params, callback) {

          db.getScore((err, result) => {
               if (err) { return console.log(err); }
               io.sockets.emit("exibir placar", result);
               if (callback) callback();
          });

     });

     socket.on("zerar placar", function (params, callback) {
          db.resetScoreboard((err, result) => {
               if (err) { return console.log(err); }
               io.sockets.emit("zerar placar", params);
               if (callback) callback();
          });
     });

     socket.on("vitoria", function (params, callback) {

          db.updateScore(params.name, params.points, (err, result) => {
               if (err) { return console.log(err); }
          });

          if (callback) callback();
     });
});