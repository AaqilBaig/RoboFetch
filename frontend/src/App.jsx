/* eslint-disable no-unused-vars */
import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import Home from "./components/Home";
import SignUpComponent from "./components/SignUpComponent";
import Pharma from "./components/Pharma";

function App() {
  const [user, setUser] = useState(null);

  const getUser = async () => {
    try {
      const url = "https://robofetch.onrender.com/auth/login/success";
      const { data } = await axios.get(url, { withCredentials: true });
      setUser(data.user._json);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    // getUser();
  }, []);

  return (
    <div className="container">
      <Routes>
        <Route
          exact
          path="/"
          // element={user ? <Home user={user} /> : <Navigate to="/signup" />}
          element={<Home/>}
        />
        <Route
          exact
          path="/signup"
          element={user ? <Navigate to="/" /> : <SignUpComponent />}
        />
        <Route path="/pharmacy" component={Pharma} />
      </Routes>
    </div>
  );
}

export default App;
