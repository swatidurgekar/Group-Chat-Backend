import { useRef } from "react";
import "./createGroup.css";

const CreateGroup = ({ toggleCreateGroupModal, createGroup }) => {
  const name = useRef();

  const submitHandler = () => {
    createGroup(name.current.value);
  };

  return (
    <>
      <div className="backdrop" onClick={toggleCreateGroupModal}></div>
      <div className="create-group">
        <h3>Create Group</h3>
        <form onSubmit={submitHandler}>
          <label>Provide a group name</label>
          <input
            name="name"
            type="text"
            placeholder="Group name"
            ref={name}
            required
          />
          <button type="submit">Create</button>
        </form>
      </div>
    </>
  );
};

export default CreateGroup;
