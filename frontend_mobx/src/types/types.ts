export interface Client {
    id: number;
    firstName: string;
    lastName: string;
    patronymic: string;
    email: string;
    phone: string;
  }
  
  export interface Subscription {
    id: number;
    clientId: number;
    status: string;
    startDate: string;
    endDate: string;
  }
  
  export interface ClientWithSubscription extends Client {
    subscription: Subscription | null;
  }
  