import express, { query } from 'express';
import bodyParser from 'body-parser';
import axios from 'axios';
import pg from 'pg';
import session from 'express-session';
import passport from 'passport';
import { Strategy } from 'passport-local';
import bcrypt, { hash } from 'bcrypt';
import env from "dotenv";

env.config();
const app = express();
const saltRounds = 10;
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
}))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(passport.initialize());
app.use(passport.session());
const books = new pg.Client({
    user: process.env.USER_SECRET,
    password: process.env.USER_PASSWORD,
    host: process.env.HOST_NAME,
    port: process.env.PORT_NUMBER,
    database: process.env.DATABASE_NAME
})
books.connect()

/*Routes Home*/
app.get('/loginAccount', (req, res) => {
    res.render('loginAndSignUp.ejs')
})

app.get('/myBooks', async (req, res) => {
    try {
        if (req.isAuthenticated) {
            const bookid = (await books.query('SELECT * FROM mybooks')).rows
            res.render("my_books.ejs", {
                bookid: bookid
            })
        } else {
            res.redirect('/login')
        }
    } catch (err) {
        console.err(err);
    }
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
    try {
        if (req.isAuthenticated()) {
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
        } else {
            res.redirect("/loginAccount")
        }

    } catch (error) {
        console.error(error);
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
    try {
        await books.query('DELETE FROM mybooks WHERE id = $1', [idBook])
        res.redirect('/myBooks')
    } catch (error) {
        res.status(404).send(error)
    }
})
app.get('/search-suggestions', async (req, res) => {
    const query = req.query.q;
    try {
        const response = await axios.get(`https://www.googleapis.com/books/v1/volumes`, {
            params: {
                q: query,
                maxResults: 10
            }
        });
        const suggestion = response.data.items.map(item => ({
            title: item.volumeInfo.title
        }));
        res.json(suggestion);
    } catch (error) {
        console.log('Erro to search suggestions: ', err);
        res.status(500).send('Erro to search suggestions')
    }
})
app.get('/home', async (req, res) => {
    try {
        if (req.isAuthenticated()) {
            res.redirect("/myBooks")
        } else {
            res.redirect("/loginAccount")
        }
    } catch (err) {
        console.err(err);
    }
})
app.post('/edit/:id', async (req, res) => {
    const catchidBody = req.params.id;
    const { text } = req.body;
    try {
        const result = await books.query('UPDATE annotations SET annotation_text = $1 WHERE id = $2 RETURNING *', [text, catchidBody])
        if (result.rowCount === 0) {
            return res.status(404).json({ success: false, message: 'ID not found' });
        }
        res.status(200).json({ message: "all right" })
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
})
app.post('/delete/:id', async (req, res) => {
    const catchid = req.body.idMain;
    const catchidBody = req.params.id;
    console.log("isso: " + catchidBody)
    console.log("isso id: " + catchid)
    try {
        await books.query('DELETE FROM annotations WHERE id = $1', [catchidBody])
        res.redirect(`/myAnnotations/${catchid}`)
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }

})
app.post('/add-text/:id', async (req, res) => {

    const book_id = req.params.id;
    const text_book = req.body.infoText;

    try {
        await books.query('INSERT INTO annotations(annotation_text,book_id) VALUES($1,$2)', [text_book, book_id])
        res.redirect(`/myAnnotations/${book_id}`)
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }

});
app.post('/login', passport.authenticate("local", {
    successRedirect: "/myBooks",
    failureRedirect: "/myBooks"
}))
app.post("/signup", async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    try {
        const checkResult = await books.query("SELECT * FROM users WHERE email = $1", [
            email
        ]);
        if (checkResult.rows.length > 0) {
            req.redirect("/loginAccount")
        } else {
            bcrypt.hash(password, saltRounds, async (err, hash) => {
                if (err) {
                    console.error("Error hashing password:", err);
                } else {
                    const result = await books.query("INSERT INTO users (email,password) VALUES ($1, $2) RETURNING *", [email, hash])
                    const user = result.rows[0];
                    req.login(user, (err) => {
                        console.log("sucess");
                        res.redirect("/myBooks")
                    })
                }
            });
        }
    } catch (error) {
        console.log(error);
    }

})
passport.use("local", new Strategy(
    async function verify(username, password, cb) {
        try {
            const result = await books.query("SELECT * FROM users WHERE email = $1", [
                username
            ]);
            if (result.rows.length > 0) {
                const user = result.rows[0];
                const myPlaintextPassword = user.password;
                bcrypt.compare(password, myPlaintextPassword, function (err, valid) {
                    if (err) {
                        console.error("Error comparing passwords:", err);
                        return cb(err);
                    } else {
                        if (valid) {
                            return cb(null, user);
                        } else {
                            return cb(null, false);
                        }
                    }
                });
            } else {
                return cb("User not found")
            }
        } catch (err) {
            console.log(err);
        }
    }
));
passport.serializeUser((user, cb) => {
    cb(null, user);
});

passport.deserializeUser((user, cb) => {
    cb(null, user);
});


app.listen(3000, () => {
    console.log("porta 3000")
})
