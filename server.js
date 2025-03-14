const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');

const app = express();
const port = 3001; // Porta do servidor

// Verifica se a pasta 'database' existe, caso contrário, cria a pasta
const dbPath = path.join(__dirname, 'database');
if (!fs.existsSync(dbPath)) {
    fs.mkdirSync(dbPath);
}

// Cria ou abre o banco de dados SQLite
const dbFile = path.join(dbPath, 'financial_calendar.db');
const db = new sqlite3.Database(dbFile, (err) => {
    if (err) {
        console.error('Erro ao conectar ao banco de dados:', err);
        return;
    }
    console.log('Conectado ao banco de dados SQLite');
});

// Cria a tabela financial_data se não existir
db.run(`
    CREATE TABLE IF NOT EXISTS financial_data (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        date TEXT NOT NULL,
        name TEXT NOT NULL,
        value REAL NOT NULL,
        category TEXT NOT NULL,
        type TEXT NOT NULL
    )
`, (err) => {
    if (err) {
        console.error('Erro ao criar tabela:', err);
    }
});

// Middleware para permitir CORS
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Rota para salvar dados financeiros
app.post('/save', (req, res) => {
    console.log('Requisição para salvar dados financeiros recebida:', req.body);
    const { date, name, value, category, type } = req.body;
    const query = `
        INSERT INTO financial_data (date, name, value, category, type)
        VALUES (?, ?, ?, ?, ?)
    `;
    db.run(query, [date, name, value, category, type], function(err) {
        if (err) {
            console.error('Erro ao salvar dados financeiros:', err);
            res.status(500).send('Erro ao salvar dados financeiros');
            return;
        }
        res.send('Dados financeiros salvos com sucesso');
    });
});

// Rota para buscar todos os dados financeiros
app.get('/data', (req, res) => {
    console.log('Requisição para buscar dados financeiros recebida');
    const query = 'SELECT * FROM financial_data';
    db.all(query, (err, rows) => {
        if (err) {
            console.error('Erro ao buscar dados financeiros:', err);
            res.status(500).send('Erro ao buscar dados financeiros');
            return;
        }
        res.json(rows);
    });
});

// Inicia o servidor na porta especificada
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
