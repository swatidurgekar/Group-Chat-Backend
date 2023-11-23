import { useEffect, useRef, useState } from "react";
import "./welcome.css";
import axios from "axios";

const Welcome = () => {
  const [messages, setMessages] = useState([]);
  const chatMessage = useRef();
  const url = "http://localhost:4000";
  const token = localStorage.getItem("token");
  let intervalId;

  useEffect(() => {
    getMessages();
  }, []);

  async function getMessages() {
    const response = await axios.get(`${url}/api/message/get-message`);
    setMessages(response.data.messages);
  }

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
    getMessages();
  };

  const realtime = () => {
    clearInterval(intervalId);
    intervalId = setInterval(() => {
      getMessages();
    }, 10000);
  };
  realtime();

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
          {messages.map((data) => {
            return (
              <div key={data.id}>
                <div id="data-sender-name">~{data.name}</div>
                <div id="data-sent-message">{data.message}</div>
              </div>
            );
          })}
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
