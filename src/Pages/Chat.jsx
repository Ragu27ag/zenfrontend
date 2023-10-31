import { Button } from "@mui/material";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import "../CSS/Chat.css";
import backendInstance from "../Axios/axios";
import SendIcon from "@mui/icons-material/Send";

const Chat = ({ room, username, socket }) => {
  const [message, setMessage] = useState("");
  const [latest, setLatest] = useState([]);
  const [history, setHistory] = useState([]);

  const User = useMemo(
    () => JSON.parse(sessionStorage.getItem("user")) || {},
    []
  );

  const getHis = useCallback(async () => {
    let { data } = await backendInstance.get(`chats/${room}`);
    console.log(data);
    setHistory([...data]);
  }, [room]);

  console.log(history);

  useEffect(() => {
    getHis();
    socket.on("receive_message", (data) => {
      setLatest((mess) => [...mess, data]);
    });

    return () => socket.removeListener("receive_message");
  }, [socket, getHis]);

  const handleMessage = async () => {
    if (message !== "") {
      const messageData = {
        room: room,
        author: username,
        message: message,
        time:
          new Date(Date.now()).getHours() +
          ":" +
          new Date(Date.now()).getMinutes(),
      };

      await socket.emit("send_message", messageData);
      setLatest((mess) => [...mess, messageData]);

      await backendInstance.post("/chats", messageData);
      setMessage("");
    }
  };

  console.log(latest);

  return (
    <div className="main">
      <div className="chat-body">
        {history.map((mes) => (
          <>
            {User.name === mes.author ? (
              <div className="chat-body-right">
                <p className="msessage">{mes.message}</p>{" "}
                <p className="author">
                  {mes.author} &nbsp;&nbsp;at {mes.time}
                </p>
              </div>
            ) : (
              <div className="chat-body-left">
                <p className="msessage">{mes.message}</p>{" "}
                <p className="author">
                  {mes.author} &nbsp;&nbsp;at {mes.time}
                </p>
              </div>
            )}
          </>
        ))}
        {latest.map((mes) => (
          <>
            {User.name === mes.author ? (
              <div className="chat-body-right">
                <p className="msessage">{mes.message}</p>{" "}
                <p className="author">
                  {mes.author} &nbsp;&nbsp;at {mes.time}
                </p>
              </div>
            ) : (
              <div className="chat-body-left">
                <p className="msessage">{mes.message}</p>{" "}
                <p className="author">
                  {mes.author} &nbsp;&nbsp;at {mes.time}
                </p>
              </div>
            )}
          </>
        ))}
      </div>
      <div className="chat-footer">
        <input
          type="text"
          value={message}
          onChange={(e) => {
            setMessage(e.target.value);
          }}
          style={{ width: "300px", marginLeft: "10px" }}
        />
        &nbsp;&nbsp;&nbsp;
        <Button
          sx={{
            backgroundColor: "buttcolor.main",
            "&.MuiButtonBase-root:hover": {
              bgcolor: "buttcolor.main",
            },
            marginBottom: "5px",
            width: "5px",
          }}
          variant="contained"
          onClick={handleMessage}
        >
          <SendIcon fontSize="10px" />
        </Button>
      </div>
    </div>
  );
};

export default Chat;
