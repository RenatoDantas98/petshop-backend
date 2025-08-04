const express = require('express'); 
const cors = require('cors');
const db = require('./db'); // Importa conexão com o banco

const app = express();
const PORT = 3001;

// Configurações
app.use(cors());              // Permite acesso de outros domínios
app.use(express.json());      // Permite JSON no corpo da requisição

// Rota POST para check-in
app.post('/checkin', (req, res) => {
    const { nomeDono, nomePet, especie, raca, banho, observacoes } = req.body;

    const stmt = db.prepare(`
        INSERT INTO checkins (nome_dono, nome_pet, especie, raca, banho, observacoes, data_checkin)
        VALUES (?, ?, ?, ?, ?, ?, datetime('now'))
    `);
    stmt.run(nomeDono, nomePet, especie, raca, banho, observacoes, function (err) {
        if (err) {
            return res.status(500).json({ erro: err.message });
        }
        res.json({ id: this.lastID });  // Corrigido para enviar id
    });
});

app.get('/checkins/:id', (req, res) => {
  const id = req.params.id;

  db.get('SELECT * FROM checkins WHERE id = ?', [id], (err, row) => {
    if (err) {
      return res.status(500).json({ erro: err.message });
    }
    if (!row) {
      return res.status(404).json({ erro: 'Check-in não encontrado' });
    }
    res.json(row);
  });
});

// Rota GET para listar check-ins
app.get('/checkins', (req, res) => {
    db.all(`SELECT * FROM checkins ORDER BY data_checkin DESC`, (err, rows) => {
        if (err) {
            return res.status(500).json({ erro: err.message });
        }
        res.json(rows);
    });
});

// Rota DELETE para remover check-in pelo id
app.delete('/checkins/:id', (req, res) => {
  const id = req.params.id;

  const stmt = db.prepare(`DELETE FROM checkins WHERE id = ?`);
  stmt.run(id, function(err) {
    if (err) {
      return res.status(500).json({ erro: err.message });
    }
    if (this.changes === 0) {
      return res.status(404).json({ erro: "Check-in não encontrado." });
    }
    res.json({ mensagem: "Check-in removido com sucesso." });
  });
});

// Rota DELETE para limpar todos os check-ins
app.delete('/checkins', (req, res) => {
  const stmt = db.prepare(`DELETE FROM checkins`);
  stmt.run(function(err) {
    if (err) {
      return res.status(500).json({ erro: err.message });
    }
    res.json({ mensagem: `${this.changes} check-ins removidos com sucesso.` });
  });
});

// Inicia o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
