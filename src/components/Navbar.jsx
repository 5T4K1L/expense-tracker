import React, { useContext, useEffect, useState } from "react";
import "../styles/Global.css";
import "../styles/Navbar.css";
import expense from "../icons/expenselogo.png";
import { auth, db } from "../firebase";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { collection, getDocs, query, where } from "firebase/firestore";

const Navbar = () => {
  const [user, setUser] = useState(null);
  const [code, setCode] = useState([]);
  const [trackCode, setTrackCode] = useState();
  const [error, setError] = useState("");
  const [showHam, setShowHam] = useState(false);
  const [personalCode, setPersonalCode] = useState([]);
  const nav = useNavigate();

  const userCollection = collection(db, "users");

  useEffect(() => {
    const unsub = auth.onAuthStateChanged((user) => {
      setUser(user);
    });
    return () => unsub();
  });

  const showHamburger = () => {
    setShowHam((prev) => !prev);
  };

  const handleLogout = (e) => {
    e.preventDefault();
    signOut(auth);
    nav("/login");
  };

  const getCode = async () => {
    const q = query(userCollection, where("uid", "==", user.uid));
    const snapshot = await getDocs(q);
    const userData = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    if (userData.length > 0) {
      setCode(userData[0]);
    } else {
      console.error("No user found with the given UID");
      setCode(null);
    }
  };

  const handleTrack = async () => {
    const q = query(collection(db, "expense"), where("code", "==", trackCode));
    const snapshot = await getDocs(q);

    if (!snapshot.empty) {
      const newTrack = snapshot.docs.map((doc) => {
        const data = doc.data();
        data.id = doc.id;
        return data;
      });

      nav(`/${trackCode}`);
    } else {
      const error = "Code doesn't exists.";
      setError(error);
    }
  };

  const getPersonalCode = async () => {
    const q = query(collection(db, "users"), where("uid", "==", user.uid));
    const snapshot = await getDocs(q);
    const personalCode = snapshot.docs.map((doc) => {
      return { id: doc.id, ...doc.data() };
    });

    setPersonalCode(personalCode);
  };

  useEffect(() => {
    if (user && user.uid) {
      getCode();
      getPersonalCode();
    }
  }, [user]);

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
          {code && code.code ? (
            <a href={`/bills-and-payments/${code.code}`}>BILLS AND PAYMENTS</a>
          ) : (
            <span>Loading...</span>
          )}

          {code && code.code ? (
            <a href={`/income/${code.code}`}>INCOME</a>
          ) : (
            <span>Loading...</span>
          )}

          {code && code.code ? (
            <a href={`/trips/${code.code}`}>TRIPS</a>
          ) : (
            <span>Loading...</span>
          )}

          {code && code.code ? (
            <a href={`/expenses/${code.code}`}>EXPENSES</a>
          ) : (
            <span>Loading...</span>
          )}

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

          <div className="trackingcode">
            <input
              onChange={(e) => setTrackCode(e.target.value)}
              type="text"
              placeholder="Tracking Code"
            />
            <p
              style={{
                color: "lightgoldenrodyellow",
                margin: "-5px",
                fontSize: "10px",
                textAlign: "center",
              }}
            >
              {error}
            </p>
            <button onClick={handleTrack}>Check Tracking Code</button>
          </div>

          <p
            style={{
              color: "lightgoldenrodyellow",
              marginTop: "20px",
              fontSize: "13px",
              textAlign: "center",
            }}
          >
            Your Tracking Code:
            <br />
            {personalCode.map((code) => code.code)}
          </p>
        </div>
      </div>
      <div className="navbar">
        <p>Hi {code?.username || "loading..."}</p>

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
