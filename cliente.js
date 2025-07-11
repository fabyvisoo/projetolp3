// Importações necessárias
const express = require('express');
const routes = express.Router();
const db = require('../db/connect');

// Rota GET - Listar todos os clientes
routes.get('/', async (req, res) => {
  const result = await db.query('SELECT * FROM cliente');
  res.status(200).json(result.rows);
});

// Rota POST - Cadastrar um novo cliente
routes.post('/', async (req, res) => {
  const { nome, email, telefone, endereco, cidade, uf } = req.body;

  if (!nome || !email || !telefone || !endereco || !cidade || !uf) {
    return res.status(400).json({ mensagem: 'Todos os campos são obrigatórios' });
  }

  const sql = `
    INSERT INTO cliente (nome, email, telefone, endereco, cidade, uf)
    VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`;

  const valores = [nome, email, telefone, endereco, cidade, uf];
  const result = await db.query(sql, valores);

  res.status(201).json(result.rows[0]);
});

// Rota PUT - Atualizar um cliente existente
routes.put('/:id', async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ mensagem: 'O id precisa ser informado' });
  }

  const { nome, email, telefone, endereco, cidade, uf } = req.body;

  if (!nome || !email || !telefone || !endereco || !cidade || !uf) {
    return res.status(400).json({ mensagem: 'Todos os campos são obrigatórios.' });
  }

  const sql = `
    UPDATE cliente
    SET nome = $1, email = $2, telefone = $3, endereco = $4, cidade = $5, uf = $6
    WHERE id = $7
    RETURNING *`;

  const valores = [nome, email, telefone, endereco, cidade, uf, id];
  const result = await db.query(sql, valores);

  if (result.rows.length === 0) {
    return res.status(404).json({ mensagem: 'Cliente não encontrado.' });
  }

  res.status(200).json(result.rows[0]);
});

// Rota DELETE - Excluir um cliente
routes.delete('/:id', async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ mensagem: 'O id precisa ser informado' });
  }

  const sql = `
    DELETE FROM cliente
    WHERE id = $1
    RETURNING *`;

  const valores = [id];
  const result = await db.query(sql, valores);

  if (result.rows.length === 0) {
    return res.status(404).json({ mensagem: 'Cliente não encontrado.' });
  }

  res.status(200).json({ mensagem: `Cliente com ID ${id} foi excluído com sucesso` });
});

// Exporta as rotas
module.exports = routes;
