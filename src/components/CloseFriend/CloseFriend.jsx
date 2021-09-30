import { Link } from "react-router-dom";
import "./closeFriend.css";

export default function CloseFriend({user}) {
  return (
    <li className="sidebarFriend">
      <Link className="text-decoration-none text-dark" to={"/profile/" + user.username}>
        <img className="sidebarFriendImg" src={user?.profilePicture} alt="" />
        <span className="sidebarFriendName">{user.username}</span>
      </Link>
    </li>
  );
}
