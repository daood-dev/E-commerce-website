import { IRepository } from './IRepository';
import { db } from '../../database/db';

export class OrderRepository extends IRepository {
  getAll() {
    db.logQuery("SELECT", "Orders", "Fetched all orders");
    return [...db.orders];
  }

  getById(orderId) {
    db.logQuery("SELECT", "Orders", `WHERE order_id = '${orderId}'`);
    return db.orders.find(o => o.order_id === orderId) || null;
  }

  getByUser(userId) {
    db.logQuery("SELECT", "Orders", `WHERE user_id = '${userId}'`);
    return db.orders.filter(o => o.user_id === userId);
  }

  create(orderData) {
    const newOrder = {
      order_id: "ORD-" + Math.floor(100000 + Math.random() * 900000),
      order_date: new Date().toISOString(),
      status: "Confirmed",
      ...orderData
    };
    db.orders.unshift(newOrder); // newest first
    db.logQuery("INSERT", "Orders", `Created order ${newOrder.order_id} total $${newOrder.total_amount}`);
    db.save();
    return newOrder;
  }

  updateStatus(orderId, newStatus) {
    const order = this.getById(orderId);
    if (!order) return null;
    order.status = newStatus;
    db.logQuery("UPDATE STATUS", "Orders", `Order ${orderId} changed to '${newStatus}'`);
    db.save();
    return order;
  }

  update(orderId, orderData) {
    const idx = db.orders.findIndex(o => o.order_id === orderId);
    if (idx === -1) return null;
    db.orders[idx] = { ...db.orders[idx], ...orderData };
    db.logQuery("UPDATE", "Orders", `Updated order ${orderId}`);
    db.save();
    return db.orders[idx];
  }

  delete(orderId) {
    const idx = db.orders.findIndex(o => o.order_id === orderId);
    if (idx === -1) return false;
    db.orders.splice(idx, 1);
    db.logQuery("DELETE", "Orders", `Deleted order ${orderId}`);
    db.save();
    return true;
  }
}
