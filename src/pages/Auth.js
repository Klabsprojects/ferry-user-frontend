import React, { useState, useContext, useEffect } from 'react';
import { Link, Redirect, useLocation, useHistory } from 'react-router-dom';
import { useCookies } from 'react-cookie';

import Context from '../context';
// import { useClient } from '../client';
import Login from '../components/Auth/Login';
import ForgotPassword from '../components/Auth/ForgotPassword';
import SignUp from '../components/Auth/SignUp';
import Skeleton from '../components/layout/Skeleton';
import logo from '../assets/img/poom.png';
// import logo from '../assets/img/logo.svg';
import invertedAppLogo from '../assets/img/logo-inverted.png';
import { LOGOUT_MUTATION } from '../graphql/mutations';

import $ from 'jquery'

const Auth = ({ defaultRoutine = 'login' }) => {
  // const client = useClient();
  const history = useHistory()
  const location = useLocation()
  const { state, dispatch } = useContext(Context);
  const [routine, setRoutine] = useState(defaultRoutine);
  const [appLogo, setAppLogo] = useState(logo);
  const [cookies, removeCookie] = useCookies(['user']);

  useEffect(()=>{
    $("#root").addClass("boatbg");
    return () => {
        $("#root").removeClass("boatbg");
      }
  }, [])

  useEffect(() => {
    console.log("track lcoation",location)
  }, [location])

  const displayRoutine = () => {
    if (state.isAuth ) {
      if (routine === 'logout') {
		    removeCookie('token', null, { maxAge: 0 });
        removeCookie('user', null, { maxAge: 0 });
        dispatch({ type: 'LOGOUT_USER' });
        return <Redirect to="/" />
      }
      //return <Redirect to="/searchride" />
      history.push({
        pathname: (location && location.state && location.state.rideId && location.state.rideName && location.state.ridePrice) ? (location.state.rideType === "School" ? "/bulkbook" : "/book") : '/dashboard',
        state: (location && location.state && location.state.rideId && location.state.rideName && location.state.ridePrice) ? { rideId: location.state.rideId, rideName: location.state.rideName, ridePrice: location.state.ridePrice } : null
      });
    }

    switch (routine) {
      case 'signup':
        return <SignUp />;
      case 'forgot':
        return <ForgotPassword />;
      default:
        return <Login />;
    }
  };

  return (
    <Skeleton
      id="AuthPage"
      noFooter
      noHeader
    >
	  <br/>
      <div className="h-100 d-flex flex-column justify-content-center align align-items-center">
        <Link to="/" className="brand-logo">
          <img
            src={appLogo}
            alt="FerryApp"
            className="brand-logo"
          />
        </Link>
        <br />
        
        {displayRoutine()}
        
        <div className="switch-buttons pt-3 border-top row">
          {routine !== 'login' && (
            <div className="col-md-12 my-1">
              <button
                type="submit"
                className="btn btn-secondary btn-block"
                onClick={() => setRoutine('login')}
                style={{padding:10,borderRadius:10}}
              >
                Login
              </button>
            </div>
          )}
          {routine === 'login' && (
            <div className="col-md-12 my-1">
              <button
                type="submit"
                className="btn btn-secondary btn-block"
                onClick={() => setRoutine('forgot')}
                style={{padding:10,borderRadius:10}}
              >
                Forgot password
              </button>
              <button
                type="submit"
                className="btn btn-secondary btn-block"
                onClick={() => setRoutine('signup')}
                style={{padding:10,borderRadius:10}}
              >
                Register
              </button>
              <Link className="navbar-brand btn btn-primary btn-block" style={{
                fontSize:"1rem"
              }} to="/" >
              Back to Home
              </Link>
            </div>
          )}
         
        </div>
      </div>
    </Skeleton>
  );
};

export default Auth;
