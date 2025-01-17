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


const ForgotPassword = ({ history, location, ...props }) => {
  const [status, setStatus] = useState('primary');
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async e => {
    try {
      e.preventDefault();
      setSubmitting(true);

      const user = { email: email };
      // const userJSON = JSON.stringify(user);

      // ForgotPassword URL for Auth
      const url = config.backendUrl + "/auth/forgot-password";

      const response = await postRequest(url, user).catch((err) => {
        Swal.fire({
          imageUrl: logoFull,
          imageWidth: "150px",
          title: 'Error',
          text: 'User not exists',
          confirmButtonText: 'OK',
          heightAuto: false
        });

        setStatus('danger');
        setSubmitting(false);
        return
      })

      if (response.status === 200) {
        setSubmitting(false);
        Swal.fire({
          imageUrl: logoFull,
          imageWidth: "150px",
          title: 'Success',
          text: 'Check your mail for new password',
          confirmButtonText: 'OK',
          heightAuto: false
        });
      }

    } catch (err) {
      Swal.fire({
        imageUrl: logoFull,
        imageWidth: "150px",
        title: 'Error',
        text: 'Something went wrong',
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
        <h1>Forgot password</h1>
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
                We'll send new password to your mail address.
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
              ) : ('Change password'
                )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
export default withRouter(ForgotPassword);
