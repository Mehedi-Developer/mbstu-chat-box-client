import "./topbar.css";
import { Search, Person, Chat, Notifications } from "@material-ui/icons";
import { Link } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { useHistory } from "react-router";
import { UserContext } from "../../App";
import { Dropdown } from 'react-bootstrap';
export default function Topbar(props) {
  const [loggedInUser, setLoggedInUser]  = useContext(UserContext);
  const history = useHistory();
  const {user} = props;
  // console.log("Topbar => ",{user: user});
  const [active, setActive] = useState(false);
  useEffect(() => {
    setActive(true);
  },[""])
  // const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const handleLogout = () => {
    setLoggedInUser({});
    // console.log({user: localStorage.getItem("auth_user")});
    localStorage.removeItem("auth_user");
    history.push("/");
  }
  return <>
    {
      active && <div className="topbarContainer">
        <div className="topbarLeft">
          <Link to="/home" style={{ textDecoration: "none" }}>
            <span className="logo">MBSTU CHAT BOX</span>
          </Link>
        </div>
        <div className="topbarCenter">
          <div className="searchbar">
            <Search className="searchIcon" />
            <input
              placeholder="Search for friend, post or video"
              className="searchInput"
            />
          </div>
        </div>
        <div className="topbarRight">
          <div className="topbarLinks">
            <Link className="text-light font-weight-bold mx-2" to="/home" style={{ textDecoration: "none" }}>
              <span className="topbarLink">Homepage</span>
            </Link>
            <Link className="text-light font-weight-bold mx-2" to={`/profile/${user?.username}`} style={{ textDecoration: "none" }}>
              <span className="topbarLink">Timeline</span>
            </Link>
            
          </div>
          <div className="topbarIcons">
            <Link to={`/profile/${loggedInUser?.username}`} className="topbarIconItem">
              <Person />
              <span className="topbarIconBadge">1</span>
            </Link>
            <Link to={`/messenger`} className="topbarIconItem text-decoration-none">
              <Chat />
              <span className="topbarIconBadge">2</span>
            </Link>
            <div className="topbarIconItem">
              <Notifications />
              <span className="topbarIconBadge">1</span>
            </div>
          </div>
          {/* <Link to={`/profile/${user?.username}`}> */}
            <div className="dropdown">
              <Dropdown>
                <Dropdown.Toggle 
                  variant="transparent" 
                  id="dropdown-basic">
                  <img
                    src={loggedInUser?.profilePicture}
                    alt=""
                    className="topbarImg"
                  />
                </Dropdown.Toggle>

                <Dropdown.Menu style={{backgroundColor:'#73a47'}}>
                  <Dropdown.Item onClick={() => history.replace(`/profile/${loggedInUser?.username}`)}>Profile</Dropdown.Item>
                  <Dropdown.Item>Setting</Dropdown.Item>
                  <Dropdown.Item onClick={() => handleLogout()}>Logout</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>
        </div>
      </div>
    }
  </>;
}
