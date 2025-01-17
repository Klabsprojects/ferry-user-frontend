import React, { useState,useEffect,useRef,useContext } from 'react';
import classNames from 'classnames';
import { Link } from 'react-router-dom';

import NavLinks from './NavLinks';
// import logo from '../../assets/img/logo.png';
// import invertedAppLogo from '../../assets/img/logo-inverted.png';
import ferryLogo from '../../assets/img/ferry_app_icon.png';







const Header = ({ onBurgerClick, newRef }) => {
  

  const scrollToBottom = () => {
    newRef.current.scrollIntoView({ behavior: "smooth" })
  }
  
  

  
  const [appLogo, setAppLogo] = useState(ferryLogo);
  
  return (

    <nav
      id="Header"
      className={classNames('navbar navbar-light')}
      style={{ backgroundColor: 'rgba(0, 0, 0, 0)' }}
    >
      <div className="container p-0">
        <Link className="navbar-brand" to="/">
          <img
            src={ferryLogo}
            // onMouseEnter={() => setAppLogo(invertedAppLogo)}
            // onMouseLeave={() => setAppLogo(logo)}
            className="logo"
            alt=""
          />
        </Link>
        <ul className="navbar-nav d-none d-lg-flex flex-row h-5">
        <div className="btn btn-primary mx-0" onClick={e => scrollToBottom(e)}>
							Search Rides
						</div>
          <NavLinks />
        </ul>
        <ul className="navbar-nav d-flex d-lg-none flex-row">
          <li  className="nav-item">
            
            <button
              type="button"
              className="btn btn-light"
              onClick={onBurgerClick}
            >
              <i className="fas fa-bars" />
            </button>
          </li>
        </ul>
      </div>
      

      </nav>
  );
};

export default Header;
