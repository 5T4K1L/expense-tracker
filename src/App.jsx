import { BrowserRouter, Route, Routes, useNavigate } from "react-router-dom";
import BillPayments from "./pages/BillPayments";
import Dashboard from "./pages/Dashboard";
import Income from "./pages/Income";
import Trips from "./pages/Trips";
import Expenses from "./pages/Expenses";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { useEffect, useState } from "react";
import { auth, db } from "./firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import Visit from "./pages/Visit";

function App() {
  const [user, setUser] = useState(null);

  const userCollection = collection(db, "users");

  useEffect(() => {
    const unsub = auth.onAuthStateChanged((user) => {
      setUser(user);
    });
    return () => unsub();
  });

  return (
    <BrowserRouter>
      <Routes>
        {user ? (
          <>
            <Route index element={<Dashboard />} />
            <Route
              path={`/bills-and-payments/:code`}
              element={<BillPayments />}
            />
            <Route path={`/income/:code`} element={<Income />} />
            <Route path={`/trips/:code`} element={<Trips />} />
            <Route path={`/expenses/:code`} element={<Expenses />} />
            <Route path={`/:trackerCode`} element={<Visit />} />
          </>
        ) : (
          <>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </>
        )}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
