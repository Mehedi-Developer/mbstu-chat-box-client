import React, { useEffect, useRef, useState } from 'react';
import { useContext } from 'react';
import { useParams } from 'react-router';
import { UserContext } from '../../App';
import './MainAuth.css';
import { Link } from 'react-router-dom';
import { GoogleOutlined } from "@ant-design/icons";
import { useHistory, useLocation } from 'react-router';
import { Button } from 'antd/lib/radio';
import firebase from 'firebase/compat/app'; //v9
import 'firebase/compat/auth'; //v9
import { getUsers, setUser } from '../../Services/User.Service';
import { firebaseConfig } from '../../firebase.config';
firebase.initializeApp(firebaseConfig);

const MainAuth = () => {
    const [loggedInUser, setLoggedInUser] = useContext(UserContext);
    const [myUser, setMyUser] = useState("");

    
    // // const facebookProvider = new firebase.auth.FacebookAuthProvider();
    const history = useHistory();
    const location = useLocation();
    // console.log(location);
    let {pathname} = location;
    // console.log(location.state.from.pathname);
    const [allAdmin, setAllAdmin] = useState([]);
    // useEffect(() => {
    //     if(location.state && location.state.from.pathname === '/admin'){
    //         setMyUser('admin');
    //     }
    //     else{
    //         // console.log(location.state)
    //         setMyUser('client');
    //     }
        
    // },[location.state])
    // console.log(myUser);
    const {from} = location.state || { from: { pathname: "/"}};
    
    const handleClick = () =>{
        const googleProvider = new firebase.auth.GoogleAuthProvider();
        firebase.auth().signInWithPopup(googleProvider)
        .then((result) => {
            // The signed-in user info.
            const user = result.user;
            // console.log(user);
            const {displayName, email, photoURL} = user;
            const curUser = {
                email,
                userName: displayName,
                img: photoURL,
                userType: myUser,
                isGoogle: true
            }
            
            setLoggedInUser(curUser);
            localStorage.setItem('auth_user', JSON.stringify(curUser));
            history.replace("/home");
        })
        .catch((error) => {
            // Handle Errors here.
            const errorMessage = error.message;
            console.log(errorMessage, loggedInUser);
        });
    }
    // console.log(loggedInUser);
    const handleUserClick = (userType) =>{
        setMyUser(userType);
    }
    return (
        <div className="bg-home">
            <h1 data-aos="zoom-in"
                data-aos-easing="ease-out-cubic"
                data-aos-duration="2000" 
                className="text-light text-center " 
                style={{position: 'relative',top: '25%'}}
            >   
                MBSTU CHAT BOX
            </h1>
            <div style={{position: 'relative',top: '28%'}} className="d-flex justify-content-center px-2">
                <h4 className="rounded text-center text-info">Hey!!! To connect with friends and the world around</h4>
            </div>
            <div style={{position: 'relative',top: '31%'}} 
                className="d-flex justify-content-center"
            >
                <div data-aos="zoom-in"
                    data-aos-easing="ease-out-cubic"
                    data-aos-duration="2000" 
                    style={{width: '500px', height: "200px"}}
                    className="card login-bg border border-info rounded shadow p-5 m-3"
                >
                    <h1 onClick={() => handleClick()} className="btn btn-outline-warning d-flex my-auto mx-auto align-items-center">
                        <GoogleOutlined className="mt-1" /><span className="mx-2"> Login With Google</span>
                    </h1>

                </div>
            </div>
        </div>
    );
};

export default MainAuth;