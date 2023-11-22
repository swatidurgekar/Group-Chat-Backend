import { useState } from "react";
import "./welcome.css";

const Welcome = () => {
  const [chatName, setChatName] = useState("");
  const [messages, setMessages] = useState([]);

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
          <input name="chat" placeholder="Type something..." required />
          <button>send</button>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
