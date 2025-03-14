const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

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
    } else {
        console.log('Tabela financial_data criada com sucesso');
    }
    db.close();
});
