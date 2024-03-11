import { Route, Routes, Navigate } from "react-router-dom";
import { UserProvider } from "./context/UserContext";
import Home from "./Pages/Home";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
function App() {
  return (
    <div className="App">
      <UserProvider>
        <Routes>
          <Route path="/home" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="*" element={<Navigate to="/register" replace />} />
        </Routes>
      </UserProvider>
    </div>
  );
}

export default App;
