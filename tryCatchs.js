import pg from 'pg';

const client = new pg.Client({
    user: 'postgres',
    password: '10203050',
    host: 'localhost',
    port: 5432,
    database: 'library'
})

client.connect();

export async function allBooks() {
    try {
        const res = await client.query('SELECT * FROM mybooks')
        return res.rows
    } catch (err) {
        console.error(err);
    }
}

export async function searchBookbyId(id) {
    try {
        const res = await client.query('SELECT * FROM mybooks')
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
