import "../styles/Global.css";
import "../styles/Dashboard.css";
import Navbar from "../components/Navbar";
import { useContext, useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { auth, db } from "../firebase";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const [user, setUser] = useState(null);
  const [total, setTotal] = useState("");
  const [currBal, setCurrBal] = useState("");
  const [monthly, setMonthly] = useState([]);
  const [monthlyTotal, setMonthlyTotal] = useState("");
  const [expenses, setExpenses] = useState([]);
  const [expenseTotal, setExpenseTotal] = useState("");
  const [trip, setTrip] = useState([]);
  const [tripTotal, setTripTotal] = useState("");
  const [income, setIncome] = useState([]);
  const nav = useNavigate();

  useEffect(() => {
    const unsub = auth.onAuthStateChanged((user) => {
      setUser(user);
    });
    return () => unsub();
  });

  const getMonthly = async () => {
    const monthlyExpense = collection(db, "monthlyExpense");
    const q = query(monthlyExpense, where("uid", "==", user.uid));
    const querySnapshot = await getDocs(q);
    const newMonthly = querySnapshot.docs.map((doc) => {
      return { id: doc.id, ...doc.data() };
    });

    setMonthly(newMonthly);

    const monthlyTotalAmount = newMonthly.reduce((sum, item) => {
      const numericAmount = parseFloat(item.amount.replace(/[^0-9.-]+/g, ""));
      return sum + numericAmount;
    }, 0);
    setMonthlyTotal(monthlyTotalAmount);
  };

  const getIncome = async () => {
    const monthlyIncome = collection(db, "income");
    const q = query(monthlyIncome, where("uid", "==", user.uid));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      const incomeDoc = querySnapshot.docs[0].data();
      setIncome(incomeDoc);
    }
  };

  const loadTrip = async () => {
    const tripCollection = collection(db, "trip");
    const q = query(tripCollection, where("uid", "==", user.uid));
    const snapshot = await getDocs(q);
    const newTrip = snapshot.docs.map((doc) => {
      const data = doc.data();
      data.id = doc.id;
      return data;
    });
    setTrip(newTrip);

    const tripTotalAmount = newTrip.reduce((sum, item) => {
      const numericAmount = parseFloat(item.amount.replace(/[^0-9.-]+/g, ""));
      return sum + numericAmount;
    }, 0);
    setTripTotal(tripTotalAmount);
  };

  const loadExpense = async () => {
    const expense = collection(db, "expense");
    const q = query(expense, where("uid", "==", user.uid));
    const snapshot = await getDocs(q);
    const newExpense = snapshot.docs.map((doc) => {
      const data = doc.data();
      data.id = doc.id;
      return data;
    });
    setExpenses(newExpense);

    const expenseTotalAmount = newExpense.reduce((sum, item) => {
      const numericAmount = parseFloat(item.amount.replace(/[^0-9.-]+/g, ""));
      return sum + numericAmount;
    }, 0);
    setExpenseTotal(expenseTotalAmount);
  };

  const loadTotalExpense = () => {
    const totalExpense = monthlyTotal + expenseTotal;
    setTotal(totalExpense);
  };

  const currentBalance = () => {
    const currBalance = income.income - total;
    setCurrBal(currBalance);
  };

  useEffect(() => {
    getMonthly();
    getIncome();
    loadTrip();
    loadTotalExpense();
    loadExpense();
  }, [user, monthlyTotal, expenseTotal]);

  useEffect(() => {
    currentBalance();
  }, [total, income]);

  return (
    <>
      <div className="billpayments">
        <Navbar />
      </div>
      <div className="dashboard">
        <div className="circleOne">
          <span></span>
        </div>
        <div className="circleTwo">
          <span></span>
        </div>
        <div className="reports">
          <div className="monthlyIncome">
            <p>Monthly Income</p>
            <p>{income.income}</p>
          </div>
          <div className="totalExpenses">
            <p>Total Expenses</p>
            <p>{total}</p>
          </div>
          <div className="currBalance">
            <p>Current Balance</p>
            <p>{currBal}</p>
          </div>
        </div>

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
                </tr>
              ))}
              <td style={{ color: "red" }}>Total</td>
              <td style={{ color: "red" }}>{monthlyTotal}</td>
            </tbody>
          </table>
        </div>

        <div className="history">
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
                </tr>
              ))}
              <td></td>
              <td style={{ color: "red" }}>Total</td>
              <td style={{ color: "red" }}>{expenseTotal}</td>
            </tbody>
          </table>
        </div>

        <div className="trips">
          <p>Upcoming Trips</p>
          <table>
            <thead>
              <tr>
                <th>Place</th>
                <th>Expected Amt.</th>
              </tr>
            </thead>
            <tbody>
              {trip.map((tr) => (
                <tr key={tr.id}>
                  <td>{tr.place}</td>
                  <td>{tr.amount}</td>
                </tr>
              ))}
              <td style={{ color: "red" }}>Total</td>
              <td style={{ color: "red" }}>{tripTotal}</td>
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export default Dashboard;
