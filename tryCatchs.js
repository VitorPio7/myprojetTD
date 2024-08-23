import pg from 'pg';

const books = new pg.Client({
    user: 'postgres',
    password: '10203050',
    host: 'localhost',
    port: 5432,
    database: 'library'
})


books.connect();

export async function allBooks() {
    try {
        const res = await books.query('SELECT * FROM mybooks')
        return res.rows
    } catch (err) {
        console.error(err);
    }
}

export async function searchBookbyId(id) {
    try {
        const res = await books.query('SELECT * FROM mybooks WHERE id = $1', [id])
        return res.rows
    } catch (err) {
        console.error(err);
    }
}
export async function searchBook(info) {
    try {
        const response = await axios.get(`https://openlibrary.org/search.json?q=${info}`);
        return response.data
    } catch (err) {
        console.error(err);
    }
}

export async function editAnnotationBook(text, id) {
    try {
        const res = await books.query('UPDATE annotations SET annotationText = $1 WHERE id = $2 ', [text, id])
        return res.rows
    } catch (err) {
        console.error(err);
    }
}