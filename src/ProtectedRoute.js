import React, { useContext } from 'react';
import { Redirect, Route } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import Context from './context';

const ProtectedRoute = ({ component: Component, ...rest }) => {
	const { state,dispatch } = useContext(Context);
	const [cookies, removeCookie] = useCookies();
  if(cookies.user){
    state.isAuth=true;
  }
  else{
    state.isAuth=false;
  }

  if(cookies.user && !cookies.token){
    removeCookie('user', null, { maxAge: 0 });
    dispatch({ type: 'LOGOUT_USER' });
    return <Redirect to="/" />
  }

  return (
    <Route
      render = { props =>
        !state.isAuth ? <Redirect to="/auth" /> : <Component {...props} />
      }
      {...rest}
    />
  );
};

export default ProtectedRoute;
