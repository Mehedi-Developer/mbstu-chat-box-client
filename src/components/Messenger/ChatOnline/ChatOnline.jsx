import axios from "axios";
import { useEffect, useState } from "react";
import { getConversations } from "../../../Services/Conv.Service";
import { request } from "../../../utils/request";
import "./chatOnline.css";

export default function ChatOnline({ onlineUsers, currentId, setCurrentChat }) {
  const [friends, setFriends] = useState([]);
  const [onlineFriends, setOnlineFriends] = useState([]);
  // console.log({onlineUsers});
  useEffect(() => {
    const getFriends = async () => {
      const res = await request("/api/user/friends/" + currentId);
      setFriends(res);
    };

    getFriends();
  }, [currentId]);

  useEffect(() => {
    setOnlineFriends(friends.length > 0 && friends?.filter((f) => !onlineUsers?.includes(f._id)));
  }, [friends, onlineUsers]);

  // console.log({onlineFriends});
  const handleClick = async (user) => {
    try {
      const res = await getConversations({friendId: currentId, userId: user._id});
      setCurrentChat(res);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="chatOnline">
       {onlineFriends.length > 0 && onlineFriends?.map((o) => (
      //{[1,2,4,5,6,7].map((o) => (
        <div className="chatOnlineFriend" onClick={() => handleClick(o)}>
          <div className="chatOnlineImgContainer">
            <img
              className="chatOnlineImg"
              src={
                o?.profilePicture
                  ? o.profilePicture
                  : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQvEXVTkwrY52u3dAiss8rOr-tIl1Y7eSf1hw&usqp=CAU"
              }
              alt=""
            />
            <div className="chatOnlineBadge"></div>
          </div>
          {/* <span className="chatOnlineName">{"Mr. X"}</span> */}
          <span className="chatOnlineName">{o?.username || "Mr. X"}</span>
        </div>
      ))}
    </div>
  );
}
