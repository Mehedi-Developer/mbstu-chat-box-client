import { useContext, useEffect, useState } from "react";
import Post from "../Post/Post";
import { Dropdown } from 'react-bootstrap';
import "./feed.css";
import axios from "axios";
import { UserContext } from "../../App";
import { getPosts } from "../../Services/Post.Service";
import { Spin } from "antd";
import Share from "../Share/Share";

export default function Feed(props) {
  const {user, username} = props;
  const [posts, setPosts] = useState([]);
  const [loggedInUser] = useContext(UserContext);
  console.log({username});
  const [active, setActive] = useState(false);
  useEffect(() => {
    const fetchPosts = async () => {
      const res = username
      ? await getPosts({username: username})
      : await getPosts({userId: user?._id});// all posts
      console.log({posts: res});
      res.length > 0 ? setPosts(
        res?.sort((p1, p2) => {
          return new Date(p2.createdAt) - new Date(p1.createdAt);
        })
      ): setPosts([]);
      setActive(true);
    };
    fetchPosts();
  }, [user,username, user._id]);

  return (
    <div className="feed">
      {
        active ? <div className="feedWrapper position-relative">
          {(!username || username === user.username) && <Share />}
          {
            posts?.length > 0 
            ? posts.map((p) => (
              <Post key={p._id} post={p} />
            ))
            : <div style={{top: '180px'}} className="text-center position-relative">
                <h3 className="text-primary">You have no feed</h3>
                <p className="text-danger">Please follow other people</p>
            </div>
          }
        </div>
        : <div style={{top: '180px'}} className="text-center position-relative">
            <Spin size="large" />
        </div>
      }
    </div>
  );
}
