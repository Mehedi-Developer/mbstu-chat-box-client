import React from 'react';
import Feed from '../Feed/Feed';
import Rightbar from '../Rightbar/Rightbar';
import Sidebar from '../Sidebar/Sidebar';
import Topbar from '../Topbar/Topbar';
import './Home.css';
const Home = ({user}) => {
    return (
        <div>
            <Topbar user={user}/>
            <div className="homeContainer">
                <Sidebar />
                <Feed user={user} />
                <Rightbar />
            </div>
        </div>
    );
};

export default Home;