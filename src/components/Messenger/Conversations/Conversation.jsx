import axios from "axios";
import { useEffect, useState } from "react";
import { getFriendUser } from "../../../Services/User.Service";
import "./conversation.css";

export default function Conversation({ conversation, currentUser, setCurrentChat, setMessages, setReceiver }) {
  const [user, setUser] = useState(null);
  // const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  // console.log({conversation});
  useEffect(() => {
    const friendId = conversation.members.find((m) => m != currentUser._id);
    // console.log({friendId});
    const getUser = async () => {
      try {
        const result = await getFriendUser({userId: friendId});
        // const res = await axios("/users?userId=" + friendId)
        setUser(result);
      } catch (err) {
        console.log(err);
      }
    };
    getUser();
  }, [currentUser, conversation]);

  return (
    <div  onClick={() => {
      setMessages([])
      setCurrentChat(conversation);
      setReceiver(user);// Friend
    }} className="conversation">
      <img
        className="conversationImg"
        src={
          user?.profilePicture
            ? user.profilePicture
            : "person/noAvatar.png"
        }
        alt=""
      />
      <span className="conversationName">{user?.username}</span>
    </div>
  );
}
