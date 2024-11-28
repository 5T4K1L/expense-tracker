import React, { useContext, useEffect, useState } from "react";
import "../styles/Global.css";
import expense from "../icons/expenselogo.png";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";

const Navbar = () => {
  const [showHam, setShowHam] = useState(false);

  const nav = useNavigate();

  const showHamburger = () => {
    setShowHam((prev) => !prev);
  };

  const handleLogout = (e) => {
    e.preventDefault();
    signOut(auth);
    nav("/login");
  };
  return (
    <>
      <div className={`sidebar ${showHam ? "active" : ""}`}>
        <div className="logo">
          <img src={expense} alt="" />
          <div className="expensetracker">
            <p>EXPENSE</p>
            <p>TRACKER</p>
          </div>
        </div>
        <div className="links">
          <a href="/">DASHBOARD</a>
          <a href="/bills-and-payments">BILLS AND PAYMENTS</a>
          <a href="/income">INCOME</a>
          <a href="/trips">TRIPS</a>
          <a href="/expenses">EXPENSES</a>
          <a href="">
            <button
              style={{
                background: "none",
                color: "white",
                border: "none",
                fontSize: "12px",
              }}
              onClick={handleLogout}
            >
              LOGOUT
            </button>
          </a>
        </div>
      </div>
      <div className="navbar">
        <p>Hi Alfonzo</p>
        <div className="hamburger-menu">
          <a onClick={showHamburger}>
            <span></span>
            <span></span>
            <span></span>
          </a>
        </div>
      </div>
    </>
  );
};

export default Navbar;
