import React, { useContext } from 'react';
import _ from 'lodash';
import classNames from 'classnames';
import { Link, NavLink } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import Context from '../../context';
import routes from '../../routes.json';

const NavLinks = () => {
  const { state } = useContext(Context);
  const [cookies] = useCookies(['user']);
  if (cookies.user) {
    state.isAuth = true;
  } else {
    state.isAuth = false;
  }
  return routes
    .filter(route => !('state' in route) || _.isMatch(state, route.state))
    .map((route, i) => (
      <li
        className={classNames('nav-item', {
          dropdown: 'children' in route
        })}
        key={i}
      >
        <div className="nav-link">
          <NavLink
            className={classNames(
              'btn rounded-pill px-3 py-3 mx-1 border-0',
              `btn-outline-${route.theme}`,
              {
                disabled: route.disabled
              }
            )}
            activeClassName="nav-link-active"
            to={'path' in route ? route.path : '/'}
            disabled={!('path' in route)}
            id={'children' in route ? 'navbarDropdown' : null}
            role={'children' in route ? 'button' : null}
            data-toggle={'children' in route ? 'dropdown' : null}
            aria-haspopup={'children' in route ? 'true' : null}
            aria-expanded={'children' in route ? 'false' : null}
          >
             {route.title == 'Name' ? 'Hi ' + cookies.user.fullName : route.title}
          </NavLink>
          {'children' in route && (
            <div
              className={classNames(
                'dropdown-menu position-absolute',
                `border-${route.theme}`
              )}
              aria-labelledby="navbarDropdown"
            >
              {route.children.map((child, i) => (
                <Link to={child.path} key={i} className="dropdown-item py-3">
                  {child.title}
                </Link>
              ))}
            </div>
          )}
        </div>
      </li>
    ));
};

export default NavLinks;
