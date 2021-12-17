import React, { useState } from "react";

import "./index.css";

const Chat = ({ chats, onChange }) => {
  const [currentChat, setCurrentChat] = useState();

  return (
    <>
      <div
        style={{
          whiteSpace: "pre-wrap",
          marginTop: "5rem",
        }}
        className="mb-5 pb-5 mychats"
      >
        {chats?.map(chats.pop, [...chats])?.map(chat => (
          <>
            <p className={chat?.participantType === "mine" ? "mine" : "theirs"}>
              {chat?.data}
            </p>
          </>
        ))}
      </div>

      <div className="containers">
        <input
          type="text"
          autoFocus
          placeholder="Message..."
          className="chat-box"
          value={currentChat || ""}
          onChange={e => setCurrentChat(e.target.value)}
          onKeyDown={ev => {
            if (ev.key === "Enter" && ev.target?.value.length > 0) {
              onChange(currentChat);
              setCurrentChat("");
              ev.preventDefault();
            }
          }}
        />
      </div>
    </>
  );
};

export default Chat;
