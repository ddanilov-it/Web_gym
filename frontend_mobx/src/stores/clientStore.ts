import { makeAutoObservable, runInAction } from "mobx";
import { Client, Subscription, ClientWithSubscription } from "../types/types";
import {
  fetchClients,
  fetchSubscriptions,
  addClient,
  addSubscription,
  deleteClient,
  deleteSubscription,
} from "../api/api";

class ClientStore {
  clients: Client[] = [];
  subscriptions: Subscription[] = [];
  isLoading = false;
  isLoaded = false; // Флаг, указывающий, что данные уже загружены

  constructor() {
    makeAutoObservable(this);
  }

  async fetchClients() {
    if (this.isLoaded) {
      return; // Если данные уже загружены, пропускаем запрос
    }

    this.isLoading = true;
    try {
      const clients = await fetchClients();
      const subscriptions = await fetchSubscriptions();
      runInAction(() => {
        this.clients = clients;
        this.subscriptions = subscriptions;
        this.isLoaded = true; // Устанавливаем флаг, что данные загружены
      });
    } catch (error) {
      console.error("Ошибка при загрузке клиентов:", error);
    } finally {
      runInAction(() => {
        this.isLoading = false;
      });
    }
  }

  async addClient(client: Omit<Client, "id">): Promise<Client> {
    try {
      const newClient = await addClient(client);
      runInAction(() => {
        this.clients.push(newClient);
      });
      return newClient;
    } catch (error) {
      console.error("Ошибка при добавлении клиента:", error);
      throw error;
    }
  }

  async deleteClient(clientId: number) {
    try {
      await deleteClient(clientId);
      runInAction(() => {
        this.clients = this.clients.filter((client) => client.id !== clientId);
      });
    } catch (error) {
      console.error("Ошибка при удалении клиента:", error);
    }
  }

  async addSubscription(subscription: Omit<Subscription, "id">) {
    try {
      const newSubscription = await addSubscription(subscription);
      runInAction(() => {
        this.subscriptions.push(newSubscription);
      });
    } catch (error) {
      console.error("Ошибка при добавлении подписки:", error);
    }
  }

  async deleteSubscription(subscriptionId: number) {
    try {
      await deleteSubscription(subscriptionId);
      runInAction(() => {
        this.subscriptions = this.subscriptions.filter((sub) => sub.id !== subscriptionId);
      });
    } catch (error) {
      console.error("Ошибка при удалении подписки:", error);
    }
  }

  get clientsWithSubscriptions(): ClientWithSubscription[] {
    return this.clients.map((client) => ({
      ...client,
      subscription: this.subscriptions.find((sub) => sub.clientId === client.id) || null,
    }));
  }
}

export const clientStore = new ClientStore();