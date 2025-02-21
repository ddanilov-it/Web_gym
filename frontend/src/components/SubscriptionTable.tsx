import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

interface Client {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

interface Subscription {
  id: number;
  clientId: number;
  status: string;
  startDate: string;
  endDate: string;
}

interface ClientWithSubscription extends Client {
  subscription: Subscription | null;
}

const SubscriptionTable: React.FC = () => {
  const [clients, setClients] = useState<ClientWithSubscription[]>([]);
  const [newClient, setNewClient] = useState<Client>({
    id: 0,
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
  });

  const [newSubscription, setNewSubscription] = useState<Subscription>({
    id: 0,
    clientId: 0,
    status: 'Активен',
    startDate: '',
    endDate: '',
  });

  const [userEmail, setUserEmail] = useState<string | null>(localStorage.getItem('userEmail'));
  const navigate = useNavigate();

  useEffect(() => {
    fetchClientsWithSubscriptions();
  }, []);

  // Получение данных клиентов с их абонементами
  const fetchClientsWithSubscriptions = async () => {
    try {
      const response = await axios.get('/api/clients-with-subscriptions');
      setClients(response.data);
    } catch (error) {
      console.error('Ошибка при получении данных из базы данных:', error);
    }
  };

  // Добавление нового клиента с абонементом
  const handleAddClientWithSubscription = async () => {
    const { firstName, lastName, email, phone } = newClient;
    const { status, startDate, endDate } = newSubscription;

    if (!firstName || !lastName || !email || !phone || !status || !startDate || !endDate) {
      alert('Пожалуйста, заполните все поля.');
      return;
    }

    try {
      const response = await axios.post('/api/clients-with-subscriptions', {
        client: newClient,
        subscription: newSubscription,
      });

      setClients([...clients, response.data]);
      setNewClient({ id: 0, firstName: '', lastName: '', email: '', phone: '' });
      setNewSubscription({ id: 0, clientId: 0, status: 'Активен', startDate: '', endDate: '' });
    } catch (error) {
      console.error('Ошибка при добавлении клиента с абонементом:', error);
    }
  };

  // Удаление клиента и его абонемента
  const handleDeleteClient = async (id: number) => {
    try {
      await axios.delete(`/api/clients/${id}`);
      setClients(clients.filter((client) => client.id !== id));
    } catch (error) {
      console.error('Ошибка при удалении клиента:', error);
    }
  };

  // Обработка изменения телефона (только цифры)
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const phoneValue = e.target.value.replace(/\D/g, '');
    setNewClient({ ...newClient, phone: phoneValue });
  };

  // Выход пользователя
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userEmail');
    navigate('/auth');
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="text-lg font-semibold">Пользователь: {userEmail}</div>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Выйти
        </button>
      </div>

      <h1 className="text-3xl font-bold mb-6 text-center">Управление клиентами и абонементами</h1>

      {/* Форма для добавления клиента */}
      <div className="mb-4 p-4 bg-white rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-2">Добавить нового клиента с абонементом</h2>

        <div className="grid grid-cols-2 gap-4">
          {/* Поля клиента */}
          <div>
            <label className="block text-sm font-medium">Имя</label>
            <input
              type="text"
              placeholder="Имя"
              value={newClient.firstName}
              onChange={(e) => setNewClient({ ...newClient, firstName: e.target.value })}
              className="p-2 border rounded w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Фамилия</label>
            <input
              type="text"
              placeholder="Фамилия"
              value={newClient.lastName}
              onChange={(e) => setNewClient({ ...newClient, lastName: e.target.value })}
              className="p-2 border rounded w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Email</label>
            <input
              type="email"
              placeholder="Email"
              value={newClient.email}
              onChange={(e) => setNewClient({ ...newClient, email: e.target.value })}
              className="p-2 border rounded w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Телефон</label>
            <input
              type="text"
              placeholder="88005553535"
              value={newClient.phone}
              onChange={handlePhoneChange}
              className="p-2 border rounded w-full"
            />
          </div>

          {/* Поля абонемента */}
          <div>
            <label className="block text-sm font-medium">Статус абонемента</label>
            <select
              value={newSubscription.status}
              onChange={(e) => setNewSubscription({ ...newSubscription, status: e.target.value })}
              className="p-2 border rounded w-full"
            >
              <option value="Активен">Активен</option>
              <option value="Не активен">Не активен</option>
              <option value="Заморожен">Заморожен</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium">Дата начала</label>
            <input
              type="date"
              value={newSubscription.startDate}
              onChange={(e) => setNewSubscription({ ...newSubscription, startDate: e.target.value })}
              className="p-2 border rounded w-full"
            />
          </div>

          <div>
            <button
              onClick={handleAddClientWithSubscription}
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Добавить клиента с абонементом
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium">Дата окончания</label>
            <input
              type="date"
              value={newSubscription.endDate}
              onChange={(e) => setNewSubscription({ ...newSubscription, endDate: e.target.value })}
              className="p-2 border rounded w-full"
            />
          </div>
        </div>

       
      </div>

      {/* Таблица с клиентами и их абонементами */}
      <div className="overflow-x-auto">
        <table className="w-full table-auto bg-white rounded-lg shadow">
          <thead>
            <tr className="bg-blue-500 text-white">
              <th className="p-3">ID</th>
              <th className="p-3">Имя</th>
              <th className="p-3">Фамилия</th>
              <th className="p-3">Email</th>
              <th className="p-3">Телефон</th>
              <th className="p-3">Статус абонемента</th>
              <th className="p-3">Дата начала</th>
              <th className="p-3">Дата окончания</th>
              <th className="p-3">Действия</th>
            </tr>
          </thead>
          <tbody>
  {Array.isArray(clients) && clients.map((client) => (
    <tr key={client.id} className="border-b hover:bg-gray-100">
      <td className="p-3 text-center">{client.id}</td>
      <td className="p-3">{client.firstName}</td>
      <td className="p-3">{client.lastName}</td>
      <td className="p-3">{client.email}</td>
      <td className="p-3">{client.phone}</td>
      <td className="p-3 text-center">{client.subscription?.status || 'Нет данных'}</td>
      <td className="p-3 text-center">{client.subscription?.startDate || 'Нет данных'}</td>
      <td className="p-3 text-center">{client.subscription?.endDate || 'Нет данных'}</td>
      <td className="p-3 text-center">
        <button
          onClick={() => handleDeleteClient(client.id)}
          className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
        >
          Удалить
        </button>
      </td>
    </tr>
  ))}
</tbody>

        </table>
      </div>
    </div>
  );
};

export default SubscriptionTable;


