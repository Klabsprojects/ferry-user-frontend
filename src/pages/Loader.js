import React from 'react';
import ReactLoader from 'react-loaders';

import '../assets/scss/loader.scss';

const Loader = () => {
  return (
    <div id="LoaderPage">
      <div className="loader-container">
        <ReactLoader type="ball-scale-multiple" active />
      </div>
    </div>
  );
};

export default Loader;
