import { BrowserRouter, Route, Routes, useNavigate } from "react-router-dom";
import BillPayments from "./pages/BillPayments";
import Dashboard from "./pages/Dashboard";
import Income from "./pages/Income";
import Trips from "./pages/Trips";
import Expenses from "./pages/Expenses";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { useEffect, useState } from "react";
import { auth } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";

function App() {
  const [user, setUser] = useState(null);

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
            <Route path="/bills-and-payments" element={<BillPayments />} />
            <Route path="/income" element={<Income />} />
            <Route path="/trips" element={<Trips />} />
            <Route path="/expenses" element={<Expenses />} />
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
