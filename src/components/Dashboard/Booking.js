import React, { useState, useEffect } from 'react';
import { withClient } from '../../client';
import { CREATE_BOOKING } from '../../graphql/mutations';
import { CHECK_AADHAR, CHECK_PHONE, SEARCH_RIDES } from '../../graphql/queries';
import Swal from 'sweetalert2';
import logoFull from '../../assets/img/logo-full.png';
import { Link, useHistory } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import { postRequest } from '../../utils/requests';
import config from '../../config';
import { align } from '@progress/kendo-drawing';

import { GET_USERS } from '../../graphql/queries';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
	backdrop: {
		zIndex: theme.zIndex.drawer + 1,
		color: '#ffff',
	},
}))

const Booking = ({ makeRequest, ...props }) => {
	const classes = useStyles();
	const history = useHistory();
	console.log(props.rideId)
	if (!props.rideId) {
		history.goBack();
	}

	const [cookies, removeCookie] = useCookies();

	const [ccodes,setCCodes] = useState([{ value: null }])
	const [fields, setFields] = useState([{ value: null }]);
	const [names, setNames] = useState([{ value: null }]);
	const [ages, setAges] = useState([{ value: null }]);
	const [aadhars, setAadhars] = useState([{ value: null }]);
	const [genders, setGenders] = useState([{ value: "male" }]);
	const [tcount1, setTcount] = useState();

	const [rideId, setRideId] = useState(props.rideId);
	const [bookerId, setBookerId] = useState();

	const [curIdx, setCurIdx] = useState(0);
	const [otpFetched, setOTPFetched] = useState(false);
	const [otp, setOTP] = useState("");
	const [active, setActive] = useState("");
	const [prev, setPrev] = useState("active");
	const [globalIndex, setGlobalIndex] = useState(0);
	const [unitPrice, setUnitPrice] = useState(props.ridePrice);
	const [totalPrice, setTotalPrice] = useState(parseInt(unitPrice));
	let open = false;

	async function displayRazorpay() {
		//open = true;
		console.log('payment success step0-0 razor');
		// return bookTicket("order_" + Math.floor(Math.random() * 10000000000000));

		const res = await loadScript('https://checkout.razorpay.com/v1/checkout.js');

		if (!res) {
			alert('Razorpay SDK failed to load.')
			return
		}

		var amount = ((totalPrice) + ((totalPrice )* 0.025))*100;
		console.log('Razor amount ', amount);
		var finalAmount = amount.toString();
		

		const data = { finalAmount: parseInt(finalAmount) };
		//console.log('final amount ', finalAmount);

		const url = config.backendUrl + "/razorpay";
		//bookTicket("1234");

		const response = await postRequest(url, data).catch((err) => {
			console.log(err);
			Swal.fire({
				imageUrl: logoFull,
				imageWidth: "150px",
				title: 'Error',
				text: 'Something went wrong.',
				confirmButtonText: 'OK',
				heightAuto: false
			});
		});

		if (response.status === 200) {
			const orderId = response.data.id;
			console.log('payment success step0');
			var options = {
				"key": process.env.RAZORPAY_KEY_ID || config.razor_key_id, // Enter the Key ID generated from the Dashboard
				"amount": response.data.amount, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
				"currency": response.data.currency,
				"name": "Poombuhar Shipping Corporation Kanyakumari Ferry Service",
				"description": "Payment for Ride Booking",
				"order_id": response.data.id,
				"handler": function (response) {
					console.log('payment success step1');
					//open = true;
					bookTicket(orderId);
				},
				"theme": {
					"color": "#3399cc"
				}
			};

			const paymentObject = new window.Razorpay(options);
			paymentObject.open();
		}
	}

	function loadScript(src) {
		return new Promise(resolve => {
			const script = document.createElement('script');
			script.src = src;
			script.onload = () => {
				resolve(true);
			}
			script.onerror = () => {
				resolve(false);
			}
			document.body.appendChild(script);
		})
	}

	function handleFullname(i, event) {
		const values = [...names];
		values[i].value = event.target.value;
		setNames(values);
	}

	function handleAge(i, event) {
		const values = [...ages];
		values[i].value = event.target.value;
		setAges(values);
	}

	function handleCCode(i, event) {
		const conts = [...ccodes];
		let value = event.target.value.replace("+","")
		conts[i].value = value;
		setCCodes(conts);
	}

	function handlePhone(i, event) {
		const values = [...fields];
		let value = event.target.value
		values[i].value = value;
		setFields(values);
	}

	function handleAadhar(i, event) {
		const values = [...aadhars];
		values[i].value = event.target.value;
		setAadhars(values);
	}

	function handleGender(i, event) {
		const values = [...genders];
		values[i].value = event.target.value;
		setGenders(values);
	}

	function handleTicketCount(event) {
		var values = tcount1;
		values = event.target.value;
		//const values = event.target.value;
		setTcount(values);
		//setTotalPrice(parseInt(unitPrice) * values);
		//console.log('unit ', unitPrice);
		//console.log('unit parse ', parseInt(unitPrice));
		//console.log('tcount ', values[i].value);
		//console.log(unitPrice * values);
		setTotalPrice(parseInt(unitPrice) * values);
		console.log('TEST TCOUNT ', tcount1);
		console.log('TEST TOTALPRICE ', totalPrice);
	}

	
	/*
	function handleAdd() {
		const conts = [...ccodes];
		const values = [...fields];
		const lives = [...ages];
		const texts = [...names];
		const verifiers = [...aadhars];
		const sexes = [...genders];
		if (texts.length < 5) {
			setTotalPrice(parseInt(unitPrice) * (texts.length + 1));
			conts.push({value:null})
			values.push({ value: null });
			lives.push({ value: null });
			texts.push({ value: null });
			verifiers.push({ value: null });
			sexes.push({ value: "male" });
			setCCodes(conts)
			setFields(values);
			setNames(texts);
			setAges(lives);
			setAadhars(verifiers);
			setGenders(sexes);
			setActive("active");
			setPrev("");
			setGlobalIndex(texts.length + 1);
			setCurIdx(texts.length - 1);
		}
		else {
			Swal.fire({
				imageUrl: logoFull,
				imageWidth: "150px",
				title: 'Error',
				text: 'Maximum 5 tickets allowed per ride.',
				confirmButtonText: 'OK',
				heightAuto: false
			});
		}
	}
	*/

	/*
	function handleRemove(i) {
		const conts = [...ccodes];
		const values = [...fields];
		const lives = [...ages];
		const texts = [...names];
		const verifiers = [...aadhars];
		const sexes = [...genders];
		if (texts.length > 1) {
			setTotalPrice(parseInt(unitPrice) * (texts.length - 1));
			conts.splice(i, 1);
			values.splice(i, 1);
			lives.splice(i, 1);
			texts.splice(i, 1);
			verifiers.splice(i, 1);
			sexes.splice(i, 1);
			setCCodes(conts);
			setFields(values);
			setNames(texts);
			setAges(lives);
			setAadhars(verifiers);
			setGenders(sexes);
			setCurIdx(texts.length - 1);
			setActive("active");
			setPrev("");
		}
		else {
			setCurIdx(texts.length - 1);
			setGlobalIndex(texts.length - 1);
			setPrev("active");
		}
	}
	*/

	const resendOtp = async () => {
		//sutha code start
		//setOTPFetched(true)
		
		const url = config.backendUrl + "/auth/send-sms";
		const response = await postRequest(url, { phone: "+"+ccodes[0].value+fields[0].value }).catch((err) => {
			Swal.fire({
				imageUrl: logoFull,
				imageWidth: "150px",
				title: 'Error',
				text: 'Error while sending OTP',
				confirmButtonText: 'OK',
				heightAuto: false
			});
			return
		})
		if (response.status === 200) {
			alert("re-sent otp")
			setOTPFetched(true)
		}
		
		//sutha code end
	}

	const handleSubmit = async e => {
		e.preventDefault();
		if (!aadhars[0].value) {
			alert("Enter aadhar for rider 1")
			return
		}
		if (!fields[0].value) {
			alert("Enter aadhar for rider 1")
			return
		}
		const { checkAadhar: check } = await makeRequest(CHECK_AADHAR, { aadhar: aadhars[0].value })
		const { checkPhone: checkPhone } = await makeRequest(CHECK_PHONE, { phone: "+"+fields[0].value })
		const url1 = config.backendUrl + "/auth/send-sms";
		console.log('url1 ', url1);
		if ((check === false) && (checkPhone === false)) {
			//if ((check === false) && (checkPhone === true)) {
			console.log("ERROR ON SEND-SMs");
			const { getRides: rideCapacityCheck } = await makeRequest(SEARCH_RIDES, { withBooked: true, byRideId: [rideId] })
			if (rideCapacityCheck[0].totalBooked + names.length > rideCapacityCheck[0].capacity) {
				alert("Capacity will be exceeded!")
				return
			}
			// displayRazorpay();
			// getOTP
			// bookTicket("transactionId")

			//sutha code start
			//setOTPFetched(true)
			console.log("INSIDE SEMD-SMS CALLING");
			const url = config.backendUrl + "/auth/send-sms";
			console.log(url);
			console.log('SEND-SMS ');
			const response = await postRequest(url, { phone: "+"+ccodes[0].value+fields[0].value }).catch((err) => {
				Swal.fire({
					imageUrl: logoFull,
					imageWidth: "150px",
					title: 'Error',
					text: 'Error while sending OTP',
					confirmButtonText: 'OK',
					heightAuto: false
				});
				return
			})
			if (response.status === 200) {
				setOTPFetched(true)
			}
			
			//sutha code end
		}
		else {
			if (check === true) {
				alert("One aadhar can only book one ride per month!")
			} else {
				alert("One phone can only book one ride per month!")
			}
		}
	}

	async function bookTicket(transactionId) {
		open = true;
		console.log('booking process starts step2');
		var tcount = parseInt(tcount1);
		var riders = [];
		for (var i = 0; i < names.length; i++) {
			var details = {};
			details.fullName = names[i].value;
			details.age = parseInt(ages[i].value);
			details.phone = "+"+fields[i].value;
			details.aadhar = aadhars[i].value;
			details.gender = genders[i].value;
			//details.tcount = tcount[i].value;
			riders.push(details);
		}
		//var tcount = parseInt(tcount);
		//setTcount(parseInt(tcount));
		const variables = {
			rideId,
			riders,
			tcount,
			transactionId
		}
		console.log('VARIABLES ', variables);
		const result = await makeRequest(CREATE_BOOKING, variables).catch((err) => {
			console.log('ERR ', err);
			if (err.message === "Capacity full !")
			//open = false;
				Swal.fire({
					imageUrl: logoFull,
					imageWidth: "150px",
					imageHeight: "50px",
					title: 'Booking will exceed capacity.',
					confirmButtonText: 'Okay',
					heightAuto: false
				});
				//open = false;
		});
		if (result) {
			//open = false;
			console.log('booking success step3');
			console.log('RES ', result);
			Swal.fire({
				imageUrl: logoFull,
				imageWidth: "150px",
				title: 'Success',
				text: 'Your ride has been booked!',
				confirmButtonText: 'OK',
				heightAuto: false
			}).then(() => {
				history.push('/bookinghistory');
			});
		}

	}
	console.log({ curIdx, otpFetched, aa: aadhars[curIdx].value, gender: genders[curIdx].value, age: ages[curIdx].value, name: names[curIdx].value, tcount: parseInt(tcount1), total: parseInt(totalPrice)})
	const bookingCards = (
		<div>
			<div className="form-group">
				<label>
					<i className="fas fa-user" />
			&nbsp; Full Name
			<input
						type="text"
						placeholder="Enter rider Full Name"
						className='form-control mt-2'
						style={{ padding: 15, borderRadius: 10, width: 400 }}
						onChange={e => handleFullname(curIdx, e)}
						value={names[curIdx].value ? names[curIdx].value : ''}
						required
					/>
				</label>
			</div>

			<div className="form-group">
				<label>
					<i className="fab fa-pagelines" />
			&nbsp; Age
			<input
						type="number"
						placeholder="Enter rider Age"
						className='form-control mt-2'
						style={{ padding: 15, borderRadius: 10, width: 400 }}
						onChange={e => handleAge(curIdx, e)}
						value={ages[curIdx].value ? ages[curIdx].value : ''}
						required
					/>
				</label>
			</div>

			<div className="form-group">
				<label>
					<i className="fa fa-male" />
			&nbsp; Gender
			<select
						onChange={e => handleGender(curIdx, e)}
						className='form-control mt-2'
						value={genders[curIdx].value ? genders[curIdx].value : "male"}
						style={{ borderRadius: 10, width: 400 }}>
						<option value="male">Male</option>
						<option value="female">Female</option>
						<option value="other">Other</option>
					</select>
				</label>
			</div>

			<div className="form-group">
				<label>
					<i className="fas fa-id-card" />
			&nbsp; Aadhar / Passport Number
			<input
						type="text"
						placeholder="Enter rider Aadhar / Passport Number"
						className='form-control mt-2'
						onChange={e => handleAadhar(curIdx, e)}
						value={aadhars[curIdx].value ? aadhars[curIdx].value : ''}
						style={{ padding: 15, borderRadius: 10, width: 400 }}
						required={curIdx === 0}
					/>
				</label>
				<div className="">
					<small className="form-text text-muted mb-2 ml-1">
						This will be verefied before entering inside the ferry.
              </small>
				</div>
			</div>

			<div className="form-group">
				<label>
					<i className="fab fa-pagelines" />
			&nbsp; No of Tickets
			<input
						type="number"
						placeholder="Enter no of tickets"
						className='form-control mt-2'
						style={{ padding: 15, borderRadius: 10, width: 400 }}
						onChange={e => handleTicketCount(e)}
						value={tcount1 ? tcount1 : ''}
						required
					/>
				</label>
			</div>

			<div className="form-group">
				<label>
					<i className="fas fa-phone" />
			&nbsp; Phone Number
			<div className="d-flex">
				<input
					type="text"
					placeholder="Enter Phone Country Code"
					className='form-control mt-2'
					style={{ padding: 15, borderRadius: 10, width: 70 }}
					onChange={e => handleCCode(curIdx, e)}
					value={"+"+(ccodes[curIdx].value ? ccodes[curIdx].value : '')}
					required={curIdx === 0}
				/>
				<input
					type="text"
					placeholder="Enter rider Phone Number"
					className='form-control mt-2'
					style={{ padding: 15, borderRadius: 10, width: 400 }}
					onChange={e => handlePhone(curIdx, e)}
					value={fields[curIdx].value ? fields[curIdx].value : ''}
				/>
			</div>
				</label>
					<small className="form-text text-muted mb-2 ml-1">
						eg +919999999999
              </small>
			</div>


			{otpFetched ? <div className="form-group">
				<label>
					<i className="fas fa-key" />
			&nbsp; OTP
			<input
						type="text"
						placeholder="Enter OTP"
						className='form-control mt-2'
						style={{ padding: 15, borderRadius: 10, width: 400 }}
						onChange={e => setOTP(e.target.value)}
					// value={fields[curIdx].value ? fields[curIdx].value : ''}
					// pattern="\d{10}"
					/>
				</label>
					<small className="form-text text-muted mb-2 ml-1">
						OTP send to {"+"+ccodes[0].value+fields[0].value}
              		</small>
              		<button 
              		  className="btn btn-primary"
              		  onClick={() => {resendOtp()}}
              		 >
              			Resend OTP
              		</button>
					  
			</div> : null}

			{/*
			<button
				type="button"
				onClick={() => { handleRemove(curIdx); }}
				className='btn btn-block btn-danger'
				style={{ padding: 10, borderRadius: 10, width: 200, marginLeft: 100 }}
			>
				Delete rider
			</button>
		*/}
			<br />
		</div>
	);

	let verifyOtp = async (e) => {
		e.preventDefault()
		const url = config.backendUrl + "/auth/verify-otp";

		const response = await postRequest(url, { phone: '+'+ccodes[0].value+fields[0].value, otp }).catch((err) => {
			console.log(err)
			Swal.fire({
				imageUrl: logoFull,
				imageWidth: "150px",
				title: 'Error',
				text: 'Error while verifying',
				confirmButtonText: 'OK',
				heightAuto: false
			});
			return
		})
		if (response?.status === 200) {
			if (response.data === "otp matched") {
				displayRazorpay()
			} else {
				Swal.fire({
					imageUrl: logoFull,
					imageWidth: "150px",
					title: 'Error',
					text: 'Incorrect OTP',
					confirmButtonText: 'OK',
					heightAuto: false
				});
			}
		}
	}


	return (
		<div className="container bg-light mt-5 p-3 px-4 rounded-lg">
			
			<h1 className="mb-4"> Book your ride </h1>
			<div className="card-group">
				<div className="card">
					<div className="card-body">
						<h5 className="card-title">Book {props.rideName}</h5>
						<ul className="nav nav-tabs mb-2" role="tablist">
							{
								names.map((_, ix) => {
									return (
										<li className="nav-item">
											{ ix === 0 || ix < names.length - 1 ? (
												<a className={`nav-link ${prev}`} data-toggle="tab" role="tab" onClick={() => setCurIdx(ix)}>{ix === 0 ? `Primary Rider` : `Rider ${ix + 1}`}</a>
											) : (
													<a className={`nav-link ${active}`} data-toggle="tab" role="tab" onClick={() => setCurIdx(ix)}>{ix === 0 ? `Primary Rider` : `Rider ${ix + 1}`}</a>
												)}
										</li>
									)
								})
							}
						</ul>
						
						<form onSubmit={otpFetched ? verifyOtp : handleSubmit}>
							{bookingCards}
						{/*}
							<div className="d-flex justify-content-center align-items-center">
								<div>
									<button
										type="button"
										className='btn btn-block btn-primary'
										style={{ padding: 10, borderRadius: 10, width: 200 }}
										onClick={() => handleAdd()}>
										Add Rider
								</button>
								</div>
							</div>
						*/}
							<br />
							{!otpFetched ? <button
								type='submit'
								className='btn btn-block btn-primary'
								style={{ padding: 10, borderRadius: 10 }}
							>
								Pay
						</button> : ""}
						{otpFetched ?
							<button
								type="submit"
								className='btn btn-block btn-primary'
								style={{ padding: 10, borderRadius: 10 }}
							>
								Pay
						</button> : ""}
						</form>
						
					</div>
				</div>
			</div>
			<Backdrop
        			className={classes.backdrop}
        			open={open}
      			>
        			<CircularProgress color="inherit" />
					Do not press any button, We are generating your ticket.
      			</Backdrop>
		</div>
	)

	
}

export default withClient(Booking);