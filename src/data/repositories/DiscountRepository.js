import { IRepository } from './IRepository';
import { db } from '../../database/db';

export class DiscountRepository extends IRepository {
  getAll() {
    db.logQuery("SELECT", "Discounts", "Fetched all promo discount codes");
    return [...db.discounts];
  }

  getById(id) {
    db.logQuery("SELECT", "Discounts", `WHERE discount_id = '${id}'`);
    return db.discounts.find(d => d.discount_id === id) || null;
  }

  getByCode(code) {
    db.logQuery("SELECT", "Discounts", `WHERE code = '${code?.toUpperCase()}'`);
    if (!code) return null;
    return db.discounts.find(d => d.code.toUpperCase() === code.toUpperCase() && d.active) || null;
  }

  create(discountData) {
    const newDiscount = {
      discount_id: "disc-" + Date.now(),
      code: discountData.code.toUpperCase(),
      percentage: Number(discountData.percentage),
      active: true
    };
    db.discounts.push(newDiscount);
    db.logQuery("INSERT", "Discounts", `Created promo code ${newDiscount.code} (${newDiscount.percentage}% off)`);
    db.save();
    return newDiscount;
  }

  update(id, entity) {
    const idx = db.discounts.findIndex(d => d.discount_id === id);
    if (idx === -1) return null;
    db.discounts[idx] = { ...db.discounts[idx], ...entity };
    db.logQuery("UPDATE", "Discounts", `Updated discount ${id}`);
    db.save();
    return db.discounts[idx];
  }

  delete(id) {
    const idx = db.discounts.findIndex(d => d.discount_id === id);
    if (idx === -1) return false;
    db.discounts.splice(idx, 1);
    db.logQuery("DELETE", "Discounts", `Deleted discount ${id}`);
    db.save();
    return true;
  }
}
