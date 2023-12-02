import { useEffect, useRef, useState } from "react";
import "./welcome.css";
import axios from "axios";
import { FaRegPenToSquare } from "react-icons/fa6";
import CreateGroup from "./createGroup";
import AddMember from "./addMembers";

const Welcome = () => {
  const [messages, setMessages] = useState([]);
  const [createGroupModal, setCreateGroupModal] = useState(false);
  const [addMembersModal, setAddMembersModal] = useState(false);
  const [selected, setSelected] = useState({ name: "" });
  const [isAdmin, setIsAdmin] = useState(false);
  const [groups, setGroups] = useState([]);
  const [users, setUsers] = useState([]);
  const [admins, setAdmins] = useState([]);
  const chatMessage = useRef();
  const url = "http://35.154.31.20:4000";
  const token = localStorage.getItem("token");
  let intervalId;

  useEffect(() => {
    getGroups();
  }, []);

  async function getGroups() {
    const response = await axios.get(`${url}/api/group/get-groups`, {
      headers: { Authorization: token },
    });
    if (response.data.success) {
      setGroups(response.data.groups);
    }
  }

  async function getMessages(group) {
    getGroups();
    let parsedLocalMessages = [];
    let msgId;
    const localMessages = localStorage.getItem(group.id);
    if (localMessages) {
      parsedLocalMessages = JSON.parse(localMessages);
      if (parsedLocalMessages.length === 0) {
        msgId = 0;
      } else {
        msgId = parsedLocalMessages[parsedLocalMessages.length - 1].id;
      }
    } else {
      msgId = 0;
    }
    const response = await axios.post(
      `${url}/api/message/get-message/${group.id}`,
      {
        msgId,
      },
      {
        headers: { Authorization: token },
      }
    );
    setIsAdmin(response.data.admin);
    const allMessages = parsedLocalMessages.concat(response.data.messages);
    if (allMessages.length > 10) {
      allMessages.splice(0, allMessages.length - 10);
    }
    localStorage.setItem(group.id, JSON.stringify(allMessages));
    setMessages(allMessages);
  }

  const submitHandler = async (event) => {
    const groupUser = groups.filter((group) => {
      return group.name === selected.name;
    });
    event.preventDefault();
    if (groupUser.length === 0) {
      alert("You are not a user of this group");
    } else {
      const response = await axios.post(
        `${url}/api/message/store-message`,
        {
          message: chatMessage.current.value,
          groupId: selected.id,
        },
        { headers: { Authorization: token } }
      );
      alert(response.data.message);
      getMessages(selected);
    }
  };

  const realtime = () => {
    clearInterval(intervalId);
    intervalId = setInterval(() => {
      getMessages();
    }, 30000);
  };
  // realtime();

  const toggleCreateGroupModal = () => {
    setCreateGroupModal((prevState) => !prevState);
  };

  const toggleAddMembersModel = () => {
    setAddMembersModal((prevState) => !prevState);
  };

  const addMembersHandler = async (email) => {
    const response = await axios.post(`${url}/api/group/add-user`, {
      groupId: selected.id,
      email,
    });
    alert(response.data.message);
    toggleAddMembersModel();
  };

  const showMembers = async () => {
    setAddMembersModal((prevState) => !prevState);
    const response = await axios.get(
      `${url}/api/group/get-members/${selected.id}`
    );
    if (response.data.success) {
      const responseUsers = response.data.users;
      const responseAdmins = response.data.admins;
      let filteredUsers = responseUsers.filter(
        (user) => !responseAdmins.some((admin) => admin.email === user.email)
      );
      setUsers(filteredUsers);
      setAdmins(responseAdmins);
    }
  };

  const createGroup = async (name) => {
    await axios.post(
      `${url}/api/group/create-group`,
      { name },
      { headers: { Authorization: token } }
    );
    getGroups();
  };

  const selectGroup = (group) => {
    setSelected(group);
    getMessages(group);
  };

  return (
    <div className="welcome">
      <div className="welcome-chat-name">
        <div className="welcome-chat-name-heading">
          <div className="chat-heading">Chat</div>
          <div className="chat-icon" onClick={toggleCreateGroupModal}>
            <FaRegPenToSquare />
          </div>
        </div>
        {groups.map((group) => {
          return (
            <div
              className="chats"
              onClick={() => selectGroup(group)}
              key={group.id}
            >
              {group.name}
            </div>
          );
        })}
      </div>
      <div className="chat">
        {selected.name && (
          <div className="chat-name">
            <div>{selected.name}</div>
            <button onClick={showMembers}>All members</button>
          </div>
        )}
        {createGroupModal && (
          <CreateGroup
            toggleCreateGroupModal={toggleCreateGroupModal}
            createGroup={createGroup}
          />
        )}
        {addMembersModal && (
          <AddMember
            isAdmin={isAdmin}
            toggleAddMembersModel={toggleAddMembersModel}
            addMembersHandler={addMembersHandler}
            users={users}
            admins={admins}
            selected={selected}
          />
        )}
        <div className="chat-messages">
          {messages.map((data) => {
            return (
              <div key={data.id}>
                <div id="data-sender-name">~{data.name}</div>
                <div id="data-sent-message">{data.message}</div>
              </div>
            );
          })}
        </div>
        {selected.name && (
          <div className="chat-input">
            <input
              name="chat"
              placeholder="Type something..."
              ref={chatMessage}
              required
            />
            <button type="submit" onClick={submitHandler}>
              send
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Welcome;
