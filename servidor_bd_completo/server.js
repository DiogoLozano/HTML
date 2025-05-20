
const express = require('express');
const app = express();
const path = require('path');

app.use(express.urlencoded({ extended: true }));
app.use(express.static('public')); // Para CSS

const users = []; // Simulando banco

// Porta 80
app.listen(80, () => {
  console.log('Servidor rodando na porta 80');
});

// Rota padrão redireciona para Projects.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'Projects.html'));
});

// Rota para cadastro
app.get('/cadastra', (req, res) => {
  res.sendFile(path.join(__dirname, 'Cadastro.html'));
});

// Rota para login
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'Login.html'));
});

// POST do cadastro
app.post('/cadastra', (req, res) => {
  const { username, password } = req.body;
  users.push({ username, password });
  res.render('resposta', { sucesso: true, username });
});

// POST do login
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username && u.password === password);
  res.render('resposta', { sucesso: !!user, username });
});

// EJS
app.set('view engine', 'ejs');
app.post('/cadastra', (req, res) => {
  const { username, password } = req.body;

  // Simples verificação se já existe (evita duplicatas)
  if (!users.find(u => u.username === username)) {
    users.push({ username, password });
    res.render('cadastroConcluido', { username }); // <-- redireciona aqui
  } else {
    res.send('Usuário já existe. <a href="/cadastra">Voltar</a>');
  }
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;

  const user = users.find(u => u.username === username && u.password === password);

  if (user) {
    res.render('loginSucesso', { username });
  } else {
    res.render('resposta', { sucesso: false, username }); // ou redirecione para uma página de erro
  }
});