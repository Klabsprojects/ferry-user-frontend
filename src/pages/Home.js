import React,{useContext,useRef} from 'react';


import Skeleton from '../components/layout/Skeleton';
import mainImage from '../assets/img/ship.png';
import backImage from '../assets/img/kanyakumari.jpg';

import FeaturedRides from '../components/Dashboard/FeaturedRides'




const Home = () => {
  const newRef = useRef()
  const scrollToBottom = () => {
    newRef.current.scrollIntoView({ behavior: "smooth" })
  }
  const myStyle={
    backgroundImage:
    'url(' + backImage + ')',
    height:'80vh',
    marginTop:'-30px',
    fontSize:'50px',
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    
};
  return (
    
      <Skeleton id="HomePage" noContainer newRef={newRef}>
      
      <div style={myStyle} class="home-bg">
        <section className="first my-4">
          <div className="container">
            <div className="row align-items-center">
              <div className="col-md-7 home-content">
                <h2>
                  Welcome to{' '}
                  <span className="text-primary">
                    <strong>Poompuhar Shipping Corporation Kanyakumari Ferry Service!</strong>
                  </span>
                </h2>
                <p className="lead">
                Find and book your Ferry easily!
                </p>
                {/* <br /> */}
                <div className="btn btn-primary mx-0" onClick={e => scrollToBottom(e)}>
							      Search Rides
                </div>

                <br className="d-md-none" />
                <br className="d-md-none" />
              </div>
              <div className="col-md-5">
                {/* <img className="main-image w-100" src={mainImage} alt="" /> */}
              </div>
              
            </div>
          </div>
        </section>
      </div>
      
      

      
      <div ref={newRef}>

      </div>
      <FeaturedRides toLogin />
      
    </Skeleton>
    
    
  );
};

export default Home;
