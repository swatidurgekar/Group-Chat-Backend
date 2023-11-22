import { useRef } from "react";
import "./welcome.css";
import axios from "axios";

const Welcome = () => {
  const chatMessage = useRef();
  const url = "http://localhost:4000";
  const token = localStorage.getItem("token");

  const submitHandler = async (event) => {
    event.preventDefault();
    const response = await axios.post(
      `${url}/api/message/store-message`,
      {
        message: chatMessage.current.value,
      },
      { headers: { Authorization: token } }
    );
    alert(response.data.message);
  };

  return (
    <div className="welcome">
      <div className="welcome-chat-name">
        <div className="chat-heading">Chat</div>
        <div className="chats">
          <div>Default</div>
        </div>
      </div>
      <div className="chat">
        <div className="chat-name">Default</div>
        <div className="chat-messages">
          <div>user1: Hello</div>
          <div>user2 : Hii</div>
        </div>
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
      </div>
    </div>
  );
};

export default Welcome;
