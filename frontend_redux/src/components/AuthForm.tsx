import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLoginMutation, useRegisterMutation } from "../redux/apiSlice";
import { useDispatch } from "react-redux";
import { setCredentials } from "../redux/authSlice";

const AuthForm: React.FC = () => {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [error, setError] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [login] = useLoginMutation();
  const [register] = useRegisterMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    try {
      if (isRegister) {
        await register({ username, firstName, lastName, email, password }).unwrap();
        alert("Регистрация успешна! Войдите в систему.");
        setIsRegister(false);
      } else {
        const user = await login({ email, password }).unwrap();
        console.log("🔑 Токен после логина:", user.token); // Токен
        console.log("👤 Данные пользователя:", user); // Печать данных о пользователе
    
        localStorage.setItem("token", user.token);
        localStorage.setItem("userEmail", email);  // Сохраняем email в localStorage
  
        // Логируем, что токен сохранен
        console.log("Токен сохранен в localStorage:", localStorage.getItem("token"));
        console.log("Email сохранен в localStorage:", localStorage.getItem("userEmail"));
    
        dispatch(setCredentials({ token: user.token }));
        navigate("/subscriptions");
      }
    } catch (err: any) {
      setError(err?.data?.message || "Ошибка аутентификации");
    }
  };
  
  
  

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-200">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-2xl shadow-xl border">
        <h2 className="text-2xl font-bold text-center text-gray-800">
          {isRegister ? "Регистрация" : "Вход"}
        </h2>

        {error && <div className="text-red-500 text-center">{error}</div>}

        <form className="space-y-4" onSubmit={handleSubmit}>
          {isRegister && (
            <>
              <input
                type="text"
                placeholder="Логин"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
              <input
                type="text"
                placeholder="Имя"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
              <input
                type="text"
                placeholder="Фамилия"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
            </>
          )}

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            required
          />
          <input
            type="password"
            placeholder="Пароль"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            required
          />

          <button
            type="submit"
            className="w-full py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 transition"
          >
            {isRegister ? "Зарегистрироваться" : "Войти"}
          </button>
        </form>

        <div className="text-center">
          <p className="text-gray-600">
            {isRegister ? "Уже есть аккаунт?" : "Нет аккаунта?"}
            <button
              type="button"
              className="ml-2 text-blue-500 hover:underline"
              onClick={() => setIsRegister(!isRegister)}
            >
              {isRegister ? "Войти" : "Зарегистрироваться"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;
