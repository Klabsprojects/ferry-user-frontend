import React, { useState } from 'react';
import classNames from 'classnames';

import Header from './Header';
import SideNav from './SideNav';

const Skeleton = ({
  id,
  style,
  children,
  noContainer,
  noHeader,
  fullHeight,
  newRef
}) => {
  const [isSideNavOpen, setSideNavStatus] = useState(false);

  return (
    
      <div {...{ id, style }}>
      <SideNav
        pageWrapId="page-wrap"
        outerContainerId={id}
        onStateChange={({ isOpen }) => setSideNavStatus(isOpen)}
        isOpen={isSideNavOpen}
      />
      <div id="page-wrap">
        {!noHeader && (
          <Header newRef={newRef} onBurgerClick={() => setSideNavStatus(!isSideNavOpen)} />
        )}
        <div
          className={classNames({
            container: !noContainer,
            'h-100': fullHeight
          })}
        >
          {children}
        </div>

      </div>
    </div>
    
  );
};

export default Skeleton;
