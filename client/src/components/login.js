import "./signUp.css";
import { useRef, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const url = "http://localhost:4000";
  const emailRef = useRef();
  const passwordRef = useRef();
  const [token, setToken] = useState(localStorage.getItem("token"));

  const submitHandler = async (event) => {
    event.preventDefault();
    const response = await axios.post(`${url}/api/user/login`, {
      email: emailRef.current.value,
      password: passwordRef.current.value,
    });
    alert(response.data.message);
    if (response.data.success) {
      localStorage.setItem("token", response.data.token);
      setToken(response.data.token);
      navigate("/welcome");
    }
  };

  return (
    <div className="signUp">
      <header>Welcome To Chat</header>
      <main className="signUp-main">
        <form onSubmit={submitHandler} className="signUp-main-form">
          <div className="signUp-main-form-heading">Log In</div>
          <div>
            <div className="label" htmlFor="email">
              Email
            </div>
            <input type="email" name="email" ref={emailRef} required />
          </div>
          <div>
            <div className="label" htmlFor="password">
              Password
            </div>
            <input type="password" name="password" ref={passwordRef} required />
          </div>
          <button type="submit">Log In</button>
          <div>
            <span>Don't have an account ? </span>
            <Link id="form-navigation" to="/">
              Sign Up
            </Link>
          </div>
        </form>
      </main>
    </div>
  );
};

export default Login;
