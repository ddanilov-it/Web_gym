import React, { useState } from "react";
import { useAddClientMutation, useAddSubscriptionMutation } from "../redux/apiSlice";

const ClientForm: React.FC<{ onClientAdded: () => void }> = ({ onClientAdded }) => {
  const [newClient, setNewClient] = useState({
    firstName: "",
    lastName: "",
    patronymic: "",
    email: "",
    phone: "",
  });

  const [newSubscription, setNewSubscription] = useState({
    clientId: 0,
    status: "Активен",
    startDate: "",
    endDate: "",
  });

  const [addClient] = useAddClientMutation();
  const [addSubscription] = useAddSubscriptionMutation();

  const isValidClient = () => {
    return Object.values(newClient).every((val) => val !== "") &&
           Object.values(newSubscription).every((val) => val !== "");
  };

  const handleAddClientWithSubscription = async () => {
    if (!isValidClient()) {
      alert("Пожалуйста, заполните все поля.");
      return;
    }

    try {
      console.log("Добавляем клиента:", newClient);
      const addedClient = await addClient(newClient).unwrap();
      console.log("Клиент успешно добавлен:", addedClient);

      const subscriptionData = { ...newSubscription, clientId: addedClient.id };
      console.log("Добавляем подписку:", subscriptionData);
      
      await addSubscription(subscriptionData).unwrap();
      console.log("Подписка успешно добавлена!");

      onClientAdded(); // Обновляем таблицу
    } catch (error) {
      console.error("Ошибка при добавлении клиента:", error);
    }
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-2">Добавить нового клиента</h2>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium">Имя</label>
          <input
            type="text"
            placeholder="Введите имя"
            value={newClient.firstName}
            onChange={(e) => setNewClient({ ...newClient, firstName: e.target.value })}
            className="p-2 border rounded w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Фамилия</label>
          <input
            type="text"
            placeholder="Введите фамилию"
            value={newClient.lastName}
            onChange={(e) => setNewClient({ ...newClient, lastName: e.target.value })}
            className="p-2 border rounded w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Отчество</label>
          <input
            type="text"
            placeholder="Введите отчество"
            value={newClient.patronymic}
            onChange={(e) => setNewClient({ ...newClient, patronymic: e.target.value })}
            className="p-2 border rounded w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Email</label>
          <input
            type="email"
            placeholder="Введите email"
            value={newClient.email}
            onChange={(e) => setNewClient({ ...newClient, email: e.target.value })}
            className="p-2 border rounded w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Телефон</label>
          <input
            type="tel"
            placeholder="88005553535"
            value={newClient.phone}
            onChange={(e) => setNewClient({ ...newClient, phone: e.target.value })}
            className="p-2 border rounded w-full"
          />
        </div>

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
          <label className="block text-sm font-medium">Дата окончания</label>
          <input
            type="date"
            value={newSubscription.endDate}
            onChange={(e) => setNewSubscription({ ...newSubscription, endDate: e.target.value })}
            className="p-2 border rounded w-full"
          />
        </div>
      </div>

      <button
        onClick={handleAddClientWithSubscription}
        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 w-full"
      >
        Добавить клиента с абонементом
      </button>
    </div>
  );
};

export default ClientForm;
