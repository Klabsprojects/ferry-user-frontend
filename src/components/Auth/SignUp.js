import React, { useState, useContext, useEffect, Fragment } from 'react';
import classNames from 'classnames';
import Swal from 'sweetalert2';
import logoFull from '../../assets/img/logo-full.png';
import Context from '../../context';
import Select from 'react-select';
import withReactContent from 'sweetalert2-react-content';
import { makeRequest } from '../../client';
import { USER_EXISTS_QUERY } from '../../graphql/queries';
import { SIGNUP_MUTATION,LOGIN_MUTATION } from '../../graphql/mutations';
import ReactDOM from 'react-dom';
import { useCookies } from 'react-cookie';
import { useHistory, Redirect } from "react-router-dom";
import config from '../../config';
import { postRequest } from '../../utils/requests';

const SignUp = () => {
  // const client = useClient();
  let history = useHistory();
  const { dispatch } = useContext(Context);
  const OtpSwal = withReactContent(Swal);
  const pattern = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/;
  const mobile_pattern = /(?=.*\d).{8,10}/;
  const [status, setStatus] = useState('primary');

  const [password,setPassword] = useState('');
  const [phone,setPhone] = useState('');
  const [age,setAge] = useState('');
  const [fullName,setFullName] = useState('');
  const [email,setEmail] = useState('');
  const [aadhar,setAadhar] = useState('');
  const [userExists,setUserExists] = useState(false)

  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async e => {
    e.preventDefault();
    setSubmitting(true);

    const data = {
      email,
      aadhar,
      password,
      fullName,
      phone,
      age
    };

    const response = await postRequest(config.backendUrl + '/auth/signup', data).catch((err) => {
      console.log('ERROR ', err);
      if(err.message === "user already exists"){
        setUserExists(true);
        setSubmitting(false);
      } else if(err.message === "invalid field") {
        Swal.fire({
          imageUrl:logoFull,
            imageWidth: "150px",
            imageHeight:"50px",
            title: 'Unable to signup, please check if your responses are valid !',
            confirmButtonText: 'Take me there',
            heightAuto: false
        });
        setSubmitting(false);
      } else {
        Swal.fire({
          imageUrl:logoFull,
            imageWidth: "150px",
            imageHeight:"50px",
            title: 'Unable to signup, please try again.',
            confirmButtonText: 'Take me there',
            heightAuto: false
        });
        setSubmitting(false);
      }
    });

    if(!response)
      return

    if(response.status === 200){
      const res = Swal.fire({
        imageUrl:logoFull,
          imageWidth: "150px",
          imageHeight:"50px",
          title: 'All set ! Just login to get cruising !',
          confirmButtonText: 'Take me there',
          heightAuto: false
      }).then(() => {
        setSubmitting(false);
        history.push('/');
      })
    }
  }

  const signupForm = (
    <div>
      <div className="form-group">
        <div className="row">
          <div className="col-md-6"> 
            <label>
              <i className="fas fa-at" />
              &nbsp; Email
              <input
                type="email"
                placeholder="Enter your Email Address"
                className={classNames('form-control mt-2', {
                  'is-valid': status === 'success',
                  'is-invalid': status === 'danger'
                })}
                style={{padding:15,borderRadius:10}}
                onChange={e => setEmail(e.target.value)}
                value={email}
                disabled={submitting}
                required
              />
            </label>
            { 
              userExists ? (
                <small className="form-text text-danger mb-2 ml-1">
                  That email already exists.
                </small>
              ) : (
                <small className="form-text text-muted mb-2 ml-1">
                  We'll never share your email with anyone else.
                </small>
              )
            }
            <label>
              <i className="fas fa-user" />
              &nbsp; Full Name
              <input
                type="text"
                placeholder="Enter your First Name"
                className={classNames('form-control mt-2', {
                  'is-valid': status === 'success',
                  'is-invalid': status === 'danger'
                })}
                style={{padding:15,borderRadius:10}}
                onChange={e => setFullName(e.target.value)}
                value={fullName}
                disabled={submitting}
                required
              />
            </label>
            <br className="" />
            <label>
              <i className="fas fa-mobile" />
              &nbsp; Mobile Number
              <input
                type="text"
                placeholder="Enter your Mobile Number"
                pattern="\d{10}"
                className={classNames('form-control mt-2', {
                  'is-valid': status === 'success',
                  'is-invalid': status === 'danger',
                })}
                style={{padding:15,borderRadius:10}}
                onChange={e => setPhone(e.target.value)}
                value={phone}
                disabled={submitting}
                required
              />
            </label>
          </div>
          <div className="col-md-6">
            <label>
              <i className="fas fa-id-card" />
              &nbsp; Aadhar Number / Passport Number
              <input
                type="text"
                placeholder="Enter your Aadhar / Passport Number"
                className={classNames('form-control mt-2', {
                  'is-valid': status === 'success',
                  'is-invalid': status === 'danger',
                })}
                style={{padding:15,borderRadius:10}}
                onChange={e => setAadhar(e.target.value)}
                value={aadhar}
                disabled={submitting}
                required
              />
            </label>
            <br className="" />
            <div className="">
              <small className="form-text text-muted mb-2 ml-1">
                We'll also never share your aadhar/passport with anyone else.
              </small>
            </div>
            <label>
              <i className="fas fa-user" />
              &nbsp; Age
              <input
                type="text"
                pattern="\d+"
                placeholder="Enter your Age"
                className={classNames('form-control mt-2', {
                  'is-valid': status === 'success',
                  'is-invalid': status === 'danger'
                })}
                style={{padding:15,borderRadius:10}}
                onChange={e => setAge(e.target.value)}
                value={age}
                disabled={submitting}
                required
              />
            </label>
            <br className="" />
            <label>
              <i className="fas fa-unlock-alt" />
              &nbsp; Password
              <input
                minLength={8}
                type="password"
                pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
                placeholder="Enter your Password"
                className={classNames('form-control mt-2', {
                  'is-valid': status === 'success',
                  'is-invalid': status === 'danger'
                })}
                style={{padding:15,borderRadius:10}}
                onChange={e => setPassword(e.target.value)}
                value={password}
                disabled={submitting}
                required
              />
            </label>
            <small className="form-text text-muted">
              Password field that must contain 8 or more characters that are
              of at least one number, and one uppercase and lowercase letter
            </small>
            <br className="" />
          </div>
        </div>
        <button
          type="submit"
          disabled={submitting}
          className={classNames('btn btn-block', `btn-${status}`)}
          style={{padding:10,borderRadius:10}}
        >
          {submitting ? (
            <span>
              <i className="fas fa-circle-notch fa-spin" />
              &nbsp; Loading
            </span>
          ) : (
            'Submit'
          )}
        </button>  
      </div>
    </div>
  )

  return (
    <div id="Routine" className="mb-5 card shadow-sm p-3 mb-5 bg-white box">
      <center>
        {' '}
        <br className="d-md-none" />
        <br className="d-md-none" />
        <h1>SignUp</h1>
      </center>
      <div className={classNames('card border-top', `border-${status}`)}>
        <div className="card-body py-4">
          <form onSubmit={handleSubmit}>
            {signupForm}
          </form>
        </div>
      </div>
    </div>
  );
};
export default SignUp;
