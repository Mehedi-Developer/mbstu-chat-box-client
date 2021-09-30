import { useHistory } from "react-router";
import "./online.css";

export default function Online({user}) {
  // const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  console.log("online",{user});
  const history = useHistory();
  
  return (
    <li style={{cursor: 'pointer'}} onClick={()=> history.replace("/profile/" + user.username)} className="my-3 rightbarFriend">
      <div className="rightbarProfileImgContainer">
        <img className="rightbarProfileImg" src={user.profilePicture} alt="" />
        <span className="rightbarOnline"></span>
      </div>
      <span className="rightbarUsername">{user.username}</span>
    </li>
  );
}
