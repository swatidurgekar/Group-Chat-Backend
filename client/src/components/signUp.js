import "./signUp.css";

const SignUp = () => {
  const submitHandler = () => {};

  return (
    <div className="signUp">
      <header>Welcome To GroupChat</header>
      <main className="signUp-main">
        <form onSubmit={submitHandler} className="signUp-main-form">
          <div className="signUp-main-form-heading">Log In</div>
          <div>
            <div className="label" htmlFor="name">
              Name
            </div>
            <input type="text" name="name" required />
          </div>
          <div>
            <div className="label" htmlFor="email">
              Email
            </div>
            <input type="email" name="email" required />
          </div>
          <div>
            <div className="label" htmlFor="phone">
              Phone
            </div>
            <input type="number" name="phone" required />
          </div>
          <div>
            <div className="label" htmlFor="password">
              Password
            </div>
            <input type="password" name="password" required />
          </div>
          <button type="submit">Sign Up</button>
          <div>
            <span>Already have an account ? </span>
            <a href="/">Log In</a>
          </div>
        </form>
      </main>
    </div>
  );
};

export default SignUp;
