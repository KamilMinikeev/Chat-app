import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { Link } from "react-router-dom";
import axios from "axios";

import { validateUsername, validatePassword } from "../utils/validation";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-solid-svg-icons";
const eye = <FontAwesomeIcon icon={faEye} />;

const Login = () => {
  const navigate = useNavigate();

  const { login } = useUser();

  const [passwordShown, setPasswordShown] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    username: "",
    password: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    // Сброс ошибок при изменении поля
    setErrors({
      ...errors,
      [name]: "",
    });
  };

  const handleValidation = () => {
    const usernameError = validateUsername(formData.username);
    const passwordError = validatePassword(formData.password);

    setErrors({
      username: usernameError || "",
      password: passwordError || "",
    });

    return !usernameError && !passwordError;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      if (handleValidation()) {
        // Отправка данных на сервер

        const response = await axios.post(
          "ссылка_на_ваш_сервер/api/register",
          formData
        );

        console.log("Ответ от сервера:", response.data);

        if (response.data.status === "ok") {
          console.log("Успешный вход");
          login({
            id: response.data.id,
            username: response.data.username,
          });
          navigate("/home");
        } else {
          console.error("Ошибка входа", response.data.message);
          // Обработка других статусов
        }
      }
    } catch (error) {
      console.error("Ошибка входа", error.response.data);
      // Обработка ошибки входа
    }
  };

  const togglePasswordVisiblity = () => {
    setPasswordShown(passwordShown ? false : true);
  };

  return (
    <div className="centered">
      <div className="form-container">
        <h2>Sign in to Telegram</h2>

        <form onSubmit={handleLogin} className="form">
          <span className="form-error">{errors.username}</span>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleInputChange}
            placeholder="Введите имя пользователя"
          />
          <span className="form-error">{errors.password}</span>
          <div className="input-inner">
            <i
              className={`form-icon ${passwordShown ? "active" : ""} `}
              onClick={togglePasswordVisiblity}
            >
              {eye}
            </i>
            <input
              type={passwordShown ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Введите пароль"
            />
          </div>
          <button type="submit">Log in</button>
          <p>
            Не зарегистрированы? <Link to="/register">Регистрация</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
