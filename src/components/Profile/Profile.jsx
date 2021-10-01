import "./profile.css";
import {Image, Spin} from "antd";
import Topbar from "../Topbar/Topbar";
import Sidebar from "../Sidebar/Sidebar";
import Feed from "../Feed/Feed";
// import Rightbar from "../../components/rightbar/Rightbar";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { request } from "../../utils/request";
import Rightbar from "../Rightbar/Rightbar";

export default function Profile() {
  const [user, setUser] = useState({});
  const [active, setActive] = useState(false);
  const username = useParams().username;

  useEffect(() => {
    const fetchUser = async () => {
      const res = await request(`/api/user?username=${username}`);
      console.log({res});
      setUser(res);
      setActive(true);
    };
    fetchUser();
  }, [username]);

  return (
    <>
      {
          active && <>
            <Topbar user={user} />
              <div className="profile">
                <Sidebar user={user} />
                <div className="profileRight">
                  <div className="profileRightTop">
                    <div className="profileCover">
                      <img
                        className="profileCoverImg"
                        src={
                          user.coverPicture
                            ? user.coverPicture
                            : "https://mbstu.ac.bd/images/banner.jpg"
                        }
                        alt=""
                      />
                      <img
                        className="profileUserImg"
                        src={
                          user.profilePicture
                            ? user.profilePicture
                            : "person/noAvatar.png"
                        }
                        alt=""
                      />
                    </div>
                    <div className="profileInfo">
                      <h4 className="profileInfoName">{user?.username}</h4>
                      <span className="profileInfoDesc">{user?.desc}</span>
                    </div>
                  </div>
                  <div className="profileRightBottom">
                    <Feed user={user} username={username} />
                    <Rightbar user={user} />
                  </div>
                </div>
              </div>
          </>
      }
          
    </>
  );
}
