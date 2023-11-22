import "./App.css";
import Login from "./components/login";
import SignUp from "./components/signUp";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Welcome from "./components/welcome";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/welcome" element={<Welcome />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
