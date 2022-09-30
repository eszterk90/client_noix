import "./style/App.scss";
import { useContext, useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./components/home/Home";
import Profile from "./components/profile/Profile";
import Navbar from "./components/navbar/Navbar";
import Chat from "./components/chat/Chat";
import Upload from "./components/upload/Upload";
import AlertContainer from "./components/UI/alerts/AlertContainer";
// import UserContext from "./contexts/UserContext";
import axios from "axios";
import Register from "./components/authentication/Register";
import Login from "./components/authentication/Login";
import DesignContext from "./contexts/DesignContext";

function App() {
  const { notification, setNotification } = useContext(DesignContext);

  useEffect(() => {
    axios
      .get("http://localhost:5001/")
      .then((response) =>
        setNotification([...notification, response.data.notification])
      );
    // eslint-disable-next-line
  }, []);

  console.log(notification);

  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/upload" element={<Upload />} />
      </Routes>
      {/* make it visible only for logged in users */}

      {notification && <AlertContainer />}
    </div>
  );
}

export default App;
