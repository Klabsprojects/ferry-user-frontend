import React, { useState, useContext } from 'react';
import classNames from 'classnames';
import { withRouter, Redirect } from 'react-router-dom';
import Swal from 'sweetalert2';
import { useCookies } from 'react-cookie';

import Context from '../../context';
import { makeRequest } from '../../client';
import logoFull from '../../assets/img/logo-full.png';
import config from '../../config';
import { postRequest } from '../../utils/requests';


const Login = ({ history, location, ...props }) => {
  const { dispatch } = useContext(Context);
  // const client = useClient();
  const [status, setStatus] = useState('primary');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [cookies, setCookie] = useCookies();

  const handleSubmit = async e => {
    try {
      e.preventDefault();
      setSubmitting(true);

      const user = { email: email, password: password };
      const userJSON = JSON.stringify(user);

      // Login URL for Auth
      const url = config.backendUrl + "/auth/login";

      const response = await postRequest(url, user).catch((err) => {
        Swal.fire({
          imageUrl: logoFull,
          imageWidth: "150px",
          title: 'Error',
          text: 'Incorrect username or password. Please try again.',
          confirmButtonText: 'OK',
          heightAuto: false
        });

        setStatus('danger');
        setSubmitting(false);
        return
      })

      if (response.status === 200) {
        const user = response.data.user;
        dispatch({ type: "LOGIN_USER", payload: user })
        setSubmitting(false);
        setCookie('user', user);
        // setCookie('token',user.token);
        setCookie('id', user.id);
        console.log("here it is called",location)
        history.push({
          pathname: (location && location.state && location.state.rideId && location.state.rideName && location.state.ridePrice) ? (location.state.rideType === "School" ? "/bulkbook" : "/book") : '/dashboard',
          state: (location && location.state && location.state.rideId && location.state.rideName && location.state.ridePrice) ? { rideId: location.state.rideId, rideName: location.state.rideName, ridePrice: location.state.ridePrice } : null
        });
      }

    } catch (err) {
      Swal.fire({
        imageUrl: logoFull,
        imageWidth: "150px",
        title: 'Error',
        text: 'Incorrect Username or Password, Please try again.',
        confirmButtonText: 'OK',
        heightAuto: false
      });

      setStatus('danger');
      setSubmitting(false);
      console.error({ err });
    }
  };

  return (
    <div id="Routine" className="mb-5 card shadow-lg p-3 mb-5 bg-white box bloat" >
      <center>
        <h1>Login</h1>
      </center>
      <div className={classNames('card border-top', `border-${status}`)}>
        <div className="card-body py-4">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>
                <i className="fas fa-at" />
                &nbsp; Email
                <input
                  type="text"
                  placeholder="Enter your Email Address"
                  className={classNames('form-control mt-2', {
                    'is-valid': status === 'success',
                    'is-invalid': status === 'danger'
                  })}
                  style={{ padding: 15, borderRadius: 10 }}
                  onChange={e => setEmail(e.target.value)}
                  value={email}
                  disabled={submitting}
                  required
                />
              </label>
              <small className="form-text text-muted">
                We'll never share your email with anyone else.
              </small>
            </div>

            <div className="form-group">
              <label>
                <i className="fas fa-unlock-alt" />
                  &nbsp; Password
                  <input
                  type="password"
                  placeholder="Enter your Password"
                  className={classNames('form-control mt-2', {
                    'is-valid': status === 'success',
                    'is-invalid': status === 'danger'
                  })}
                  style={{ padding: 15, borderRadius: 10 }}
                  onChange={e => setPassword(e.target.value)}
                  value={password}
                  disabled={submitting}
                  required
                />
              </label>
              <small className="form-text text-muted">
                Don't share your password with anyone else!
                </small>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className={classNames('btn btn-block', `btn-${status}`)}
              style={{ padding: 10, borderRadius: 10 }}
            >
              {submitting ? (
                <span>
                  <i className="fas fa-circle-notch fa-spin" />
                  &nbsp; Loading
                </span>
              ) : ('Login'
                )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
export default withRouter(Login);
