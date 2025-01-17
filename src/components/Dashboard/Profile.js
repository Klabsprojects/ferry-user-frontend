import React, { useState, useEffect } from 'react';
import { withClient } from '../../client';
import { GET_USERS } from '../../graphql/queries';
import { UPDATE_USER } from '../../graphql/mutations';
import Swal from 'sweetalert2';
import logoFull from '../../assets/img/logo-full.png';
import { Link } from 'react-router-dom';
import { useCookies } from 'react-cookie';

const Profile  = ({makeRequest}) => {
	const [email,setEmail] = useState('');
	const [aadhar,setAadhar] = useState('');
	const [fullName,setFullName] = useState('');
	const [age,setAge] = useState('');
	const [phone,setPhone] = useState('');
	const [password,setPassword] = useState('');
	const [disabled,isDisabled] = useState(true);
	const [cookies, removeCookie] = useCookies();
	const [id,setId] = useState(cookies.id);

	const [submitting, setSubmitting] = useState(false);
	const [enablePassword,setEnablePassword] = useState(false);

	useEffect(()=>{
		makeRequest(GET_USERS).then((data)=>{
			for(var i=0;i<data.getUsers.length;i++)
			{
				if(data.getUsers[i].id===id)
				{
					setEmail(data.getUsers[i].email);
					setAadhar(data.getUsers[i].aadhar);
					setFullName(data.getUsers[i].fullName);
					setPhone(data.getUsers[i].phone);
					setAge(data.getUsers[i].age);
				}
			}
		})
	},[])

	const handleEdit = async e => {
		if(disabled) {
			isDisabled(false);
		} else {
			isDisabled(true);
		}
	}

	const changePassword = async e => {
		if(enablePassword) {
			setEnablePassword(false);
		} else {
			setEnablePassword(true);
		}
	}

	const handleSubmit = async e => {
		e.preventDefault();
		setSubmitting(true);
		var userId= id;
		if(!enablePassword) {
			const variables = {
				userId,
				aadhar,
				email,
				fullName,
				phone,
				age
			  };
	  
			  const response = await makeRequest(UPDATE_USER, variables);
	  
			  if(response){
				  Swal.fire({
					imageUrl:logoFull,
					  imageWidth: "150px",
					  imageHeight:"50px",
					  title: 'Updated your details!',
					  confirmButtonText: 'Okay',
					  heightAuto: false
				  })
				  setSubmitting(false);
			  }
			  else {
				  Swal.fire({
					  imageUrl:logoFull,
						imageWidth: "150px",
						imageHeight:"50px",
						title: 'Something went wrong.',
						confirmButtonText: 'Okay',
						heightAuto: false
					});
					setSubmitting(false);
			  }
		} else {
			const variables = {
				userId,
				aadhar,
				email,
				fullName,
				phone,
				password,
				age
			  };
	  
			  const response = await makeRequest(UPDATE_USER, variables);
	  
			  if(response){
				  Swal.fire({
					imageUrl:logoFull,
					  imageWidth: "150px",
					  imageHeight:"50px",
					  title: 'Updated your details!',
					  confirmButtonText: 'Okay',
					  heightAuto: false
				  })
				  setSubmitting(false);
			  }
			  else {
				  Swal.fire({
					  imageUrl:logoFull,
						imageWidth: "150px",
						imageHeight:"50px",
						title: 'Something went wrong.',
						confirmButtonText: 'Okay',
						heightAuto: false
					});
					setSubmitting(false);
			  }
		}
		
	}

	return (
		<div className="container bg-light mt-5 p-3 px-4 rounded-lg">
			<h1 className="mb-4"> Profile </h1>
			<button 
			type="button" 
			className='btn btn-block btn-primary'
			style={{padding:10,borderRadius:10,width:200}}
			onClick={handleEdit}
		    >
				<i className="fa fa-unlock-alt"></i> Edit Details
			</button>
			<br />
			<div className="card-group">
				<div className="card">
					<div className="card-body">
						<h5 className="card-title"> Your Details </h5>
						<form onSubmit={handleSubmit}>
						<div className="form-group">
							<label>
								<i className="fas fa-at" />
								&nbsp; Email
								<input
								type="email"
								placeholder="Enter Email"
								className='form-control mt-2'
								style={{padding:15,borderRadius:10,width:400}}
								value={email}
								disabled={true}
								required
								onChange={e => setEmail(e.target.value)}
								/>
							</label>
						</div>
						<div className="form-group">
							<label>
								<i className="fas fa-user" />
								&nbsp; Full Name
								<input
								type="text"
								placeholder="Enter Full Name"
								className='form-control mt-2'
								style={{padding:15,borderRadius:10,width:400}}
								value={fullName}
								disabled={disabled}
								required
								onChange={e => setFullName(e.target.value)}
								/>
							</label>
						</div>	
						<div className="form-group">
							<label>
								<i className="fas fa-mobile" />
								&nbsp; Mobile Number
								<input
								type="text"
								placeholder="Enter Mobile Number"
								pattern="\d{10}"
								className='form-control mt-2'
								style={{padding:15,borderRadius:10,width:400}}
								value={phone}
								disabled={disabled}
								required
								onChange={e => setPhone(e.target.value)}
								/>
							</label>
						</div>
						<div className="form-group">
							<label>
								<i className="fas fa-user" />
								&nbsp; Age
								<input
								type="number"
								placeholder="Enter Age"
								className='form-control mt-2'
								style={{padding:15,borderRadius:10,width:400}}
								value={age}
								disabled={disabled}
								required
								onChange={e => setAge(e.target.value)}
								/>
							</label>
						</div>
						<div className="form-group">
							<label>
								<i className="fas fa-id-card" />
								&nbsp; Aadhar Number / Passport Number
								<input
								type="text"
								placeholder="Enter Aadhar / Passport Number"
								className='form-control mt-2'
								style={{padding:15,borderRadius:10,width:400}}
								value={aadhar}
								disabled={disabled}
								required
								onChange={e => setAadhar(e.target.value)}
								/>
							</label>
						</div>
						<div className="form-group">
							<label>
								<i className="fas fa-unlock-alt" />
								&nbsp; Password
								<input
								type="password"
								placeholder="Enter New Password"
								className='form-control mt-2'
								pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
								style={{padding:15,borderRadius:10,width:400}}
								value={password}
								disabled={!enablePassword}
								required
								onChange={e => setPassword(e.target.value)}
								/>
							</label>
							<small className="form-text text-muted">
							Password field that must contain 8 or more characters that are
							of at least one number, and one uppercase and lowercase letter
							</small>
							<button 
							type="button" 
							className='btn btn-block btn-secondary'
							style={{padding:10,borderRadius:10,width:400}}
							onClick={changePassword}
							>
								<i className="fa fa-cog"></i> {enablePassword ? ( "Cancel" ) : ("Change Password")}
							</button>
							

						</div>
						

						<button 
						type='submit'
						className='btn btn-block btn-primary'
						style={{padding:10,borderRadius:10}}
						>
						{submitting ? (
							<span>
							<i className="fas fa-circle-notch fa-spin" />
							&nbsp; Loading
							</span>
						) : (
							'Update'
						)}
						</button>
						</form>
					</div>
				</div>
			</div>
		</div>
	)
}

export default withClient(Profile);