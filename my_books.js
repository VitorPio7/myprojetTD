import express, { response } from 'express';
import bodyParser from 'body-parser';
import pg from 'pg';
import axios from 'axios';

const app = express();
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static('public'));

/*try and catch */
async function searchBook(info) {
    try {
        const response = await axios.get(`https://openlibrary.org/search.json?q=${info}`);
        return response.data
    } catch (err) {
        console.error(err);
    }
}
async function bookId() {
    try {
        const res = await client.query('SELECT * FROM mybooks')
        return res.rows
    } catch (err) {
        console.error(err);
    }
}


/*try and catch */
const client = new pg.Client({
    user: 'postgres',
    password: '10203050',
    host: 'localhost',
    port: 5432,
    database: 'library'
})

client.connect();

/*get database*/

app.get('/', async (req, res) => {
    const bookid = await bookId()
    res.render("my_books.ejs", {
        bookid: bookid
    })
})


app.listen(4000, () => {
    console.log("porta 4000")
})