const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');
const Order = require('../lib/models/Order');

jest.mock('../lib/utils/twilio.js');
const twilio = require('../lib/utils/twilio');

describe('03_separation-of-concerns-demo routes', () => {
  beforeEach(() => {
    return setup(pool);
  });

  let order;
  beforeEach(async () => {
    order = await Order.insert({ quantity: 10 });

    twilio.sendSms.mockClear();
  });

  it('sends a sms upon new order', () => {
    return request(app)
      .post('/api/v1/orders')
      .send({ quantity: 10 })
      .then(() => {
        expect(twilio.sendSms).toHaveBeenCalledTimes(1);
      });
  });

  it('sends a sms upon deleted order', () => {
    return request(app)
      .delete('/api/v1/orders/1')
      .then(() => {
        expect(twilio.sendSms).toHaveBeenCalledTimes(1);
      });
  });

  it('creates a new order in our database and sends a text message', () => {
    return request(app)
      .post('/api/v1/orders')
      .send({ quantity: 10 })
      .then((res) => {
        expect(res.body).toEqual({
          id: '2',
          quantity: 10,
        });
      });
  });

  it('gets all orders from the database', async () => {
    await request(app).post('/api/v1/orders').send({ quantity: 5 });

    return request(app)
      .get('/api/v1/orders')
      .then((res) => {
        expect(res.body).toEqual([
          {
            id: '1',
            quantity: 10,
          },
          {
            id: '2',
            quantity: 5,
          },
        ]);
      });
  });

  it('gets one order from the database by id', async () => {
    return request(app)
      .get(`/api/v1/orders/${order.id}`)
      .then((res) => {
        expect(res.body).toEqual(order);
      });
  });

  it('updates one order from the database by id', async () => {
    await request(app).put(`/api/v1/orders/${order.id}`).send({ quantity: 5 });

    return request(app)
      .get(`/api/v1/orders/${order.id}`)
      .then((res) => {
        expect(res.body).toEqual({
          id: '1',
          quantity: 5,
        });
      });
  });

  it('deletes one order from the database by id', async () => {
    await request(app).delete(`/api/v1/orders/${order.id}`);

    return request(app)
      .get(`/api/v1/orders/`)
      .then((res) => {
        expect(res.body).toEqual([]);
      });
  });
});
