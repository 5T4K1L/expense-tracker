import React, { useState } from "react";
import "../styles/Global.css";
import "../styles/LoginRegister.css";
import { auth, db } from "../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { addDoc, collection } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [error, setError] = useState("");

  const nav = useNavigate();

  const usersCollection = collection(db, "users");
  const monthlyIncome = collection(db, "income");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await createUserWithEmailAndPassword(auth, email, pass);
      addDoc(usersCollection, {
        username,
        uid: res.user.uid,
        code:
          username.split(" ")[0] +
          email.split("@gmail.com" || "@yahoo.com" || "@icloud.com"),
      });

      addDoc(monthlyIncome, {
        uid: res.user.uid,
        income: "0",
      });

      nav("/");
    } catch (error) {
      setError("Email already in use.");
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
      <div style={{ height: "30rem" }} className="registerLogin">
        <p className="header">Register Account</p>
        <form onSubmit={handleSubmit}>
          <input
            style={{ marginBottom: "16px" }}
            onChange={(e) => setUsername(e.target.value)}
            type="text"
            placeholder="Username"
          />
          <input
            onChange={(e) => setEmail(e.target.value)}
            type="text"
            placeholder="Email"
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
          <input
            onChange={(e) => setPass(e.target.value)}
            type="password"
            placeholder="Password"
          />
          <button type="submit">Register</button>
        </form>
        <p>
          Already have an account? <a href="/login">Login.</a>
        </p>
      </div>
    </>
  );
};

export default Register;
