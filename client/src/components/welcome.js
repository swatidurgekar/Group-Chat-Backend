import { useCallback, useEffect, useRef, useState } from "react";
import axios from "axios";
import { FaRegPenToSquare } from "react-icons/fa6";
import { io } from "socket.io-client";
import "./welcome.css";
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
  const imgMessage = useRef();
  // const url = "http://3.110.172.25:4000";
  const url = "http://localhost:4000";
  const token = localStorage.getItem("token");
  // const socket = io(url);

  // socket.on("recieve-message", (message) => {
  //   if (selected.id) {
  //     console.log(message);
  //     getMessages(selected);
  //   }
  // });

  const getGroups = useCallback(async () => {
    const response = await axios.get(`${url}/api/group/get-groups`, {
      headers: { Authorization: token },
    });
    if (response.data.success) {
      setGroups(response.data.groups);
    }
  }, []);

  const getMessages = useCallback(
    async (group) => {
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
    },
    [getGroups]
  );
  // socket.on("connect", () => {});
  // socket.on("recieve-message", (message) => {
  //   if (selected.id) {
  //     console.log(message);
  //     const arr = [...messages];
  //     arr.push({ id: 1, message });
  //     setMessages(arr);
  //   }
  // });

  useEffect(() => {
    getGroups();
  }, []);

  const submitHandler = async (event) => {
    event.preventDefault();
    const groupUser = groups.filter((group) => {
      return group.name === selected.name;
    });

    // socket.emit("send-message", chatMessage.current.value, selected.id);
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
      chatMessage.current.value = "";
    }
  };

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
    // socket.emit("join-room", group.id);
  };

  const submitImageHandler = async (e) => {
    e.preventDefault();
    const file = imgMessage.current.files[0];
    if (file && file.type.startsWith("image/")) {
      const formdata = new FormData();
      formdata.append("image", file);
      formdata.append("groupId", selected.id);

      const res = await axios.post(`${url}/api/message/store-image`, formdata, {
        headers: {
          Authorization: token,
          "Content-Type": "multipart/form-data", // Make sure to set the content type
        },
      });
      alert(res.data.message);
      getMessages(selected);
    } else {
      alert("Please select a image file :)");
    }
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
                {data.message.startsWith("https://groupchatimages") ? (
                  <div id="data-sent-message">
                    <a href={data.message} target="_blank">
                      <img src={data.message} />
                    </a>
                  </div>
                ) : (
                  <div id="data-sent-message">{data.message}</div>
                )}
              </div>
            );
          })}
        </div>
        {selected.name && (
          <div className="chat-input">
            <form onSubmit={submitHandler} className="chat-input-form ">
              <input
                name="chat"
                placeholder="Type something..."
                ref={chatMessage}
                required
              />
              <button type="submit">send</button>
            </form>
            <form onSubmit={submitImageHandler} className="chat-input-form ">
              <input name="image" ref={imgMessage} type="file" required />
              <button type="submit">send</button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default Welcome;
