import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import "../styles/Global.css";
import "../styles/Expense.css";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
} from "firebase/firestore";

import { auth, db } from "../firebase";
import { useParams } from "react-router-dom";

const Expenses = () => {
  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [amount, setAmount] = useState("");
  const [expenses, setExpenses] = useState([]);
  const [total, setTotal] = useState(0);
  const [user, setUser] = useState(null);
  const { code } = useParams();

  const expense = collection(db, "expense");

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (user) {
      await addDoc(expense, {
        name,
        date,
        amount,
        uid: user.uid,
        code,
      });
      loadExpense();
    }
  };

  const loadExpense = async () => {
    const q = query(expense, where("uid", "==", user.uid));
    const snapshot = await getDocs(q);
    const newExpense = snapshot.docs.map((doc) => {
      const data = doc.data();
      data.id = doc.id;
      return data;
    });
    setExpenses(newExpense);

    const total = newExpense.reduce((sum, item) => {
      const numericAmount = parseFloat(item.amount.replace(/[^0-9.-]+/g, ""));
      return sum + numericAmount;
    }, 0);
    setTotal(total);
  };

  const handleDelete = async (expenseId) => {
    await deleteDoc(doc(db, "expense", expenseId));
    loadExpense();
  };

  useEffect(() => {
    if (user) {
      loadExpense();
    }
  }, [user]); // Load expenses when user is authenticated

  return (
    <>
      <div style={{ left: "0%" }} className="circleOne">
        <span></span>
      </div>
      <div className="circleTwo">
        <span></span>
      </div>
      <div className="expenseContainer">
        <Navbar />

        <form onSubmit={handleSubmit}>
          <input
            onChange={(e) => setName(e.target.value)}
            type="text"
            placeholder="Name your Expense"
          />
          <input onChange={(e) => setDate(e.target.value)} type="date" />
          <input
            onChange={(e) => setAmount(e.target.value)}
            type="number"
            placeholder="Amount"
          />
          <button type="submit">Submit</button>
        </form>

        <div style={{ marginTop: "0px" }} className="trips">
          <p>Your Expenses</p>
          <table>
            <thead>
              <tr>
                <th>Expense</th>
                <th>Date</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {expenses.map((exp) => (
                <tr key={exp.id}>
                  <td>{exp.name}</td>
                  <td>{exp.date}</td>
                  <td>{exp.amount}</td>
                  <td>
                    <button onClick={() => handleDelete(exp.id)}>Delete</button>
                  </td>
                </tr>
              ))}
              <tr>
                <td></td>
                <td style={{ color: "red" }}>Total</td>
                <td style={{ color: "red" }}>{total}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default Expenses;
