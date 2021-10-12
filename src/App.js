import logo from './logo.svg';
import 'bootstrap/dist/css/bootstrap.min.css';
import "antd/dist/antd.css";
import './App.css';
import AOS from "aos";
import "aos/dist/aos.css";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import ScrollToTop from 'react-scroll-up';
import { createContext, useEffect, useState } from "react";
import Home from './components/Home/Home';
import Register from './components/Register/Register';
import MainAuth from './components/Main/MainAuth';
import PrivateRoute from './components/PrivateRoute/PrivateRoute';
import Profile from './components/Profile/Profile';
import Messenger from './components/Messenger/Messenger';
export const UserContext = createContext();
// import { getUsers } from './Components/Services/User.Service';
// import { all_users } from './utils/fakeData';
// import { getUsers } from './Components/Services/User.Service';
function App() {
  const [loggedInUser, setLoggedInUser] = useState({});
  const [user1, setUser1] = useState({});
  console.log({loggedInUser});
  // const loadUsers = async () => {
    // const data = await getUsers();
    // console.log({data});
    // if(!data?.message){
    //   setUsers(data);
    // }else{
    //   setUsers(all_users);
    // }
  // }
  useEffect(() => {
    AOS.init();
    setLoggedInUser(JSON.parse(localStorage.getItem("auth_user")));
    // loadUsers();
  },[""]);
  return (
    <UserContext.Provider value={[loggedInUser, setLoggedInUser, user1, setUser1]}>
      <Router>
        <Switch>
          <Route exact path="/">
            {(loggedInUser?.username) ? <Home user={loggedInUser}/>
            : (localStorage.getItem("auth_user")) ? <Redirect to="/register" /> 
            : <MainAuth/>}
          </Route>
          <Route exact path="/main">
            {(loggedInUser?.username) ? <Home user={loggedInUser}/>
            : (localStorage.getItem("auth_user")) ? <Redirect to="/register" />
            : <MainAuth/>}
          </Route>
          <Route exact path="/login">
            {
              (localStorage.getItem("auth_user")) ? <Redirect to="/register" />
              : <MainAuth />
            }
          </Route>
          <Route path="/register">
            {loggedInUser?.username ? <Redirect to="/home" /> : (localStorage.getItem("auth_user")) ? <Register /> : <MainAuth />}
          </Route>
          
          <PrivateRoute exact path="/home">
            {
              (loggedInUser?.username) ? <Home user={loggedInUser}/>
              : <Redirect to="/register" />
            }
          </PrivateRoute>

          <Route exact path="/messenger">
            {
              (loggedInUser?.username)
              ? <Messenger/>
              : (localStorage.getItem("auth_user")) ? <Redirect to="/register" />  
              : <div>Page not found</div>
            }
          </Route>
          <Route exact path="/profile/:username">
            {
              (loggedInUser?.username) 
              ? <Profile user={loggedInUser}/>
              : (localStorage.getItem("auth_user")) ? <Redirect to="/register" />
              : <div>Page not found</div>
            }
          </Route>
          <Route exact path="*">
            {
              <div>Page not found</div>
            }
          </Route>
        </Switch>
      </Router>
    </UserContext.Provider>
  );
}

export default App;
