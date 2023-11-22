import "./signUp.css";
import { useRef } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const Login = () => {
  const url = "http://localhost:4000";
  const emailRef = useRef();
  const passwordRef = useRef();

  const submitHandler = async (event) => {
    event.preventDefault();
    const response = await axios.post(`${url}/api/user/login`, {
      email: emailRef.current.value,
      password: passwordRef.current.value,
    });
    alert(response.data.message);
  };

  return (
    <div className="signUp">
      <header>Welcome To GroupChat</header>
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
