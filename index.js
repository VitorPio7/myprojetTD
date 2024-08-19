import express from 'express';
import bodyParser from 'body-parser';
import pg from 'pg';

const app = express();
app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static('public'));


const client = new pg.Client({
    user: 'postgres',
    password: '10203050',
    host: 'localhost',
    port: 5432,
    database: 'Biblioteca'
})

client.connect();

app.get('/', (req, res) => {
    res.render('inicial.ejs');
})


app.listen(3000, () => {
    console.log("porta 3000")
})