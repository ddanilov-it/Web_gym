import { makeAutoObservable } from "mobx";

class AuthStore {
  token: string | null = localStorage.getItem("token") || null;
  userEmail: string | null = localStorage.getItem("userEmail") || null;

  constructor() {
    makeAutoObservable(this);
  }

  setCredentials(token: string, email: string) {
    this.token = token;
    this.userEmail = email;
    localStorage.setItem("token", token);
    localStorage.setItem("userEmail", email);
  }

  logout() {
    this.token = null;
    this.userEmail = null;
    localStorage.removeItem("token");
    localStorage.removeItem("userEmail");
  }
}

export const authStore = new AuthStore();