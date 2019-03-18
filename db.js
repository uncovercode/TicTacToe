var mongoClient = require('mongodb').MongoClient;

var gameDb;

mongoClient.connect('mongodb://localhost:27017/game', { useNewUrlParser: true })
    .then(conn => {
        gameDb = conn.db("game");
    })
    .catch(err => console.log(err));

// Atualiza a pontuação pelo nome do jogador
function updateScore(name, points, callback) {

    // Procura o documento filtrando pelo nome do jogador
    gameDb.collection('scoreboard').findOne({ name: name }, function (err, player) {

        if (err) {
            console.log(err);
        }
        else {
            // Se o documento foi encontrado atualiza a pontuação, caso contrário, insere um novo
            if (player) {
                gameDb.collection('scoreboard').updateOne(
                    { "name": name },
                    { $set: { score: (player.score + points) } },
                    { upsert: true });
            }
            else {
                gameDb.collection('scoreboard').insertOne({ name: name, score: points }, callback);
            }
        }
    });

}

// Retorna a pontuação dos jogadores
function getScore(callback) {
    gameDb.collection('scoreboard').find({}).toArray(callback);
}

// Remove a pontuação dos jogadores
function resetScoreboard(callback) {
    gameDb.collection('scoreboard').deleteMany({}, callback);
}

module.exports = { updateScore, getScore, resetScoreboard };