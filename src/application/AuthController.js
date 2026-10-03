import { UserRepository } from '../data/repositories/UserRepository';

export class AuthController {
  constructor() {
    this.userRepo = new UserRepository();
    this.sessionKey = "ECOMMERCE_CURRENT_SESSION_V2";
  }

  getCurrentSession() {
    const saved = localStorage.getItem(this.sessionKey);
    if (saved) {
      try {
        const user = JSON.parse(saved);
        const found = this.userRepo.getById(user.user_id);
        if (found) return found;
      } catch (e) {
        // ignore
      }
    }
    return null; // Return null when logged out so user explicitly sees Sign In
  }

  setSession(user) {
    if (user) {
      localStorage.setItem(this.sessionKey, JSON.stringify(user));
    } else {
      localStorage.removeItem(this.sessionKey);
    }
  }

  loginCustomer(email, password) {
    const user = this.userRepo.getByEmail(email);
    if (!user) {
      return { success: false, error: "Customer account not found. Please create a custom account." };
    }
    if (user.role === "Admin") {
      return { success: false, error: "This is an Admin account. Please use the Admin Portal Login tab." };
    }
    if (user.password && user.password !== password) {
      return { success: false, error: "Invalid password for customer account." };
    }

    this.setSession(user);
    return { success: true, user };
  }

  loginAdmin(email, password) {
    const user = this.userRepo.getByEmail(email);
    if (!user) {
      return { success: false, error: "Admin account not found. Please create a custom Admin account." };
    }
    if (user.role !== "Admin") {
      return { success: false, error: "Access Denied: Account does not have Admin privileges." };
    }
    if (user.password && user.password !== password) {
      return { success: false, error: "Invalid secret key / password for Admin console." };
    }

    this.setSession(user);
    return { success: true, user };
  }

  registerCustomAccount({ name, email, password, role = "Customer", city = "Seattle", phone = "+1 (555) 000-1111" }) {
    const existing = this.userRepo.getByEmail(email);
    if (existing) {
      return { success: false, error: "An account with this email address already exists." };
    }

    const newUser = this.userRepo.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password: password,
      role: role === "Admin" ? "Admin" : "Customer",
      phone: phone,
      street: "100 Innovation Way",
      city: city || "San Francisco",
      postal_code: "94105",
      country: "United States"
    });

    this.setSession(newUser);
    return { success: true, user: newUser };
  }

  logout() {
    this.setSession(null);
  }
}
