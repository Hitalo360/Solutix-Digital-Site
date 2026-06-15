const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// ==================== ROTAS ====================

app.get("/", (req, res) => {
    res.send("API SoluTIx Online");
});

app.get("/healthz", (req, res) => {
    res.status(200).send("OK");
});

app.post("/cotacao", (req, res) => {
    const {
        protocolo,
        nome,
        cargo,
        orgao,
        email,
        telefone,
        uf,
        observacoes,
        servicos,
        plano,
        subtotal,
        fator,
        total
    } = req.body;

    const sql = `
        INSERT INTO cotacoes 
        (protocolo, nome, cargo, orgao, email, telefone, uf, observacoes, servicos, plano, subtotal, fator, total)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(
        sql,
        [
            protocolo,
            nome,
            cargo,
            orgao,
            email,
            telefone,
            uf,
            observacoes,
            JSON.stringify(servicos),
            plano,
            subtotal,
            fator,
            total
        ],
        (err, result) => {
            if (err) {
                return res.status(500).json({ erro: err.message });
            }

            res.json({
                sucesso: true,
                id: result.insertId
            });
        }
    );
});

// ==================== CONEXÃO COM O BANCO ====================

const db = mysql.createConnection({
    host: process.env.MYSQLHOST,
    user: process.env.MYSQLUSER,
    password: process.env.MYSQLPASSWORD,
    database: process.env.MYSQLDATABASE,
    port: process.env.MYSQLPORT
});

db.connect((err) => {
    if (err) {
        console.error("Erro ao conectar no banco de dados:", err);
    } else {
        console.log("Banco de dados conectado com sucesso!");
    }
});

// ==================== INICIAR SERVIDOR ====================

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
