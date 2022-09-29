import React, { createContext, useState } from "react";
import axios from "axios";


const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [formData, setFormData] = useState({});
  const [currentUser, setCurrentUser] = useState(null);
  //alert notifications
  const [notification, setNotification] = useState(null);


  const createAccount = () => {
    axios
      .post("http://localhost:5001/user/create", formData)
      .then((response) => console.log(response));
  };

  const inputHandler = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  console.log(formData);

  const login = () => {
    axios
      .post("http://localhost:5001/user/login", formData)
      .then((response) => {
        if (response.data.result) {
          setCurrentUser(response.data.result);
          localStorage.setItem("token", response.data.token);
          console.log(localStorage.getItem("token"));
        }
        setNotification(response.data.message);
      })
      .catch();
  };
  console.log(currentUser);
  const value = { inputHandler, createAccount, login, notification, setNotification };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export default UserContext;
