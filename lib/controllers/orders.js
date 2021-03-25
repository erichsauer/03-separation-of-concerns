const { Router } = require('express');
const OrderService = require('../services/OrderService');

module.exports = Router()
  .post('/', (req, res, next) => {
    OrderService.create(req.body)
      .then((order) => res.send(order))
      .catch(next);
  })
  .get('/', (req, res, next) => {
    OrderService.retrieve()
      .then((order) => res.send(order))
      .catch(next);
  })
  .get('/:id', (req, res, next) => {
    OrderService.getById(req.params.id)
      .then((order) => res.send(order))
      .catch(next);
  })
  .put('/:id', (req, res, next) => {
    OrderService.updateById(req.params.id, req.body)
      .then((order) => res.send(order))
      .catch(next);
  })

  .delete('/:id', (req, res, next) => {
    OrderService.deleteById(req.params.id)
      .then((order) => res.send(order))
      .catch(next);
  });
