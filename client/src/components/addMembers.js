import { useRef, useState } from "react";
import "./createGroup.css";
import axios from "axios";

const AddMember = ({
  toggleAddMembersModel,
  addMembersHandler,
  isAdmin,
  users,
  admins,
  selected,
}) => {
  const email = useRef();
  const url = "http://3.110.172.25";
  const [addUser, setAddUser] = useState(false);

  const submitHandler = (event) => {
    event.preventDefault();
    addMembersHandler(email.current.value);
  };

  const makeAdmin = async (userId) => {
    const response = await axios.post(
      `${url}/api/group/make-admin/${selected.id}`,
      { userId }
    );
    alert(response.data.message);
    toggleAddMembersModel();
  };

  const deleteUser = async ({ email, isadmin }) => {
    const response = await axios.post(
      `${url}/api/group/delete-user/${selected.id}`,
      { email, isadmin }
    );
    alert(response.data.message);
    toggleAddMembersModel();
  };

  return (
    <>
      <div className="backdrop" onClick={toggleAddMembersModel}></div>
      <div className="create-group">
        {!addUser && isAdmin && (
          <button onClick={() => setAddUser(true)}>Add Members</button>
        )}
        {addUser && (
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
            <button onClick={() => setAddUser(false)}>Cancel</button>
          </form>
        )}
        {admins.map((admin) => {
          return (
            <div className="members" key={admin.id}>
              <div>{admin.email}</div>
              <div>
                <div>Admin</div>
              </div>
            </div>
          );
        })}
        {users.map((user) => {
          return (
            <div className="members" key={user.id}>
              <div>{user.email}</div>
              {isAdmin && (
                <div>
                  <button onClick={() => makeAdmin(user.id)}>Make Admin</button>
                  <button
                    onClick={() => {
                      deleteUser({ email: user.email, isadmin: false });
                    }}
                  >
                    X
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
};

export default AddMember;
