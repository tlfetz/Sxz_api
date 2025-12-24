const express = require("express");
const cors = require("cors");
const crypto = require("crypto");

const app = express();
app.use(cors());
app.use(express.json());

const accessCodes = {};
const keys = {};

// gera código ao entrar
app.get("/generate-code", (req, res) => {
    const code = crypto.randomBytes(4).toString("hex").toUpperCase();
    accessCodes[code] = { approved: false };
    res.json({ code });
});

// DEV aprova código
app.post("/approve-code", (req, res) => {
    const { code } = req.body;
    if (!accessCodes[code]) return res.status(404).json({ error: "Código inválido" });
    accessCodes[code].approved = true;
    res.json({ success: true });
});

// verifica permissão
app.get("/check-code/:code", (req, res) => {
    const data = accessCodes[req.params.code];
    res.json({ approved: data?.approved || false });
});

// gera key
app.get("/generate-key/:code", (req, res) => {
    const data = accessCodes[req.params.code];
    if (!data || !data.approved) {
        return res.status(403).json({ error: "Sem permissão" });
    }

    if (!keys[req.params.code]) {
        const rand = Math.floor(100000 + Math.random() * 900000);
        keys[req.params.code] = `SxzHub-Premium_${rand}`;
    }

    res.json({ key: keys[req.params.code] });
});

app.listen(3000, () => {
    console.log("SXZ API rodando");
});
