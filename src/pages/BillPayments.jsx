import React, { useContext, useEffect, useState } from "react";
import "../styles/Global.css";
import "../styles/BillPayments.css";
import "../styles/Dashboard.css";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  query,
  where,
} from "firebase/firestore";
import { db } from "../firebase";
import Navbar from "../components/Navbar";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const BillPayments = () => {
  const { currentUser } = useContext(AuthContext);
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [total, setTotal] = useState(0);
  const [monthly, setMonthly] = useState([]);
  const nav = useNavigate();

  const monthlyExpense = collection(db, "monthlyExpense");

  const getMonthly = async () => {
    try {
      const q = query(monthlyExpense, where("uid", "==", currentUser.uid));
      const snapshot = await getDocs(q);
      const newMonthly = snapshot.docs.map((doc) => {
        const data = doc.data();
        return { id: doc.id, ...data };
      });
      setMonthly(newMonthly);

      const totalAmount = newMonthly.reduce((sum, item) => {
        const numericAmount = parseFloat(item.amount.replace(/[^0-9.-]+/g, ""));
        return sum + numericAmount;
      }, 0);
      setTotal(totalAmount);
    } catch (error) {
      console.error("Error fetching monthly expenses:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await addDoc(monthlyExpense, {
        name,
        amount,
        uid: currentUser.uid,
      });
      setName("");
      setAmount("");
      getMonthly();
    } catch (error) {
      console.error("Error adding document:", error);
    }
  };

  const handleDelete = async (monthlyId) => {
    await deleteDoc(doc(db, "monthlyExpense", monthlyId));
    getMonthly();
  };

  return (
    <>
      <div style={{ left: "0%" }} className="circleOne">
        <span></span>
      </div>
      <div className="circleTwo">
        <span></span>
      </div>
      <div className="billpayments">
        <Navbar />

        <form onSubmit={handleSubmit}>
          <input
            onChange={(e) => setName(e.target.value)}
            type="text"
            value={name}
            placeholder="Name of Bill / Payment"
          />
          <input
            onChange={(e) => setAmount(e.target.value)}
            value={amount}
            type="number"
            placeholder="Amount"
          />
          <button type="submit">Submit</button>
        </form>

        <div className="monthlyPayments">
          <p>Constant Monthly Payments</p>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {monthly.map((month) => (
                <tr key={month.id}>
                  <td>{month.name}</td>
                  <td>{month.amount}</td>
                  <td>
                    <button onClick={() => handleDelete(month.id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              <td style={{ color: "red" }}>Total</td>
              <td style={{ color: "red" }}>{total}</td>
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default BillPayments;
