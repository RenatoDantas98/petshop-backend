const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./checkin.db');

// Cria a tabela se ela ainda não existir
db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS checkins (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome_dono TEXT,
            nome_pet TEXT,
            especie TEXT,
            raca TEXT,
            banho TEXT,
            observacoes TEXT,
            data_checkin TEXT
        )
    `);
});

module.exports = db;
