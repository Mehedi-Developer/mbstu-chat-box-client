import "./share.css";
import {
  PermMedia,
  Label,
  Room,
  EmojiEmotions,
  Cancel,
} from "@material-ui/icons";
import { useContext, useRef, useState } from "react";
import { UserContext } from "../../App";
import { request } from "../../utils/request";
import { useHistory } from "react-router";
import { Image, message, notification, Popconfirm } from "antd";
export default function Share({editablePost}) {
  const [ loggedInUser ] = useContext(UserContext);
  // const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const history = useHistory();
  const desc = useRef();
  const [file, setFile] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const submitHandler = async (e) => {
    e.preventDefault();
    const newPost = {
      userId: loggedInUser._id,
      desc: desc.current.value,
      img: imageUrl
    };
    console.log({newPost});
    // if (file) {
    //   const data = new FormData();
    //   const fileName = Date.now() + file.name;
    //   data.append("name", fileName);
    //   data.append("file", file);
    //   // newPost.img = fileName;
    //   console.log({data});
    //   try {
    //     const result = await request("/api/upload", {
    //       method: "POST",
    //       body: data
    //     })
    //     console.log({result});
    //     // await axios.post("/upload", data);
    //   } catch (err) {}
    // }
    try {
      const result = await request("/api/posts", {method: "POST", body: JSON.stringify(newPost)});
      console.log({result});
      const hide =  message.loading("Logging", 60);
      hide();
      console.log({result});
      if(!result?.statusCode){
        // message.success("Your post is shared in MBSTU CHAT BOX");
        notification["success"]({
          message: 'Welcome!!! Mr. '+ loggedInUser?.username,
          description:
            'This is the very important notification. Your post is shared in MBSTU CHAT BOX',
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
  return (
    <div className="">
      <div className="share">
        <form className="shareWrapper" onSubmit={submitHandler}>
          <div className="shareTop mx-4">
            <img
              className="shareProfileImg"
              src={
                loggedInUser.profilePicture
                ? loggedInUser.profilePicture
                : "person/noAvatar.png"
              }
              alt=""
            />
            <textarea
              placeholder={"What's in your mind " + loggedInUser.username + "?"}
              defaultValue={editablePost?.desc}
              value={editablePost?.desc}
              style={{width: "84%"}}
              required
              className="shareInput form-control mt-2"
              ref={desc}
            />
          </div>
          <hr className="shareHr" />
          {file && (
            <div className="shareImgContainer">
              <img className="shareImg" src={URL.createObjectURL(file)} alt="" />
              <Cancel className="shareCancelImg" onClick={() => setFile(null)} />
            </div>
          )}
          <div className="shareBottom">
            <div className="shareOptions">
              <label htmlFor="file" className="shareOption">
                <PermMedia htmlColor="tomato" className="shareIcon" />
                <span className="shareOptionText">Photo/Video</span>
                <input
                  style={{ display: "none" }}
                  type="file"
                  id="file"
                  accept=".png,.jpeg,.jpg"
                  onChange={(e) => {
                    setImage(e.target.files[0]);
                    setFile(e.target.files[0]);
                  }}
                />
              </label>
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
            </div>
            <button className="shareButton" type="submit">
              Share
            </button>

          </div>
          
        </form>
      </div>
    </div>
  );
}
