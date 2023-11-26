import { useRef } from "react";
import "./createGroup.css";

const AddMember = ({ toggleAddMembersModel, addMembersHandler }) => {
  const email = useRef();

  const submitHandler = (event) => {
    event.preventDefault();
    addMembersHandler(email.current.value);
  };

  return (
    <>
      <div className="backdrop" onClick={toggleAddMembersModel}></div>
      <div className="create-group">
        <h3>Add Member</h3>
        <form onSubmit={submitHandler}>
          <label>Email</label>
          <input
            name="email"
            type="email"
            placeholder="test@gmail.com"
            ref={email}
            required
          />
          <button type="submit">Add</button>
        </form>
      </div>
    </>
  );
};

export default AddMember;
