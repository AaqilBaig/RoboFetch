/* eslint-disable no-unused-vars */
import React from "react";

function Login() {
  const googleAuth = () => {
    window.open(`https://localhost:3000/auth/google`, "_self");
  };
  return (
    <Container>
      <h1>Sign Up here</h1>
      <LoginForm>
        <div className="img">
          <img src="" alt="" />
        </div>
        <div className="content">
          <button className="google" onClick={googleAuth}>
            <img src="" alt="" />
            <span>Sign in with Google</span>
          </button>
        </div>
      </LoginForm>
    </Container>
  );
}

export default Login;