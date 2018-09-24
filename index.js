const express = require('express');
const helmet = require('helmet');
const knex = require('knex');

const dbConfig = require('./knexfile');

const db = knex(dbConfig.development);

const server = express();

server.use(express.json());
server.use(helmet());

server.get('/', (req, res) => {
    res.send('API needs a break');
});


// add a note
server.post('/api/notes', (req, res) => {
    const newNote = req.body;
    const { title, content } = req.body;
    if (!title || !content) {
        res.status(400).json({ errorMessage: 'A note title and content are required' });
        return;
    }
    db.insert(newNote)
        .into('notes')
        .then(ids => {
            res.status(201).json(ids);
        })
        .catch(err => res.status(500).json(err));
});

// get the list of notes
server.get('/api/notes', (req, res) => {
    db('notes')
        .then(notes => {
            res.status(200).json(notes);
        })
        .catch(err => res.status(500).json(err));
});


const port = 8000;
server.listen(port, function() {
    console.log(`\n=== Web API Listening on http://localhost:${port} ===\n`);
});