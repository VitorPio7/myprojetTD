import express from 'express';
import bodyParser from 'body-parser';
import axios from 'axios';
import pg from 'pg';


const app = express();
app.use(express.json());
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
    try {
        await books.query(
            'INSERT INTO mybooks (name, autor, language, image, description, type, pages, date) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)',
            [title, autor, language, img, description, subject, pages, date]
        );
        res.redirect('/')
    } catch (error) {
        res.status(404).send(error)
    }

})
app.get('/myAnnotations/:id', async (req, res) => {
    const idBook = parseInt(req.params.id, 10);
    if (isNaN(idBook)) {
        return res.status(400).send('Invalid ID');
    }
    console.log(idBook);
    try {
        const bookid = (await books.query('SELECT * FROM mybooks WHERE id = $1', [idBook])).rows;
        const myAnnotations = (await books.query('SELECT * FROM annotations WHERE book_id = $1', [idBook])).rows;
        res.render('My_annotations.ejs', {
            bookid: bookid,
            myAnnotations: myAnnotations
        });
    } catch (error) {
        res.status(500).send('Server Error');
    }
})
app.get('/remove/:id', async (req, res) => {
    const idBook = parseInt(req.params.id, 10)
    console.log(idBook)
    try {
        await books.query('DELETE FROM mybooks WHERE id = $1', [idBook])
        res.redirect('/')
    } catch (error) {
        res.status(404).send(error)
    }
})

app.post('/putChange/:id', async (req, res) => {

    const { text } = req.body;
    console.log("TEXT", text)
    // const idBook = req.params.id;
    // const newText = req.body.newText;
    // const nume = req.body.num;
    // console.log(nume)
    // console.log(`Received ID: ${idBook}, newText: ${newText}`);
    // try {
    //     const result = await books.query('UPDATE annotations SET annotation_text = $1 WHERE id = $2 RETURNING *', [newText, idBook])
    //     if (result.rowCount === 0) {
    //         return res.status(404).json({ success: false, message: 'ID not found' });
    //     }
    //     res.redirect(`/putChange/${idBook}`).json({ success: true, data: result.rows[0] });
    // } catch (error) {
    //     console.error(error);
    //     res.status(500).json({ success: false, message: 'Server error' });
    // }


})
app.listen(3000, () => {
    console.log("porta 3000")
})