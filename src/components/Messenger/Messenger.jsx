import "./messenger.css";
// import Topbar from "../topbar/Topbar";
import Conversation from "./Conversations/Conversation";
import Message from "./Message/Message";
import ChatOnline from "./ChatOnline/ChatOnline";
import { useContext, useEffect, useRef, useState } from "react";
import axios from "axios";
import { io } from "socket.io-client";
import { UserContext } from "../../App";
import Topbar from "../Topbar/Topbar";
import { message } from "antd";
import { getConversations } from "../../Services/Conv.Service";
import { request } from "../../utils/request";
import { Input } from "antd";
import { setMessage } from "../../Services/Messge.Service";
export default function Messenger() {
  const [conversations, setConversations] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [receiver, setReceiver] = useState({});
  const socket = useRef();
  const [loggedInUser] = useContext(UserContext);
  const scrollRef = useRef();

  useEffect(() => {
    // socket.current = io("wss://mbstu-chat-box.herokuapp.com:8900");
    socket.current = io("ws://localhost:8900");
    // console.log({socket: socket.current});
    // /
    // socket.current = io();
    socket.current.on("getMessage", (data) => {
      setArrivalMessage({
        sender: data.senderId,
        text: data.text,
        createdAt: Date.now(),
      });
    });
  }, []);

  useEffect(() => {
    arrivalMessage &&
      currentChat?.members.includes(arrivalMessage.sender) &&
      setMessages((prev) => [...prev, arrivalMessage]);
  }, [arrivalMessage, currentChat]);

  useEffect(() => {
    socket.current.emit("addUser", loggedInUser._id);
    socket.current.on("getUsers", (users) => {
      const onLineUsers = [
        ...loggedInUser.followings.filter((f) => users.some((u) => u.userId === f)),
        ...loggedInUser.followers.filter((f) => users.some((u) => u.userId === f))
      ];
      // console.log({onLineUsers});

      setOnlineUsers(onLineUsers);
    });
  }, [loggedInUser]);

  // console.log({onlineUsers});
  useEffect(() => {
    const get_Conversations = async () => {
      try {
        const allConversations = await getConversations({userId: loggedInUser._id});
        // console.log({allConversations});
        // const res = await axios.get("/api/conversations/" + loggedInUser._id);
        setConversations(allConversations);
      } catch (err) {
        console.log(err);
      }
    };
    get_Conversations();
  }, [loggedInUser._id]);

  useEffect(() => {
    const getMessages = async () => {
      try {
        const res = await request("/api/messages/" + currentChat?._id);
        // console.log({messages: res});
        setMessages(res);
      } catch (err) {
        console.log(err);
      }
    };
    getMessages();
  }, [currentChat]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const message = {
      sender: loggedInUser._id,
      text: newMessage,
      conversationId: currentChat._id,
    };

    const receiverId = currentChat.members.find(
      (member) => member != loggedInUser._id
    );
    const socketData = {
      senderId: loggedInUser._id,
      receiverId,
      text: newMessage,
    };
    console.log({socketData});
    socket.current.emit("sendMessage", socketData);

    try {
      const msg = await setMessage({message});
      setMessages([...messages, msg]);
      setNewMessage("");
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  // console.log({onlineUsers});
  return (
    <>
      <Topbar />
      <div className="messenger">
        <div className="chatMenu">
          <div className="chatMenuWrapper py-3">
            <input placeholder="Search for friends" className="chatMenuInput" />
            {/* <Conversation currentUser={loggedInUser} />
            <Conversation currentUser={loggedInUser} />
            <Conversation currentUser={loggedInUser} />
            <Conversation currentUser={loggedInUser} /> */}
            {conversations?.length > 0 && conversations.map((c) => (
              <div>
                <Conversation conversation={c} setMessages={setMessages} setReceiver={setReceiver} setCurrentChat={setCurrentChat} currentUser={loggedInUser} />
              </div>
            ))}
          </div>
        </div>
        <div className="chatBox border-start">
          <div className="chatBoxWrapper">
            <>{/* <div className="chatBoxBottom shadow p-3">
              <textarea
                className="chatMessageInput form-control"
                placeholder="write something..."
                onChange={(e) => setNewMessage(e.target.value)}
                value={newMessage}
              ></textarea>
              <button className="chatSubmitButton mx-5" onClick={handleSubmit}>
                Send
              </button>
            </div> */}</>
            {(currentChat)? (
              <>
                <div className="chatBoxTop">
                  {
                    messages.length > 0 ? messages?.map((m) => (
                      <div ref={scrollRef}>
                        <Message message={m} receiver={receiver} loggedInUser={loggedInUser} own={m.sender === loggedInUser._id} />
                      </div>
                    ))
                    : <h1 className="text-center text-muted text-uppercase ">Start Your Chat</h1>
                  } 
                </div>
                <div className="chatBoxBottom shadow p-3">
                  <Input.TextArea
                    className="shareInput border chatMessageInput form-control"
                    placeholder="write something..."
                    onChange={(e) => setNewMessage(e.target.value)}
                    value={newMessage}
                  ></Input.TextArea>
                  <button className="chatSubmitButton mx-5" onClick={handleSubmit}>
                    Send
                  </button>
                </div>
                <>{/* <div className="chatBoxBottom">
                  <textarea
                    className="chatMessageInput"
                    placeholder="write something..."
                    onChange={(e) => setNewMessage(e.target.value)}
                    value={newMessage}
                  ></textarea>
                  <button className="chatSubmitButton" onClick={handleSubmit}>
                    Send
                  </button>
                </div> */}</>
              </>
            ) : (
              <span className="noConversationText">
                Open a conversation to start a chat.
              </span>
            )}
          </div>
        </div>
        <div className="chatOnline">
          <div className="chatOnlineWrapper">
            <ChatOnline
              onlineUsers={onlineUsers}
              currentId={loggedInUser._id}
              setCurrentChat={setCurrentChat}
            />
            {/* <ChatOnline
              // onlineUsers={onlineUsers}
              // currentId={user._id}
              // setCurrentChat={setCurrentChat}
            /> */}
          </div>
        </div>
      </div>
    </>
  );
}
