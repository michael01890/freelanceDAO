// src/App.js
import React, { useContext } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import MetaMaskSignin from "./components/MetaMaskSignin";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Navbar from "./components/Navbar";
import { UserContext } from "./components/UserContext";

const App = () => {
  const { account } = useContext(UserContext);

  return (
    <Router>
      {account && <Navbar />} {/* Show Navbar only if user is connected */}
      <Routes>
        <Route
          path="/"
          element={!account ? <MetaMaskSignin /> : <Navigate to="/dashboard" />}
        />
        <Route
          path="/dashboard"
          element={account ? <Dashboard /> : <Navigate to="/" />}
        />
        <Route
          path="/profile"
          element={account ? <Profile /> : <Navigate to="/" />}
        />
        {/* Redirect any unknown routes to home */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

export default App;
