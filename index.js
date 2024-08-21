import express from 'express';
import bodyParser from 'body-parser';
import * as  banck from './tryCatchs.js'

const app = express();
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static('public'));

app.get('/', async (req, res) => {
    res.render('inicial.ejs');
})

app.get('/mybooks', async (req, res) => {
    const bookid = await banck.allBooks()
    res.render("my_books.ejs", {
        bookid: bookid
    })
})
app.get('/home', async (req, res) => {
    res.render("inicial.ejs")
})
app.get('/preface', async (req, res) => {

    res.render("preface.ejs", {
    })
})
app.listen(3000, () => {
    console.log("porta 3000")
})