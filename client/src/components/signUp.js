import "./signUp.css";
import { useRef } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const SignUp = () => {
  const url = "http://localhost:4000";
  const nameRef = useRef();
  const emailRef = useRef();
  const phoneRef = useRef();
  const passwordRef = useRef();

  const submitHandler = async (event) => {
    event.preventDefault();
    const response = await axios.post(`${url}/api/user/signUp`, {
      name: nameRef.current.value,
      email: emailRef.current.value,
      phone: phoneRef.current.value,
      password: passwordRef.current.value,
    });
    alert(response.data.message);
  };

  return (
    <div className="signUp">
      <header>Welcome To Chat</header>
      <main className="signUp-main">
        <form onSubmit={submitHandler} className="signUp-main-form">
          <div className="signUp-main-form-heading">Sign Up</div>
          <div>
            <div className="label" htmlFor="name">
              Name
            </div>
            <input type="text" name="name" ref={nameRef} required />
          </div>
          <div>
            <div className="label" htmlFor="email">
              Email
            </div>
            <input type="email" name="email" ref={emailRef} required />
          </div>
          <div>
            <div className="label" htmlFor="phone">
              Phone
            </div>
            <input type="number" name="phone" ref={phoneRef} required />
          </div>
          <div>
            <div className="label" htmlFor="password">
              Password
            </div>
            <input type="password" name="password" ref={passwordRef} required />
          </div>
          <button type="submit">Sign Up</button>
          <div>
            <span>Already have an account ? </span>
            <Link id="form-navigation" to="/login">
              Log In
            </Link>
          </div>
        </form>
      </main>
    </div>
  );
};

export default SignUp;
