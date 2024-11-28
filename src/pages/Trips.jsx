import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import "../styles/Global.css";
import "../styles/Trip.css";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
} from "firebase/firestore"; // Only one import statement here
import { auth, db } from "../firebase";
import { onAuthStateChanged } from "firebase/auth"; // Only this is necessary

const Trips = () => {
  const [place, setPlace] = useState("");
  const [amount, setAmount] = useState("");
  const [trip, setTrip] = useState([]);
  const [total, setTotal] = useState();
  const [user, setUser] = useState(null);

  const tripCollection = collection(db, "trip");

  useEffect(() => {
    const unsub = auth.onAuthStateChanged((user) => {
      setUser(user);
    });
    return () => unsub();
  }, []); // Ensure that useEffect runs only once when component mounts

  const handleSubmit = async (e) => {
    e.preventDefault();
    await addDoc(tripCollection, {
      place,
      amount,
      uid: user.uid,
    });

    setPlace("");
    setAmount("");
    loadTrip();
  };

  const loadTrip = async () => {
    const q = query(tripCollection, where("uid", "==", user.uid));
    const snapshot = await getDocs(q);
    const newTrip = snapshot.docs.map((doc) => {
      const data = doc.data();
      data.id = doc.id;
      return data;
    });
    setTrip(newTrip);

    const total = newTrip.reduce((sum, item) => {
      const numericAmount = parseFloat(item.amount.replace(/[^0-9.-]+/g, ""));
      return sum + numericAmount;
    }, 0);
    setTotal(total);
  };

  const handleDelete = async (tripId) => {
    await deleteDoc(doc(db, "trip", tripId));
    loadTrip();
  };

  useEffect(() => {
    if (user) {
      loadTrip();
    }
  }, [user]);

  return (
    <>
      <div style={{ left: "0%" }} className="circleOne">
        <span></span>
      </div>
      <div className="circleTwo">
        <span></span>
      </div>
      <div className="tripContainer">
        <Navbar />

        <form onSubmit={handleSubmit}>
          <input
            onChange={(e) => setPlace(e.target.value)}
            type="text"
            placeholder="Country / Place"
          />
          <input
            onChange={(e) => setAmount(e.target.value)}
            type="number"
            placeholder="Expected Amount"
          />
          <button type="submit">Submit</button>
        </form>

        <div style={{ marginTop: "0px" }} className="trips">
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
                  <td>
                    <button onClick={() => handleDelete(tr.id)}>Delete</button>
                  </td>
                </tr>
              ))}
              <tr>
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

export default Trips;
