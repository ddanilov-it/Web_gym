import React, { useState } from 'react';
import axios from 'axios';

interface AuthFormProps {
  onAuthSuccess: (token: string) => void;
}

const AuthForm: React.FC<AuthFormProps> = ({ onAuthSuccess }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const endpoint = isRegister ? '/api/auth/register' : '/api/auth/login';

    const userData = isRegister
      ? { fullName, email, password }
      : { email, password };

    try {
      const response = await axios.post(endpoint, userData);
      const token = response.data.token;
      if (token) {
        localStorage.setItem('token', token);
        onAuthSuccess(token);
      } else {
        setError('Не удалось получить токен.');
      }
    } catch (err: any) {
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError('Ошибка: Неверные данные или пользователь уже существует.');
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-2xl shadow-xl">
        <h2 className="text-2xl font-bold text-center">
          {isRegister ? 'Регистрация' : 'Вход'}
        </h2>

        {error && <div className="text-red-500 text-center">{error}</div>}

        <form className="space-y-4" onSubmit={handleSubmit}>
          {isRegister && (
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium">
                ФИО
              </label>
              <input
                type="text"
                id="fullName"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                className="w-full p-2 border rounded-lg focus:ring focus:ring-blue-300"
              />
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-medium">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-2 border rounded-lg focus:ring focus:ring-blue-300"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium">Пароль</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full p-2 border rounded-lg focus:ring focus:ring-blue-300"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600"
          >
            {isRegister ? 'Зарегистрироваться' : 'Войти'}
          </button>
        </form>

        <div className="text-center">
          <p>
            {isRegister ? 'Уже есть аккаунт?' : 'Нет аккаунта?'}
            <button
              type="button"
              className="ml-2 text-blue-500 hover:underline"
              onClick={() => setIsRegister(!isRegister)}
            >
              {isRegister ? 'Войти' : 'Зарегистрироваться'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;
