import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchClients, fetchSubscriptions, deleteClient, deleteSubscription, setAuthToken } from '../api/api';
import { ClientWithSubscription } from '../types/types';
import ClientForm from './ClientForm';

const SubscriptionTable: React.FC = () => {
  const [clients, setClients] = useState<ClientWithSubscription[]>([]);
  const [userEmail, setUserEmail] = useState<string | null>(localStorage.getItem('userEmail'));
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setAuthToken(token);
      loadClients();
    } else {
      navigate('/auth');
    }
  }, []);

  // Загружаем клиентов и подписки
  const loadClients = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.warn('Токен отсутствует, загрузка клиентов невозможна.');
        return;
      }

      setAuthToken(token);

      const clientsData = await fetchClients();
      const subscriptionsData = await fetchSubscriptions();

      // Объединяем клиентов и их подписки
      setClients(clientsData.map(client => ({
        ...client,
        subscription: subscriptionsData.find(sub => sub.clientId === client.id) || null,
      })));
    } catch (error) {
      console.error('Ошибка при загрузке клиентов:', error);
    }
  };

  // Удаление клиента и его подписки
  const handleDeleteClient = async (clientId: number) => {
    try {
      const client = clients.find((c) => c.id === clientId);

      // Если у клиента есть подписка, сначала удаляем её
      if (client?.subscription) {
        await deleteSubscription(client.subscription.id);
      }

      await deleteClient(clientId);
      loadClients();
    } catch (error) {
      console.error('Ошибка при удалении клиента:', error);
    }
  };

  // Функция форматирования даты в формат ДД-ММ-ГГГГ
  const formatDate = (dateString?: string) => {
    return dateString ? dateString.slice(0, 10).split('-').reverse().join('-') : '—';
  };

  // Выход пользователя
  const handleLogout = () => {
    setAuthToken(null);
    localStorage.removeItem('userEmail');
    navigate('/auth');
  };

  return (
    <div className="container mx-auto p-6">
      {/* Блок пользователя и кнопка "Выйти" */}
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

      {/* Форма добавления клиента */}
      <ClientForm onClientAdded={loadClients} />

      {/* Таблица клиентов */}
      <div className="overflow-x-auto mt-6">
        <table className="w-full table-auto bg-white rounded-lg shadow">
          <thead>
            <tr className="bg-blue-500 text-white">
              {['ID', 'Имя', 'Фамилия', 'Отчество', 'Email', 'Телефон', 'Статус', 'Начало', 'Окончание', 'Действия'].map((header) => (
                <th key={header} className="p-3">{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {clients.map((client) => (
              <tr key={client.id} className="border-b hover:bg-gray-100">
                <td className="p-3 text-center">{client.id}</td>
                <td className="p-3">{client.firstName}</td>
                <td className="p-3">{client.lastName}</td>
                <td className="p-3">{client.patronymic}</td>
                <td className="p-3">{client.email}</td>
                <td className="p-3">{client.phone}</td>
                <td className="p-3 text-center">{client.subscription?.status || 'Нет данных'}</td>
                <td className="p-3 text-center">{formatDate(client.subscription?.startDate)}</td>
                <td className="p-3 text-center">{formatDate(client.subscription?.endDate)}</td>
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
