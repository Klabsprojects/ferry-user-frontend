import React, { Suspense, useContext, useReducer, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import WebFont from 'webfontloader';
import AOS from 'aos';
import 'aos/dist/aos.css';
import 'jquery';
import $ from 'jquery'
import 'popper.js';
import 'bootstrap/dist/js/bootstrap';

import './index.scss';
import Loader from './pages/Loader';
import Context from './context';
import reducer from './reducer';
import ProtectedRoute from './ProtectedRoute';
import RouteWithErrorBoundary from './ErrorBoundary'

import { useCookies } from 'react-cookie';
import Aboutus from './pages/aboutus';
import Contact from './pages/contact';
import TNC from './pages/tnc';
import PP from './pages/pp';

const Home = React.lazy(() => import('./pages/Home'));
const Auth = React.lazy(() => import('./pages/Auth'));
const ErrorPage = React.lazy(() => import('./pages/ErrorPage'));
const Dashboard = React.lazy(() => import('./pages/Dashboard'));

AOS.init();

const Root = () => {
  const initialState = useContext(Context);
  const [cookies] = useCookies()
  const initState = cookies.user ? { currentUser: cookies.user, isAuth: true } : initialState
  const [state, dispatch] = useReducer(reducer, initState);

  WebFont.load({
    google: {
      families: ['Lato', 'Montserrat', 'Raleway']
    }
  });

  return (
    <Suspense fallback={<Loader />}>
      <Router>
        <Context.Provider value={{ state, dispatch }}>
          <Switch>
            <Route exact path="/" component={Home} />
            <Route path="/home" component={Home} />
            <Route path="/auth" component={Auth} />
            <ProtectedRoute path="/dashboard" component={Dashboard} />
            <ProtectedRoute path="/book" component={(props) => (<Dashboard {...props} />)} />
            <ProtectedRoute path="/bulkbook" component={(props) => (<Dashboard {...props} />)} />
            <ProtectedRoute path="/bookinghistory" component={Dashboard} />
            <ProtectedRoute path="/bulkbookinghistory" component={Dashboard} />
            <ProtectedRoute path="/ticket" component={(props) => (<Dashboard {...props} />)} />
            <ProtectedRoute path="/bulkticket" component={(props) => (<Dashboard {...props} />)} />
            <ProtectedRoute path="/search" component={(props) => (<Dashboard {...props} />)} />
            <ProtectedRoute path="/profile" component={Dashboard} />
            <ProtectedRoute path="/searchride" component={(props) => (<Dashboard {...props} />)} />
            <Route path="/aboutus" component={Aboutus} />
            <Route path="/contact" component={Contact} />
            <Route path="/tnc" component={TNC} />
            <Route path="/pp" component={PP} />
            <Route
              path="/logout"
              render={rProps => <Auth {...rProps} defaultRoutine="logout" />}
            />
            <Route path="/loader" component={Loader} />
            <Route path="/" component={ErrorPage} />
          </Switch>
        </Context.Provider>
      </Router>
    </Suspense>
  );
};

ReactDOM.render(<Root />, document.getElementById('root'));
