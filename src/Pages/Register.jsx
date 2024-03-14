import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import axios from "axios";

import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import { validateUsername, validatePassword } from "../utils/validation";

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
        const response = await axios.post(
          "http://localhost:8080/api/v1/users/register",
          formData
        );
        console.log("Ответ от сервера:", response.data);
        if (response.status >= 200 && response.status < 300) {
          console.log("Успешная регистрация");
          navigate("/login");
        } else {
          console.error("Ошибка регистрации", response.data.message);
          if (response.status === 400) {
            setErrors({
              username: "Пользователь с таким именем уже зарегистрирован",
              password: "",
            });
          }
        }
      }
    } catch (error) {
      console.error("Ошибка регистрации", error);
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
