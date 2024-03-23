import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { Link } from "react-router-dom";
import axios from "axios";

import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";

import { validateUsername, validatePassword } from "../utils/validation";

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
        const response = await axios.post(
          "http://localhost:8080/api/v1/users/authenticate",
          formData
        );

        console.log("Ответ от сервера:", response.data);

        if (response.status >= 200 && response.status < 300) {
          console.log("Успешный вход");
          login({
            id: response.data.id,
            username: response.data.username,
            bio: response.data.bio,
          });

          localStorage.setItem("activeUser", JSON.stringify(""));
          localStorage.setItem("messages", JSON.stringify(""));

          navigate("/home");
        } else {
          console.error("Ошибка входа", response.data.message);
          if (response.status === 400) {
            setErrors({
              username: "Пользователь с таким именем не зарегистрирован",
              password: "",
            });
          }
        }
      }
    } catch (error) {
      console.error("Ошибка входа", error);
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
              {<RemoveRedEyeIcon />}
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
