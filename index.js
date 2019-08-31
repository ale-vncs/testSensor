const express = require('express');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;

const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const uri = "mongodb+srv://Nugou:253726867@clustertest-kpogq.mongodb.net/test?retryWrites=true&w=majority";
const port = 3000;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
let db = null;
app.use(bodyParser.json());

app.use(express.static(__dirname ));
//app.set('view engine','ejs');
//app.set('views', __dirname + '/views');

client.connect(err => {
    db = client.db("sensor");
    // perform actions on the collection object
    app.listen(process.env.PORT || port, function () {
        console.log('Server executando na porta ' + this.address().port);
    });

    //client.close();
});

io.on('connection', () => {
    console.log('socket on');
});

app.get('/', (req, res) => {
    //res.render('show.ejs', { data: results });
    //res.render('show.ejs');
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