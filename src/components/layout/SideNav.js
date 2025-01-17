import React, { useContext } from 'react';
import _ from 'lodash';
import { Link } from 'react-router-dom';
import { elastic as Menu } from 'react-burger-menu';
import classNames from 'classnames';

import routes from '../../routes.json';
import Context from '../../context';

const SideNav = props => {
  const { state } = useContext(Context);
  const navLinks = routes
    .filter(route => !('state' in route) || _.isMatch(state, route.state))
    .map((route, i) =>
      'children' in route ? (
        <div key={i} className="menu-item text-dark dropdown">
          <div
            className="dropdown-toggle"
            data-toggle="dropdown"
            aria-haspopup="true"
            aria-expanded="false"
          >
            <i
              className={classNames(route.icon, `text-${route.theme}`, 'fa-fw')}
            />
            &emsp;
            {route.title}
          </div>
          <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
            {route.children.map(({ title, path }, i) => (
              <Link to={path} key={i} className="dropdown-item">
                {title}
              </Link>
            ))}
          </div>
        </div>
      ) : (
        <Link
          to={'path' in route ? route.path : '/'}
          key={i}
          className="menu-item text-dark"
        >
          <i
            className={classNames(route.icon, `text-${route.theme}`, 'fa-fw')}
          />
          &emsp;
          {route.title}
        </Link>
      )
    );

  return (
    <div id="SideNav">
      <Menu {...props}>{navLinks}</Menu>
    </div>
  );
};

export default SideNav;
