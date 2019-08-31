const express = require('express');
const MongoClient = require('mongodb').MongoClient;

const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const uri = "mongodb+srv://Nugou:253726867@clustertest-kpogq.mongodb.net/test?retryWrites=true&w=majority";
const port = process.env.PORT || 3000;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
let db = null;

io.on('connection', (socket) => {
    console.log('socket on');
    socket.on('chat', function(msg){
        io.emit('chat message', msg);
    });
});


app.use(express.json());

app.use(express.static(__dirname ));

client.connect(err => {
    db = client.db("sensor");
    // perform actions on the collection object
    server.listen(port, function () {
        console.log('Server executando na porta ' + this.address().port);
    });

    //client.close();
});

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.get('/data', (req, res) => {
    db.collection('data').find().toArray((err, results) => {
        if (err) return console.log(err);
        //console.log(results);
        res.send(results);
    });
});

app.post('/register', (req, res) => {
    console.log(req.body);
    db.collection('data').insert(req.body, (err, result) => {
        if (err) return console.log(err);

        io.emit('info', req.body);
        console.log('Salvo no banco');
        res.sendStatus(200);
    });
});