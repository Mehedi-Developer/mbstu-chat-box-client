import React, { useContext } from 'react';
import { Route, Redirect } from 'react-router-dom';
import { UserContext } from '../../App';

const PrivateRoute = ({children, ...rest}) => {
    const [loggedInUser] = useContext(UserContext);
    // console.log({user: loggedInUser?.username});
    // console.log(rest,children);
    
    return (
        <Route
      {...rest}
      render={({ location }) =>
        localStorage.getItem('auth_user') 
        ? ( children )  
        : (
          <Redirect
            to={{
              pathname: "/login",
              state: { from: location }
            }}
          />
        )
      }
    />
    );
};

export default PrivateRoute;