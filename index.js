import express from 'express';
import bodyParser from 'body-parser';
import axios from 'axios';
import pg from 'pg';


const app = express();
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static('public'));

const books = new pg.Client({
    user: 'postgres',
    password: '10203050',
    host: 'localhost',
    port: 5432,
    database: 'library'
})
books.connect()

/*Routes Home*/

app.get('/', async (req, res) => {
    const bookid = (await books.query('SELECT * FROM mybooks')).rows
    res.render("my_books.ejs", {
        bookid: bookid
    })
})
app.post('/search', async (req, res) => {

    try {
        const bodyReq = req.body.search;
        const response = await axios.get(`https://www.googleapis.com/books/v1/volumes?q=${bodyReq}`);
        const arrLivros = response.data.items;
        const random = Math.floor(Math.random() * arrLivros.length);
        const title = response.data.items[random].volumeInfo.title;
        const autor = response.data.items[random].volumeInfo.authors[0];
        const date = response.data.items[random].volumeInfo.publishedDate;
        const language = response.data.items[random].volumeInfo.language;
        const pages = response.data.items[random].volumeInfo.pageCount;
        const description = response.data.items[random].volumeInfo.description;
        const subject = response.data.items[random].volumeInfo.categories[0];
        const img = response.data.items[random].volumeInfo.imageLinks.thumbnail
        res.render("preface.ejs", {
            autor: autor,
            date: date,
            title: title,
            language: language,
            pages: pages,
            description: description,
            subject: subject,
            img: img
        })
    }
    catch (err) {
        console.log(err)
    }
})
/*Routes my books */
app.post('/postBank', async (req, res) => {
    const title = req.body.title;
    const autor = req.body.autor;
    const date = req.body.date;
    const language = req.body.language;
    const pages = req.body.pages;
    const subject = req.body.subject;
    const description = req.body.description;
    const img = req.body.img;
    img.toString()
    console.log({ title, autor, date, language, pages, subject, description, img })
    await books.query(
        'INSERT INTO mybooks (name, autor, language, image, description, type, pages, date) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)',
        [title, autor, language, img, description, subject, pages, date]
    );
    res.redirect('/')

})
app.get('/myAnnotations/:id', async (req, res) => {
    const idBook = parseInt(req.params.id, 10);
    if (isNaN(idBook)) {
        return res.status(400).send('Invalid ID');
    }
    console.log(idBook);
    try {
        const bookid = (await books.query('SELECT * FROM mybooks WHERE id = $1', [idBook])).rows;
        res.render('My_annotations.ejs', { bookid: bookid });
    } catch (error) {
        res.status(500).send('Server Error');
    }
})

app.listen(3000, () => {
    console.log("porta 3000")
})