import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import axios from "axios";

import { validateUsername, validatePassword } from "../utils/validation";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-solid-svg-icons";
const eye = <FontAwesomeIcon icon={faEye} />;

const Register = () => {
  const navigate = useNavigate();

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

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      if (handleValidation()) {
        // Отправка данных на сервер

        //   const response = await axios.post(
        //     "ссылка_на_ваш_сервер/api/register",
        //     formData
        //   );

        //   console.log("Ответ от сервера:", response.data);

        //   if (response.data.status === "ok") {
        //     console.log("Успешная регистрация");
        //     navigate("/login");
        //   } else {
        //     console.error("Ошибка регистрации", response.data.message);
        //     // Обработка других статусов
        //   }
        navigate("/login");
      }
    } catch (error) {
      console.error("Ошибка регистрации", error.response.data);
      // Обработка ошибки регистрации
    }
  };

  const togglePasswordVisiblity = () => {
    setPasswordShown(passwordShown ? false : true);
  };

  return (
    <div className="centered">
      <div className="form-container">
        <h2>Create a new account</h2>

        <form onSubmit={handleRegister} className="form">
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
          <button type="submit">Register</button>
          <p>
            Уже зарегистрированы? <Link to="/login">Войти</Link>{" "}
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;
