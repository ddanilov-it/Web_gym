import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  useGetClientsQuery,
  useGetSubscriptionsQuery,
  useDeleteClientMutation,
  useDeleteSubscriptionMutation,
} from "../redux/apiSlice";
import { ClientWithSubscription } from "../types/types";
import ClientForm from "./ClientForm";

const SubscriptionTable: React.FC = () => {
  const navigate = useNavigate();
  const userEmail = localStorage.getItem("userEmail");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/auth");
    }
  }, [navigate]);

    // Отладка: Печать email в консоль
  useEffect(() => {
    console.log("Текущий email пользователя:", userEmail);
  }, [userEmail]);

  const { data: clientsData, isLoading: isClientsLoading } = useGetClientsQuery();
  const { data: subscriptionsData, isLoading: isSubsLoading } = useGetSubscriptionsQuery();
  const [deleteClient] = useDeleteClientMutation();
  const [deleteSubscription] = useDeleteSubscriptionMutation();

     // Печать списка клиентов в консоль для отладки
     useEffect(() => {
      console.log("Список клиентов:", clientsData);
    }, [clientsData]);

  if (!localStorage.getItem("token")) {
    navigate("/auth");
  }

  if (isClientsLoading || isSubsLoading) {
    return <div className="text-center text-lg">Загрузка...</div>;
  }

  const clients: ClientWithSubscription[] =
    clientsData?.map((client) => ({
      ...client,
      subscription: subscriptionsData?.find((sub) => sub.clientId === client.id) || null,
    })) || [];


  // Удаление клиента и подписки
  const handleDeleteClient = async (clientId: number) => {
    try {
      const client = clients.find((c) => c.id === clientId);
      if (client?.subscription) {
        await deleteSubscription(client.subscription.id);
      }
      await deleteClient(clientId);
    } catch (error) {
      console.error("Ошибка при удалении клиента:", error);
    }
  };

  // Форматирование даты
  const formatDate = (dateString?: string) => {
    return dateString ? dateString.slice(0, 10).split("-").reverse().join("-") : "—";
  };

  // Выход пользователя
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userEmail");
    navigate("/auth");
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

      {/* Форма добавления клиента */}
      <ClientForm onClientAdded={() => {}} />

      {/* Таблица клиентов */}
      <div className="overflow-x-auto mt-6">
        <table className="w-full table-auto bg-white rounded-lg shadow">
          <thead>
            <tr className="bg-blue-500 text-white">
              {["ID", "Имя", "Фамилия", "Отчество", "Email", "Телефон", "Статус", "Начало", "Окончание", "Действия"].map(
                (header) => (
                  <th key={header} className="p-3">{header}</th>
                )
              )}
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
                <td className="p-3 text-center">{client.subscription?.status || "Нет данных"}</td>
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
