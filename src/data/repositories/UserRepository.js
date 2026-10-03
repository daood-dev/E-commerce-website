import { IRepository } from './IRepository';
import { db } from '../../database/db';

export class UserRepository extends IRepository {
  getAll() {
    db.logQuery("SELECT", "Users", "Fetched all users");
    return [...db.users];
  }

  getById(userId) {
    db.logQuery("SELECT", "Users", `WHERE user_id = '${userId}'`);
    return db.users.find(u => u.user_id === userId) || null;
  }

  getByEmail(email) {
    db.logQuery("SELECT", "Users", `WHERE email = '${email}'`);
    return db.users.find(u => u.email.toLowerCase() === email.toLowerCase()) || null;
  }

  create(userData) {
    const newUser = {
      user_id: "user-" + Date.now(),
      created_at: new Date().toISOString(),
      role: userData.role || "Customer",
      ...userData
    };
    db.users.push(newUser);
    db.logQuery("INSERT", "Users", `Created user ${newUser.user_id} (${newUser.email})`);
    db.save();
    return newUser;
  }

  update(userId, userData) {
    const idx = db.users.findIndex(u => u.user_id === userId);
    if (idx === -1) return null;
    db.users[idx] = { ...db.users[idx], ...userData };
    db.logQuery("UPDATE", "Users", `Updated user ${userId}`);
    db.save();
    return db.users[idx];
  }

  delete(userId) {
    const idx = db.users.findIndex(u => u.user_id === userId);
    if (idx === -1) return false;
    db.users.splice(idx, 1);
    db.logQuery("DELETE", "Users", `Deleted user ${userId}`);
    db.save();
    return true;
  }
}
