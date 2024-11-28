import React, { useState } from "react";
import "../styles/Global.css";
import "../styles/LoginRegister.css";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [error, setError] = useState("");

  const nav = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, pass);
      nav("/");
    } catch (error) {
      setError("Wrong email or password.");
    }
  };
  return (
    <>
      <div style={{ left: "0%" }} className="circleOne">
        <span></span>
      </div>
      <div className="circleTwo">
        <span></span>
      </div>
      <div className="registerLogin">
        <p>Login Account</p>
        <form onSubmit={handleSubmit}>
          <input
            onChange={(e) => setEmail(e.target.value)}
            type="text"
            placeholder="Email"
          />
          <input
            onChange={(e) => setPass(e.target.value)}
            type="password"
            placeholder="Password"
          />
          <p
            style={{
              color: "red",
              fontSize: "10px",
              marginTop: "0px",
              marginBottom: "5px",
            }}
          >
            {error}
          </p>
          <button type="submit">Login</button>
        </form>
        <div className="links">
          <p>
            Don't have an account? <a href="/register">Register.</a>
          </p>
        </div>
      </div>
    </>
  );
};

export default Login;
