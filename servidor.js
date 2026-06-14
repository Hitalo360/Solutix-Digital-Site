const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Pudim@010989",
    database: "solutix"
});

db.connect((err) => {
    if(err){
        console.log(err);
    }else{
        console.log("Banco conectado!");
    }
});

app.post("/cotacao", (req,res)=>{

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
    (
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
    )
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
        (err,result)=>{
            if(err){
                return res.status(500).json(err);
            }

            res.json({
                sucesso:true,
                id:result.insertId
            });
        }
    );
});

app.listen(3000, ()=>{
    console.log("Servidor rodando na porta 3000");
});
