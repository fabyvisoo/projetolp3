// Importações necessárias
const express = require('express');
const routes = express.Router();
const db = require('../db/connect');

// Rota GET - Listar todos os produtos
routes.get('/', async (req, res) => {
  const result = await db.query('SELECT * FROM produto');
  res.status(200).json(result.rows);
});

// Rota POST - Cadastrar um novo produto
routes.post('/', async (req, res) => {
  const { nome, marca, preco, peso } = req.body;

  if (!nome || !marca || !preco || !peso) {
    return res.status(400).json({ mensagem: 'Todos os campos são obrigatórios' });
  }

  const sql = `
    INSERT INTO produto (nome, marca, preco, peso)
    VALUES ($1, $2, $3, $4) RETURNING *`;

  const valores = [nome, marca, preco, peso];
  const result = await db.query(sql, valores);

  res.status(201).json(result.rows[0]);
});

// Rota PUT - Atualizar um produto existente
routes.put('/:id', async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ mensagem: 'O id precisa ser informado' });
  }

  const { nome, marca, preco, peso } = req.body;

  if (!nome || !marca || !preco || !peso) {
    return res.status(400).json({ mensagem: 'Todos os campos são obrigatórios.' });
  }

  const sql = `
    UPDATE produto
    SET nome = $1, marca = $2, preco = $3, peso = $4
    WHERE id = $5
    RETURNING *`;

  const valores = [nome, marca, preco, peso, id];
  const result = await db.query(sql, valores);

  if (result.rows.length === 0) {
    return res.status(404).json({ mensagem: 'Produto não encontrado.' });
  }

  res.status(200).json(result.rows[0]);
});

// Rota DELETE - Excluir um produto
routes.delete('/:id', async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ mensagem: 'O id precisa ser informado' });
  }

  const sql = `
    DELETE FROM produto
    WHERE id = $1
    RETURNING *`;

  const valores = [id];
  const result = await db.query(sql, valores);

  if (result.rows.length === 0) {
    return res.status(404).json({ mensagem: 'Produto não encontrado.' });
  }

  res.status(200).json({ mensagem: `Produto com ID ${id} foi excluído com sucesso` });
});

// Exporta as rotas
module.exports = routes;
