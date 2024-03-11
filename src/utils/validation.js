export const validateUsername = (username) => {
  if (!username) {
    return "Введите имя пользователя";
  }

  const usernameRegex = /^[^\u0400-\u04FF]+$/;
  if (!usernameRegex.test(username)) {
    return "Имя пользователя не должно содержать русских букв";
  }

  return null;
};

export const validatePassword = (password) => {
  if (!password) {
    return "Введите пароль";
  }

  const passwordRegex = /^[^\u0400-\u04FF]{8,}$/;
  if (!passwordRegex.test(password)) {
    return "Пароль должен иметь не менее 8 символов и не содержать русских букв";
  }

  return null;
};
