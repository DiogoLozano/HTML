const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const db = new sqlite3.Database('./blog.db');

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');

// Banco de dados
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS posts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      titulo TEXT,
      resumo TEXT,
      conteudo TEXT
    )
  `);
});

// Rotas
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'Projects.html')); // Página inicial
});

app.get('/blog', (req, res) => {
  db.all('SELECT * FROM posts', [], (err, rows) => {
    if (err) return res.send('Erro ao acessar posts.');
    res.render('blog', { posts: rows });
  });
});

app.get('/cadastrar', (req, res) => {
  res.sendFile(path.join(__dirname, 'cadastrar_post.html'));
});

app.post('/cadastrar', (req, res) => {
  const { titulo, resumo, conteudo } = req.body;
  db.run('INSERT INTO posts (titulo, resumo, conteudo) VALUES (?, ?, ?)',
    [titulo, resumo, conteudo],
    (err) => {
      if (err) return res.send('Erro ao cadastrar post.');
      res.redirect('/blog');
    });
});

// Inicia na porta 80
app.listen(80, () => {
  console.log('Servidor rodando na porta 80');
});
