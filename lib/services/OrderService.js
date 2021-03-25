const Order = require('../models/Order');
const { sendSms } = require('../utils/twilio');

module.exports = class OrderService {
  static async create({ quantity }) {
    await sendSms(
      process.env.ORDER_HANDLER_NUMBER,
      `New Order received for ${quantity} items.`
    );

    const order = await Order.insert({ quantity });

    return order;
  }

  static async retrieve() {
    const orders = await Order.retrieve();

    return orders;
  }

  static async getById(id) {
    const orders = await Order.getById(id);

    return orders;
  }

  static async updateById(id, { quantity }) {
    const orders = await Order.updateById(id, quantity);

    return orders;
  }

  static async deleteById(id) {
    await sendSms(
      process.env.ORDER_HANDLER_NUMBER,
      `Order ${id} has been deleted.`
    );

    const orders = await Order.deleteById(id);

    return orders;
  }
};
