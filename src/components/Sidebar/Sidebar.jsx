import "./sidebar.css";
import {
  RssFeed,
  Chat,
  PlayCircleFilledOutlined,
  Group,
  Bookmark,
  HelpOutline,
  WorkOutline,
  Event,
  School,
} from "@material-ui/icons";
// import { Users } from "../../utils/fakeData";
import CloseFriend from "../CloseFriend/CloseFriend";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../App";
import { getUsers } from "../../Services/User.Service";

export default function Sidebar() {
  const [seeMore, setSeeMore] = useState(false);
  const [users, setUsers] = useState([]);
  const [loggedInUser] = useContext(UserContext);
  async function loadData(){
    const allUsers = await getUsers();
    // console.log({allUsers});
    const usersButLoggedIn = allUsers?.length > 0 && allUsers?.filter(user => loggedInUser._id != user._id);
    // console.log({usersButLoggedIn});
    allUsers.length > 0 && setUsers(usersButLoggedIn);
  }
  useEffect(() => {
    loadData(); 
  },[""])
  return (
    <div className="sidebar">
      <div className="sidebarWrapper">
        <ul className="sidebarList">
          <li className="sidebarListItem">
            <RssFeed className="sidebarIcon" />
            <span className="sidebarListItemText">Feed</span>
          </li>
          <li className="sidebarListItem">
            <Chat className="sidebarIcon" />
            <span className="sidebarListItemText">Chats</span>
          </li>
          <li className="sidebarListItem">
            <PlayCircleFilledOutlined className="sidebarIcon" />
            <span className="sidebarListItemText">Videos</span>
          </li>
          <li className="sidebarListItem">
            <Group className="sidebarIcon" />
            <span className="sidebarListItemText">Groups</span>
          </li>
          {
            seeMore && <>
                <li className="sidebarListItem">
                  <Bookmark className="sidebarIcon" />
                  <span className="sidebarListItemText">Bookmarks</span>
                </li>
                <li className="sidebarListItem">
                  <HelpOutline className="sidebarIcon" />
                  <span className="sidebarListItemText">Questions</span>
                </li>
                <li className="sidebarListItem">
                  <WorkOutline className="sidebarIcon" />
                  <span className="sidebarListItemText">Jobs</span>
                </li>
                <li className="sidebarListItem">
                  <Event className="sidebarIcon" />
                  <span className="sidebarListItemText">Events</span>
                </li>
                <li className="sidebarListItem">
                  <School className="sidebarIcon" />
                  <span className="sidebarListItemText">Courses</span>
                </li>

            </>
          }
        </ul>
        <button onClick={() => setSeeMore(!seeMore)} className="sidebarButton">See {seeMore ? "Less" : "More"}</button>
        <hr className="sidebarHr" />
        <h6 className="p-3 bg-primary text-light mb-3 font-weight-bold card" style={{width: "fit-content"}}>
          <span className="suggest">Suggest To Follow</span>
        </h6>
        <ul className="sidebarFriendList">
          {users.length > 0 && users.map((u) => (
            <CloseFriend key={u.id} user={u} />
          ))}
        </ul>
      </div>
    </div>
  );
}
