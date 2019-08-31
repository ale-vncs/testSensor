const express = require('express');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;

const app = express();
const uri = "mongodb+srv://Nugou:253726867@clustertest-kpogq.mongodb.net/test?retryWrites=true&w=majority";
const port = 3000;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
let db = null;
client.connect(err => {
    db = client.db("sensor");
    // perform actions on the collection object
    app.listen(port, function () {
        console.log('Server executando na porta ' + port);
    });

    //client.close();
});

app.use(bodyParser.json());

app.use(express.static(__dirname + '/public'));
app.set('view engine','ejs');
app.set('views', __dirname + '/views');


app.get('/', (req, res) => {
    db.collection('data').find().toArray((err, results) => {
        if (err) return console.log(err);
        res.render('show.ejs', { data: results });
        console.log(results);
    });
});

app.post('/register', (req, res) => {
    console.log(req.body);
    db.collection('data').insert(req.body, (err, result) => {
        if (err) return console.log(err);

        console.log('Salvo no banco');
        res.sendStatus(200);
    });
});