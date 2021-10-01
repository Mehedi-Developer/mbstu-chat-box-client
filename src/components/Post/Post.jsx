import "./post.css";
import {
  PermMedia,
  Label,
  Room,
  EmojiEmotions,
  Cancel,
  MoreVert
} from "@material-ui/icons";
import { DeleteOutlined} from "@ant-design/icons";
import { Image, message, Popconfirm, Modal, Form, Input, Button, notification, Col, Row } from "antd";
import { useContext, useEffect, useState, useRef } from "react";
import axios from "axios";
import { format } from "timeago.js";
import { Link } from "react-router-dom";
import { UserContext } from "../../App";
import LikeLogo from "../../images/like.png";
import HeartLogo from "../../images/heart.png";
import River from "../../images/river.jpeg";
import { likePost } from "../../Services/Post.Service";
import { request } from "../../utils/request";
import { useHistory } from "react-router";
import { Dropdown, DropdownButton, SplitButton } from 'react-bootstrap';
import Share from "../Share/Share";
export default function Post({ post }) {
  const [showModal, setShowModal] = useState(false);
  const [editablePost, setEditablePost] = useState(null);
  const [like, setLike] = useState(post?.likes?.length);
  const [isLiked, setIsLiked] = useState(false);
  const [user, setUser] = useState({});
  // const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const [loggedInUser] = useContext(UserContext);
  const history = useHistory();
  useEffect(() => {
    setIsLiked(post.likes.includes(loggedInUser._id));
  }, [loggedInUser._id, post.likes]);

  useEffect(() => {
    const fetchUser = async () => {
      const res = await request(`/api/user?userId=${post.userId}`);
      console.log({res});
      setUser(res);
    };
    fetchUser();
  }, [post?.userId]);

  const likeHandler = async () => {
    try {
      const res = await likePost({postId: post._id, userId: user._id});
      // console.log({resPost: res});
    } catch (err) {}
    setLike(isLiked ? like - 1 : like + 1);
    setIsLiked(!isLiked);
  };

  const handleDelete = async(userId, postId) => {
    console.log({userId: userId, postId: postId});
    const result = await request(`/api/posts/${postId}`, {
      method: 'DELETE',
      body: JSON.stringify({userId})
    });
    const hide =  message.loading("Logging", 60);
    hide();
    console.log({result});
    if(result?.statusCode === 200){
      message.success(result.message);
      if(window.location.pathname === "/main"){
        history.push("/home");
      }else{
        history.push("/main");
      }
    }else{
      message.error(result.message);
    }
  }
  
  const handleCancel = () => {return null;}

  return (
    <div className="post">
      { 
        showModal && <EditModalForm post={editablePost} showModal={showModal} setShowModal={setShowModal} />
      }
      <div className="postWrapper">
        <div className="postTop">
          <div className="postTopLeft">
            <Link to={`/profile/${user?.username}`}>
              <img
                className="postProfileImg"
                src={
                  user?.profilePicture
                    ? user.profilePicture
                    : "person/noAvatar.png"
                }
                alt=""
              />
            </Link>
            <span className="postUsername">{user?.username}</span>
            <span className="postDate">{format(post?.createdAt)}</span>
          </div>
          <div className="postTopRight">
            <div className="dropdown">
              <Dropdown className="" id="dropdown-menu-align-end">
                <Dropdown.Toggle 
                  variant="transparent"
                   
                >
                  {/* <MoreVert /> */}
                </Dropdown.Toggle>

                <Dropdown.Menu className="bg-second">
                  <Dropdown.Item onClick={() => history.replace(`/profile/${user?.username}`)}>Profile</Dropdown.Item>
                  <Dropdown.Item className="bg-secondary">Setting</Dropdown.Item>
                  {
                    (post?.userId === loggedInUser._id) && <>
                      <Dropdown.Item 
                        onClick={() => {
                          setEditablePost(post);
                          setShowModal(true);
                        }}
                      >
                        Edit
                      </Dropdown.Item>
                      
                        <Popconfirm
                            title={`Are you sure to delete this post?`}
                            onConfirm={() => handleDelete(user?._id, post?._id)}
                            onCancel={handleCancel}
                            okText="Yes"
                            cancelText="No"
                            className="px-3 btn-outline-danger"
                        >
                          {/* <Dropdown.Item > */}
                            <p style={{cursor: 'pointer'}}>Delete</p>
                          {/* </Dropdown.Item> */}
                        </Popconfirm>
                      
                    </>
                  }
                </Dropdown.Menu>
              </Dropdown>
            </div>
          </div>
        </div>
        <div className="postCenter">
          <span className="postText">{post?.desc}</span>
          {
            post?.img && <img className="postImg" src={post?.img} alt="" />
          }
          
        </div>
        <div className="postBottom">
          <div className="postBottomLeft">
            <img
              className="likeIcon"
              src={LikeLogo}
              onClick={likeHandler}
              alt=""
            />
            <img
              className="likeIcon"
              src={HeartLogo}
              onClick={likeHandler}
              alt=""
            />
            <span className="postLikeCounter">{like} people like it</span>
          </div>
          <div className="postBottomRight">
            <span className="postCommentText">{post?.comment} comments</span>
          </div>
        </div>
      </div>
    </div>
  );
}

