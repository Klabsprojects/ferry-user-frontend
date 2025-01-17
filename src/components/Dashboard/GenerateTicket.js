import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import logoFull from '../../assets/img/logo-full.png';
import logo from '../../assets/img/ferry_app_icon.png'
import poom from '../../assets/img/poom.png'
import { Link } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import Pdf from "react-to-pdf";
import { SEARCH_RIDES } from '../../graphql/queries';
import { withClient } from '../../client';
import { YMDHMS } from '../../utils/datetime';
import Doc from './DocService';
import PdfContainer from './PdfContainer';
import moment from 'moment'
import "./generateTicket.css"
//import * as React from 'react';

import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';

import $ from 'jquery';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
	backdrop: {
		zIndex: theme.zIndex.drawer + 1,
		color: '#ffff',
	},
}))

const GenerateTicket = ({ makeRequest, ...props }) => {
	console.log('props ', props);

	const [bookings, setBookings] = useState([]);
	const [featuredRides, setFeaturedRides] = useState([]);
	const [showRiders, setShowRiders] = useState(null);
	const [cookies, removeCookie] = useCookies();

	const [bookerId, setBookerId] = useState(cookies.id);
	const [bookingId, setBookingId] = useState(props.bookingId);
	const [rideName, setRideName] = useState(props.rideName);
	const [transactionId, setTransactionId] = useState(props.transactionId);
	const [timestamp, setTimestamp] = useState(props.timestamp);
	const [status, setStatus] = useState(props.status);
	const [riders, setRiders] = useState(props.riders);
	const [tcount, setTcount] = useState(props.tcount);
	const [startTime, setStartTime] = useState();
	const [endTime, setEndTime] = useState("");
	const [date, setDate] = useState("");
	const [location, setLocation] = useState("");
	const [totalPrice, setTotalPrice] = useState(0);
	const [actualPrice, setActualPrice] = useState(0);
	const [igst, setIgst] = useState(0);
	const [sgst, setSgst] = useState(0);
	const [ttdc, setTtdc] = useState(0);
	const [netCharges, setNetCharges] = useState(0);
	const [rideType, setRideType] = useState("");
	const [ridePrice, setRidePrice] = useState(0);

	const ref = React.createRef();

	const options = {
		orientation: 'landscape'
	};



	const classes=useStyles();
	useEffect(() => {
		makeRequest(SEARCH_RIDES, {byRideId : props.rideId}).then((res) => {
			console.log('RESPONSE of SEAERCH RIDES ', res);
			for (var i = 0; i < res.getRides.length; i++) {
				console.log('Rides list ', res.getRides);
				if (res.getRides[i].id === props.rideId) {
					setRidePrice(res.getRides[i].price);
					setStartTime(moment(res.getRides[i].startTime).format("hh:mm"));
					setEndTime(moment(res.getRides[i].endTime).format("hh:mm"));
					setDate(moment(res.getRides[i].startTime).format('DD/MM/YYYY'));
					setLocation(res.getRides[i].location);
					setRideType(res.getRides[i].rideType);
					setActualPrice(parseFloat(res.getRides[i].actualPrice).toFixed(2));
					setIgst(parseFloat(res.getRides[i].igst).toFixed(2));
					setSgst(parseFloat(res.getRides[i].sgst).toFixed(2));
					setTtdc(res.getRides[i].ttdc);
					setTotalPrice((parseInt(res.getRides[i].price) * tcount) + (parseInt(res.getRides[i].price) * tcount * 0.025));
					setNetCharges((parseInt(res.getRides[i].price) * tcount * 0.025));
					console.log('totalprice ', totalPrice);
					console.log('netcharge ', netCharges);
				}
			}
		})
	}, [])

	const createPdf = (html) => Doc.createPdf(html);

	const riderInfo = () => {
		if (riders.length === 0)
			return null
		const data = riders;
		return (
			data.map((rider, ix) => {
				return (	
					<div className="d-flex">
						<div>
							<h6 className="card-title"><b>{rider.fullName}</b> <br />Age & Gender:  <b>{rider.age} , {rider.gender.substring(0, 1).toUpperCase()}</b></h6>
						</div>
						<div className="ml-auto">
							<h6>Aadhar / Passport Number:  <b>{rider.aadhar}</b></h6>
						</div>
						<div className="ml-auto">
							<h6>Phone: {rider.phone === null ? (<b>N/A&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</b>) : (<b>+91 {rider.phone.substring(1, rider.phone.length)}</b>)}</h6>
						</div>
					</div>
				)
			})
		)
	}

	const riderCountFn = () => {
		return (
			<div className="ml-auto">
							<h6>Number of Persons:  <b>{tcount}</b></h6>
						</div>
		)
	}

	return (	
		<div className="container bg-light mt-5 p-3 px-4 rounded-lg">
			<h1 className="mb-4"> Your Ticket </h1>
			<PdfContainer createPdf={createPdf}>
				<div className="card-group">
					<div className="card">
						<div className="card-body" style={{ paddingBottom: 0 }} ref={ref}>
							<div className="d-flex">
								<div>
									<h4 className="card-title"><b>E-Ticket</b></h4>
									<h6>Booking ID: <b>{bookingId}</b></h6>
									<h6>Booked on: <b>{timestamp}</b></h6>

								</div>
								<div className="ml-auto">
									<img src={logo} alt="logo" style={{ height: 100, width: 100 }}></img>
								</div>
							</div>
							<br />
							<br />
							<div className="d-flex">
								<div>
									<h6 className="card-title"> Ride Name: <b>{rideName}</b></h6>
									<h6> Location: <b>KANNIYAKUMARI</b></h6>
								</div>
								<div className="ml-auto">
									<h6>Ride Type: <b>{rideType}</b></h6>
									<h6>Ride Status: <b>{status}</b></h6>
								</div>
							</div>
							<hr style={{ color: '#007bff', backgroundColor: '#007bff', height: .5, borderColor: '#007bff' }}></hr>
							<div className="d-flex">
								<div>
									<h6 className="card-title">Start Time: <b>{startTime}</b></h6>
									<h6 className="card-title"><b>{date}</b></h6>
								</div>
								<div className="ml-auto">
									<img src={poom} alt="logo" style={{ height: 30 }}></img>
								</div>
								<div className="ml-auto">
									<h6>End Time: <b>{endTime}</b></h6>
									<h6 className="card-title"><b>{date}</b></h6>
								</div>
							</div>
							<hr style={{ color: '#6c757d', backgroundColor: '#6c757d', height: .3, borderColor: '#6c757d' }}></hr>
							<div className="d-flex justify-content-center align-items-center">
								<h4> Tourist Information </h4>
							</div>
							<div className="d-flex">
						<div>
							<h6 className="card-title"><b>{riderCountFn()}</b></h6>
						</div>
						<div className="ml-auto">
							<h6>Ticket Fare:  <b>{ridePrice}/-</b></h6>
						</div>
						<div className="ml-auto">
							<h6></h6>
						</div>
					</div>
							<div className="d-flex">
								<div>
									<h6 className="card-title" style={{ color: "#6c757d" }}> Traveller Details</h6>
								</div>
								<div className="ml-auto">
								</div>
							</div>
							{riderInfo()}
							{/* <br /> */}
							<div className="d-flex mt-2">
								<div>
									<h6 className="card-title" style={{ color: "#6c757d" }}> Fare and Payment Details</h6>
								</div>
								<div className="ml-auto">
								</div>
							</div>

							<hr style={{ color: '#6c757d', backgroundColor: '#6c757d', height: .3, borderColor: '#6c757d' }}></hr>
							<div className="d-flex">
								<div>
									{/* <p className="card-title mb-1">Base Fare: <b>Rs. {actualPrice}/-</b></p>
									<p className="card-title mb-1">ISGST: <b>Rs. {igst}/-</b></p>
									<p className="card-title mb-1">SGST: <b>Rs.{sgst}/-</b></p>
									<p className="card-title mb-1">TTDC: <b>Rs.{ttdc}/-</b></p>
									<p className="card-title mb-1">Net Charges: <b>Rs. {netCharges}/-</b></p> */}
									<p className="card-title mb-1">Total Fare: <b>Rs. {totalPrice? totalPrice : <Backdrop
        							className={classes.backdrop}
        							open>
        							<CircularProgress color="inherit" />
      								</Backdrop>}/- </b></p>
									
									<p className="card-title mb-1">Transaction ID: <b>{transactionId}</b></p>
								</div>
								<div className="ml-auto">
								</div>
							</div>
							{/* <br /> */}
							<div className="row mt-2">
								<div className="col-6">
									<div className="d-flex">
										<div>
											<h6 className="card-title" style={{ color: "#6c757d" }}>Cancellation Policy</h6>
										</div>
										<div className="ml-auto">
										</div>
									</div>
									<hr style={{ color: '#6c757d', backgroundColor: '#6c757d', height: .3, borderColor: '#6c757d' }}></hr>
									<div className="d-flex">
										<div>
											<ol className="mb-3">
												<li>If the cancellation happened the day prior to the ride, Ticket charges will be refunded (excluding admin service charges) through online.</li>
												<li>No Refund if ticket cancellation on the same day of the ride</li>
											</ol>
										</div>
										<div className="ml-auto">
										</div>
									</div>
								</div>
								<div className='col-6'>
									<div className="d-flex">
										<div>
											<h6 className="card-title ml-3" style={{ color: "#6c757d" }}>Tourist Places</h6>
										</div>
										<div className="ml-auto">
										</div>
									</div>
									<hr style={{ color: '#6c757d', backgroundColor: '#6c757d', height: .3, borderColor: '#6c757d' }}></hr>
									<div className="d-flex">
										<div>
											<p className="ml-3" style={{ fontSize: 12, marginBottom: ".25rem" }}>In and around places to Kanyakumari</p>
											<ol className="mb-3">
												<li>Vivekananda Rock Memorial</li>
												<li>AyyanThiruvalluvar statue</li>
												<li>Sunrise & Sunset view point</li>
												<li>Devi Bagavathi Amman Temple</li>
												<li>Mahatma Gandhi Memorial</li>
												<li>Kamarajar Memorial</li>
												<li>Triveni Sangamam</li>
												<li>Vatta Fort</li>
												<li>Thanumalayan Temple - Susindrum</li>
												<li>Nagaraja Temple - Nagarcoil</li>
												<li>Ramayana Mandapam - Vivekanandapuram</li>
												<li>Our Lady of Ransom Church - Kanyakumari</li>
											</ol>
										</div>
										<div className="ml-auto">
										</div>
									</div>
								</div>
							</div>

						</div>

						{/* <br /> */}
						<>
							<div className='row mt-2'>

								<div className="col-12">
									<div className="d-flex">
										<div>
											<h6 className="card-title ml-3" style={{ color: "#6c757d" }}>Conditions</h6>
										</div>
										<div className="ml-auto">
										</div>
									</div>
									<hr style={{ color: '#6c757d', backgroundColor: '#6c757d', height: .3, borderColor: '#6c757d' }}></hr>
									<div className="d-flex">
										<div>
											<p className="ml-3" style={{ fontSize: 12, marginBottom: ".25rem" }}>It is presumed that, by purchasing the ticket the guest is agreeing to the following conditions.</p>
											<ol className="mb-3">
												<li>The ticket is Not Transferable.</li>
												<li>Please kindly note that special entry is only for upward journey and not for return, since it is not necessary. Kindly cooperate.</li>
												<li>Passengers are requested to adhere to safety procedures as advised by crews - Safety First. </li>
												<li>Kindly keep the ticket/id readily available for verification.</li>
												<li>The entry will be easy if you reach 2 hours before the time of boarding. Please kindly avoid last minute rush.  </li>
												<li>The original Aadhar id card to be shown at the time of entry for Indians, for foreigners original passport id to shown by the visitor.  </li>
												<li>If service is cancelled due to bad weather or any other technical issues then the passenger is requested to avail the next other available slots for the same day or in the next day. If requested, full refund will be done in online. </li>
												<li>Ferry service is subject to weather/wave/wind/tide conditions. </li>
												<li>Any legal disputes arises, that may be adjudicated by the Hon’ble court having jurisdiction in Chennai city limits only.</li>
											</ol>
										</div>
									</div>
								</div>
							</div>
						</>
					</div>
				</div>
			</PdfContainer>
		</div>
	)
}

export default withClient(GenerateTicket);