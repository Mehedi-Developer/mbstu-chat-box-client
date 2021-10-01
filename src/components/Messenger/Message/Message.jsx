import "./message.css";
import { format } from "timeago.js";

export default function Message({ message, own, receiver, loggedInUser }) {
  return (
    <div className={own ? "message own" : "message"}>
      <div className="messageTop">
        <img
          className="messageImg"
          src={own ? loggedInUser?.profilePicture : (receiver?.profilePicture || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQvEXVTkwrY52u3dAiss8rOr-tIl1Y7eSf1hw&usqp=CAU")}
          // src={"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQvEXVTkwrY52u3dAiss8rOr-tIl1Y7eSf1hw&usqp=CAU"}
          alt=""
        />
        <p className="messageText">{message.text || "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Asperiores, debitis?"}</p>
      </div>
      <div className="messageBottom">{format(message.createdAt) || "1 min ago"}</div>
    </div>
  );
}
