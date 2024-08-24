import express from 'express';
import bodyParser from 'body-parser';
import * as  banck from './tryCatchs.js'
import axios from 'axios';

const app = express();
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static('public'));
const bookId = 1
const bookPreface = await banck.searchBookbyId(bookId)

/*Routes Home*/

app.get('/', async (req, res) => {
    const bookid = await banck.allBooks()
    res.render("my_books.ejs", {
        bookid: bookid
    })
})
app.post('/search', async (req, res) => {

    try {
        const bodyReq = req.body.search;
        const response = await axios.get(`https://openlibrary.org/search.json?q=${bodyReq}&limit=10`);
        const cover = response.data.docs[2].cover_edition_key
        const autor = response.data.docs[2].author_alternative_name[11];
        const date = response.data.docs[2].first_publish_year
        const pages = response.data.docs[2].first_publish_year
        const subject = response.data.docs[2].subject_key[Math.round(subject_key.length * Math.random())]
        res.render("preface.ejs", {
            cover: cover,
            autor: autor,
            date: date,
            pages: pages,
            subject: subject,
            description:
        })
    }
    catch (err) {
        console.log(err)
    }
})
/*Routes my books */


/*Routes Preface*/
app.get('/preface', async (req, res) => {
    res.render("preface.ejs", {
        bookPreface: bookPreface
    })
})
app.get('/home', async (req, res) => {
    res.render("inicial.ejs")
})
/*routes My annotations */
app.get('/MyAnnotations', async (req, res) => {
    res.render("My_annotations.ejs", {
        bookPreface: bookPreface
    })
})
app.get('/edit', async (req, res) => {
    res.render("add_annotations.ejs")
})
app.delete('/delete', async (req, res) => {

})

app.get('/add_annotaions', async (req, res) => {
    res.render("add_annotations.ejs")

})
app.post('/send', async (req, res) => {
    const changeText = req.body.inputText;
    const banckText = await editAnnotationBook(changeText, bookId)
    res.redirect("/MyAnnotations");
})
app.listen(3000, () => {
    console.log("porta 3000")
})