const EditModalForm = ({post, showModal, setShowModal}) => {
  console.log({editablePost: post});
  return <>
    {
      showModal && <Modal 
            title={"Edit Your Post"}
            visible={showModal}
            // footer={null}
            footer={false}
            style={{ top: 100 }}
            onOk={() => setShowModal(false)}
            onCancel={() => setShowModal(false)}
            width={750}
          >
            <EditPost editablePost={post} setShowModal={setShowModal} />
      </Modal>
    }
  </>
}

function EditPost({editablePost, setShowModal}) {
  const [form] = Form.useForm();
  const [ loggedInUser ] = useContext(UserContext);
  const history = useHistory();
  const desc = useRef();
  const [description, setDescription] = useState(editablePost?.desc);
  const [imageUrl, setImageUrl] = useState(null);
  const submitHandler = async () => {
    const newPost = {
      userId: loggedInUser._id,
      desc: description,
      img: imageUrl
    };
    // console.log({newPost});
    try {
      const result = await request("/api/posts/"+editablePost._id, {method: "PUT", body: JSON.stringify(newPost)});
      console.log({result});
      const hide =  message.loading("Logging", 60);
      hide();
      console.log({result});
      if(result?.statusCode == 200){
        // message.success("Your shared post is updated in MBSTU CHAT BOX");
        notification["success"]({
          message: 'Welcome!!! Mr. '+ loggedInUser?.username,
          description:
            'This is the very important notification. Your shared post is successfully updated in MBSTU CHAT BOX',
        });
        if(window.location.pathname === "/main"){
          history.push("/home");
        }else{
          history.push("/main");
        }
      }else{
        notification["error"]({
          message: 'Sorry!! Mr. '+ loggedInUser?.username,
          description:
            result?.message,
        });;
      }
      
    } catch (err) {}
  };
  const setImage = (file) => {
    console.log(file);
    const imgData = new FormData();
    imgData.set("key", "4ddc64c369e800157d688eb222ce91af");
    imgData.append('image', file);
    fetch("https://api.imgbb.com/1/upload", {
        method: 'POST',
        body: imgData,
        // If you add this, upload won't work
        // headers: {
        //   'Content-Type': 'multipart/form-data',
        // }
    })
    .then(res => res.json())
    .then(data => {
        // console.log(data.data.display_url);
        const url = data.data.display_url;
        console.log({url});
        setImageUrl(url);
    })
    .catch(err => console.log(err))
  }
  const [active, setActive] = useState(false);
  useEffect(() => {
    if(!active) {
      setImageUrl(editablePost.img);
      setActive(true);
    }
  }, [""])
  return (
    <>
      {
        <Form form={form}
          id="myForm"
          className="share p-4" 
          // onSubmit={}
        >
          <Form.Item className="">
            {/* <Row gutters={24}>
              <Col span={8} xs={12} md={8}></Col>
              <Col span={16} xs={12} md={16}></Col>
            </Row> */}
            <Row className="" gutters={24}>
              <Col className="mx-auto mb-3" span={1} xs={24} md={2}>
                <img
                  className="shareProfileImg text-center"
                  src={
                    loggedInUser.profilePicture
                      ? loggedInUser.profilePicture
                      : "person/noAvatar.png"
                  }
                  alt=""
                />
              </Col>
              <Col className="mx-auto" span={20} xs={24} md={20}>
                <Form.Item>
                  <Input.TextArea
                    placeholder={"What's in your mind " + loggedInUser.username + "?"}
                    defaultValue={editablePost?.desc}
                    onChange={(evt) => {setDescription(evt.target.value);}}
                    className="shareInput border"
                    // ref={desc}
                  />
                </Form.Item>
              </Col>
            </Row>
          </Form.Item>
          <hr className="" />
    
          {(imageUrl) && (
            <Form.Item className="shareImgContainer">
              <Image className="shareImg" src={imageUrl} alt="" />
              <Cancel className="shareCancelImg" onClick={() => setImageUrl(null)} />
            </Form.Item>
          )}
          
          <div className="shareBottom">
            <div className="shareOptions">
              <label className="shareOption" htmlFor="image-upload">
                <PermMedia htmlColor="tomato" className="shareIcon" />
                <span className="shareOptionText">Photo/Video</span>
              </label><br />
              <Input onChange={(evt) => setImage(evt.target.files[0])} id="image-upload" type="file" className="d-none" />
            </div>
            <div className="shareOption">
              <Label htmlColor="blue" className="shareIcon" />
              <span className="shareOptionText">Tag</span>
            </div>
            <div className="shareOption">
              <Room htmlColor="green" className="shareIcon" />
              <span className="shareOptionText">Location</span>
            </div>
            <div className="shareOption">
              <EmojiEmotions htmlColor="goldenrod" className="shareIcon" />
              <span className="shareOptionText">Feelings</span>
            </div>
            <button onClick={() => submitHandler()} className="btn btn-outline-success" form="myForm" key="submit" htmlType="submit">
                Share
            </button>
          </div>
        </Form>
      }

    </>
      
  );
}
