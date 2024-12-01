import { useContext, useEffect } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Home from "./components/Home";
import SignUpComponent from "./components/SignUpComponent";
import Pharma from "./components/Pharma";
import './index.css';
import { AuthContext } from "./Contexts/AuthContext";
import axios from "axios";
import NavBar from "./components/NavBar";
import MenuBar from "./components/MenuBar";
import RootLayout from "./Layout/RootLayout";
import Cart from "./components/Cart";
import { Button } from "@chakra-ui/react";

function App() {

  const { user } = useContext(AuthContext)

  useEffect(() => {
    const getUser = async () => {
      try {
        const response = await axios.get('https://robofetch-server.onrender.com/auth/login/success', { withCredentials: true });
        
        if (response.status === 200) {
          console.log(response.data.user);
        } else {
          console.log('Failed to authenticate user');
        }
      } catch (err) {
        console.log(err.message);
      } 
    };

    getUser();
  }, []);

  
  return (
    <div style={{backgroundColor: 'antiquewhite', height: '100vh'}}>
        <Routes> 
          <Route path="/" element={<RootLayout />}>
            <Route
              exact
              index
              element={<Home user={user} />}
            />
            <Route
              exact
              path="signup"
              element={user ? <Navigate to='/' /> : <SignUpComponent />}
            />
            <Route
              path="pharmacy"
              element={user ? <Pharma /> : <Navigate to="/signup" />}
            />
            <Route
              path="cart"
              element={user ? <Cart /> : <Navigate to="/signup" />}
            />
          </Route>
        </Routes>
        
    </div>
  );
}

export default App;
