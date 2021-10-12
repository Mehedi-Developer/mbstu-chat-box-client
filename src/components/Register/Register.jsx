import axios from "axios";
import { useContext, useRef, useState } from "react";
import "./register.css";
import { useHistory } from "react-router";
import { authUser } from "../../Services/User.Service";
import { UserContext } from "../../App";
import { message } from "antd";
export default function Register() {
  const [loggedInUser, setLoggedInUser] = useContext(UserContext);
  const [login, setLogin] = useState("sign-up");
  const username = useRef();
  const email = useRef();
  const password = useRef();
  const passwordAgain = useRef();
  const history = useHistory();

  const handleClick = async (e) => {
    e.preventDefault();
    let user;
    if(login === 'log-in') {
      user = {
        email: email?.current?.value,
        password: password?.current?.value,
      };
    //   console.log({user});
      const result = await authUser({key: "login", body: user});
      // const result = await axios.post("http://localhost:4000/auth/login", user);
      console.log({result});
      const hide =  message.loading("Logging", 60);
      hide();
      if(result?.statusCode){
        message.error(result.message);
      }else{
        message.success("You logged in successfully");
        setLoggedInUser(result);
        localStorage.setItem('auth_user', JSON.stringify({...result, isGoogle: false}));
        history.push("/main");
      }
    }else{
        if (passwordAgain?.current?.value !== password?.current?.value) {
          passwordAgain?.current.setCustomValidity("Passwords don't match!");
        } 
        else {
            user = {
            username: username?.current?.value,
            email: email?.current?.value,
            profilePicture: loggedInUser?.img,
            coverPicture: "https://mbstu.ac.bd/images/banner.jpg",
            password: password?.current?.value,
          };
          try {
            const result = await authUser({key: "register", body: user});
            const hide =  message.loading("Logging", 60);
            hide();
            if(result?.statusCode){
              message.error(result.message);
            }else{
              message.success("You signed up successfully");
              setLoggedInUser({...result, isGoogle: false});
              localStorage.setItem('auth_user', JSON.stringify({...result, isGoogle: false}));
              history.push("/");
              // history.push("/main");
            }
          } catch (err) {
            console.log(err);
          }
        }
    }
  };

  return (
    <div className="login">
      <div className="row loginWrapper">
        <div className="col-md-6 loginLeft">
          <h5 className="loginLogo">MBSTU CHAT BOX</h5>
          <span className="loginDesc">
            Connect with friends and the world around you on MBSTU CHAT BOX
          </span>
        </div>
        <div className="col-md-6 loginRight">
          <form className="loginBox" onSubmit={handleClick}>
            {
              login === "sign-up" && <input
                placeholder="Username"
                required
                ref={username}
                className="loginInput"
              />
            }
            
            <input
              placeholder="Email"
              required
              ref={email}
              className="loginInput"
              type="email"
            />
            <input
              placeholder="Password"
              required
              ref={password}
              className="loginInput"
              type="password"
              minLength="5"
            />
            {
              login === "sign-up" && <input
                placeholder="Password Again"
                required
                ref={passwordAgain}
                className="loginInput"
                type="password"
              />
            }
            
            <button className={`${login === "sign-up" ? "loginButton" : "loginRegisterButton"} my-2`} type="submit">
              {
                login === "sign-up" ? "Sign up" : "Log in"
              }
            </button>
            <label onClick={()=> setLogin("log-in")} style={{cursor: "pointer"}} 
              className={`text-center text-success text-decoration-underline ${login === "sign-up" ? "d-block" : "d-none"}`}
            >
              Log into Account
            </label>
            <label onClick={()=> setLogin("sign-up")} style={{cursor: "pointer"}} style={{cursor: "pointer"}} 
              className={`text-center text-danger text-decoration-underline ${login === "log-in" ? "d-block" : "d-none"}`}
            >
              Sign Up With Account
            </label>
          </form>
        </div>
      </div>
    </div>
  );
}
