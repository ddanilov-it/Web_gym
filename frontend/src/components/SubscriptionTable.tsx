import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

interface Subscription {
  id: number;
  fullName: string;
  status: string;
  startDate: string;
  endDate: string;
}

const SubscriptionTable: React.FC = () => {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [newSubscription, setNewSubscription] = useState({ fullName: '', status: '', startDate: '', endDate: '' });
  const [userEmail] = useState('testuser@example.com');
  const navigate = useNavigate();

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const fetchSubscriptions = async () => {
    try {
      const response = await axios.get('/api/subscriptions');
      setSubscriptions(response.data);
    } catch (error) {
      console.error('Ошибка при получении данных из базы данных:', error);
    }
  };

  const handleAddSubscription = async () => {
    const { fullName, status, startDate, endDate } = newSubscription;
    if (!fullName || !status || !startDate || !endDate) {
      alert('Пожалуйста, заполните все поля.');
      return;
    }
    try {
        const response = await axios.post('/api/subscriptions', newSubscription);
        setSubscriptions([...subscriptions, response.data]);
        setNewSubscription({ fullName: '', status: 'Активен', startDate: '', endDate: '' });
      } catch (error) {
        console.error('Ошибка при добавлении данных в базу данных:', error);
      }
    };

    const handleDeleteSubscription = async (id: number) => {
        try {
          await axios.delete(`/api/subscriptions/${id}`);
          setSubscriptions(subscriptions.filter((sub) => sub.id !== id));
        } catch (error) {
          console.error('Ошибка при удалении данных из базы данных:', error);
        }
      };

  const handleLogout = () => {
    localStorage.removeItem('token');
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

      <h1 className="text-3xl font-bold mb-6 text-center">Таблица абонементов</h1>

      <div className="mb-4 p-4 bg-white rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-2">Добавить новый абонемент</h2>
        <div className="flex space-x-2">
          <input
            type="text"
            placeholder="ФИО"
            value={newSubscription.fullName}
            onChange={(e) => setNewSubscription({ ...newSubscription, fullName: e.target.value })}
            className="p-2 border rounded w-full"
          />
         <select
            value={newSubscription.status}
            onChange={(e) => setNewSubscription({ ...newSubscription, status: e.target.value })}
            className="p-2 border rounded w-full"
          >
            <option value="Активен">Активен</option>
            <option value="Не активен">Не активен</option>
            <option value="Заморожен">Заморожен</option>
          </select>
          <input
            type="date"
            value={newSubscription.startDate}
            onChange={(e) => setNewSubscription({ ...newSubscription, startDate: e.target.value })}
            className="p-2 border rounded"
          />
          <input
            type="date"
            value={newSubscription.endDate}
            onChange={(e) => setNewSubscription({ ...newSubscription, endDate: e.target.value })}
            className="p-2 border rounded"
          />
          <button
            onClick={handleAddSubscription}
            className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          >
            Добавить
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full table-auto bg-white rounded-lg shadow">
          <thead>
          <tr className="bg-blue-500 text-white">
              <th className="p-3">ID</th>
              <th className="p-3">ФИО</th>
              <th className="p-3">Статус абонемента</th>
              <th className="p-3">Дата начала</th>
              <th className="p-3">Дата окончания</th>
              <th className="p-3">Действия</th>
            </tr>
          </thead>
          <tbody>
            {subscriptions.map((sub) => (
              <tr key={sub.id} className="border-b hover:bg-gray-100">
                <td className="p-3 text-center">{sub.id}</td>
                <td className="p-3">{sub.fullName}</td>
                <td className="p-3 text-center">{sub.status}</td>
                <td className="p-3 text-center">{sub.startDate}</td>
                <td className="p-3 text-center">{sub.endDate}</td>
                <td className="p-3 text-center">
                  <button
                    onClick={() => handleDeleteSubscription(sub.id)}
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

export {};
