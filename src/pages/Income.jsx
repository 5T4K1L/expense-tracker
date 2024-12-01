import React, { useEffect, useState } from "react";
import "../styles/Global.css";
import "../styles/Income.css";
import Navbar from "../components/Navbar";
import {
  collection,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { auth, db } from "../firebase";
import { Link, useNavigate, useParams } from "react-router-dom";

const Income = () => {
  const [income, setIncome] = useState();
  const [current, setCurrent] = useState(null);
  const [docId, setDocId] = useState();
  const [user, setUser] = useState(null);
  const nav = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, []);

  const getIncome = async () => {
    const q = query(collection(db, "income"), where("uid", "==", user.uid));
    const snapshot = await getDocs(q);

    if (!snapshot.empty) {
      const incomeData = snapshot.docs[0].data();
      const incomeUID = snapshot.docs[0].id;
      setCurrent({
        ...incomeData,
        uid: incomeUID,
      });
      setDocId(incomeUID);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const incomeRef = doc(db, "income", docId);
    await updateDoc(incomeRef, {
      income,
      uid: user.uid,
    });

    getIncome();
    nav("/");
  };

  useEffect(() => {
    getIncome();
  }, [user]);

  return (
    <>
      <div style={{ left: "0%" }} className="circleOne">
        <span></span>
      </div>
      <div className="circleTwo">
        <span></span>
      </div>
      <div className="income">
        <Navbar />

        <form onSubmit={handleSubmit}>
          <input
            onChange={(e) => setIncome(e.target.value)}
            type="number"
            placeholder={"Current Income: " + current?.income}
          />
          <button
            style={{ backgroundColor: "#adffd6", border: "none" }}
            type="submit"
          >
            Submit
          </button>
        </form>
      </div>
    </>
  );
};

export default Income;
