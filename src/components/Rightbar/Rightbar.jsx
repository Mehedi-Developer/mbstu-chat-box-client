import "./rightbar.css";
// import Online from "../online/Online";
import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Add, Remove } from "@material-ui/icons";
import { UserContext } from "../../App";
import { request } from "../../utils/request";
import gift from "../../images/gift.png";
import Online from "../Online/Online";
import { useHistory } from "react-router";
export default function Rightbar({ user }) {
  const [friends, setFriends] = useState([]);
  const [loggedInUser] = useContext(UserContext);
  const [followed, setFollowed] = useState(
    loggedInUser.followings.includes(user?.id)
  );
  const history = useHistory();
  const [active, setActive] = useState(false);
  // console.log("rightBar",{user});
  useEffect(() => {
    const getFriends = async () => {
      console.log("user = ", user);
      try {
        const friendList = await request("/api/user/friends/" + loggedInUser._id);
        console.log("friendList => ", friendList);
        setFriends(friendList);
        setActive(true);
      } catch (err) {
        console.log(err);
      }
    };
    getFriends();
  }, [user]);

  const handleClick = async () => {
    console.log("follow => ", {user});
    try {
      if (followed) {
        const res = await request(`/api/user/${user._id}/un-follow`, {
          method: "PUT",
          body: JSON.stringify({userId: loggedInUser._id})
        });
        console.log("Un-follow",{res});
        // dispatch({ type: "UNFOLLOW", payload: user._id });
      } else {
        const res = await request(`/api/user/${user._id}/follow`, {
          method: "PUT",
          body: JSON.stringify({userId: loggedInUser._id})
        });
        console.log("Follow", {res});
      }
      setFollowed(!followed);
    } catch (err) {
    }
  };
  const HomeRightbar = ({friends}) => {
    console.log("amar friend ", {friends});
    return (
      <>
        <div className="birthdayContainer m-3">
          <img className="birthdayImg" src={gift} alt="" />
          <b className="birthdayText">
            <span style={{fontSize: "15px", fontWeight: "bold"}}>Mr. XYZ</span> and <span style={{fontSize: "15px", fontWeight: "bold"}}>3 other friends</span> have a birthday today.
          </b>
        </div>
        
        <img className="rightbarAd rounded  mx-3" src="https://www.creativefabrica.com/wp-content/uploads/2020/03/09/Social-Community-Logo-Graphics-3472214-1-312x208.png" alt="" />
        <h4 className="rightbarTitle m-3">Online Friends</h4>
        <ul className="rightbarFriendList m-3">
          {friends?.length > 0 && friends?.map((u) => (
            <Online key={u._id} user={u} />
          ))}
        </ul>
      </>
    );
  };

  const ProfileRightbar = () => {
    return (
      <>
        {user._id !== loggedInUser._id && (
          <button className="rightbarFollowButton" onClick={handleClick}>
            {followed ? "Un-follow" : "Follow"}
            {followed ? <Remove /> : <Add />}
          </button>
        )}
        <h4 className="rightbarTitle">User information</h4>
        <div className="rightbarInfo">
          <div className="rightbarInfoItem">
            <span className="rightbarInfoKey">City:</span>
            <span className="rightbarInfoValue">{user.city || "Tangail"}</span>
          </div>
          <div className="rightbarInfoItem">
            <span className="rightbarInfoKey">From:</span>
            <span className="rightbarInfoValue">{user.from || "Dhaka"}</span>
          </div>
          <div className="rightbarInfoItem">
            <span className="rightbarInfoKey">Relationship:</span>
            <span className="rightbarInfoValue">
              {user?.relationship
                ? "Married"
                : "Single"}
            </span>
          </div>
        </div>
        <h4 className="rightbarTitle">User friends</h4>
        <div className="rightbarFollowin">
          { friends?.length > 0 && friends?.map((friend) => (
            <li key={friend._id} style={{cursor: 'pointer'}} onClick={()=> history.replace("/profile/" + friend.username)} className="my-3 rightbarFriend">
              <div className="rightbarProfileImgContainer">
                <img className="rightbarProfileImg" src={friend.profilePicture} alt="" />
                <span className="rightbarOnline"></span>
              </div>
              <span className="rightbarUsername">{friend.username}</span>
            </li>
            // <Link
            //   to={"/profile/" + friend.username}
            //   style={{ textDecoration: "none", width: "20rem" }}
            //   className="card shadow p-2 m-2"
            // >
            //   <div className="row">
            //     <img
            //       src={
            //         friend.profilePicture
            //           ? friend.profilePicture
            //           : "person/noAvatar.png"
            //       }
            //       alt=""
            //       className="col-md-8"
            //       style={{width: "65px", height: "35px"}}
            //     />
            //     <p className="col-md-4 my-auto text-dark">{friend.username}</p>
            //   </div>
            // </Link>
          ))}
        </div>
      </>
    );
  };
  return (
    <div className="rightbar">
      {
        active && <div className="rightbarWrapper">
          {user ? <ProfileRightbar /> : <HomeRightbar friends={friends} />}
      </div>
      }
      
    </div>
  );
}
