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
import Doc from './DocService';
import PdfContainer from './PdfContainer';


import $ from 'jquery';

const GenerateTicket = ({makeRequest, ...props}) => {

	const YMDHMS = (datetime) => {
	  const pad2 = (n) => n < 10 ? '0' + n : n 
	  var date = new Date(datetime);
	  return `${pad2(date.getDate())}/${pad2(date.getMonth()+1)}/${date.getFullYear()} ${pad2(date.getHours())}:${pad2(date.getMinutes())}:${pad2(date.getSeconds())}`
	}

	const [bookings, setBookings] = useState([]);
	const [featuredRides, setFeaturedRides] = useState([]);
	const [showRiders, setShowRiders] = useState(null);
	const [cookies, removeCookie] = useCookies();

	const [bookerId, setBookerId] = useState(cookies.user.id);
	const [bookingId, setBookingId] = useState(props.id);
	const [rideName, setRideName ] = useState(props.rideName)
	const [bookerName, setBookerName ] = useState(props.bookerName)
	const [schoolName, setSchoolName ] = useState(props.schoolName)
	const [schoolDistrict, setSchoolDistrict ] = useState(props.schoolDistrict)
	const [riderCount, setRiderCount ] = useState(props.riderCount)
	const [aadhar, setAadhar ] = useState(props.aadhar)
	const [status, setStatus ] = useState(props.status)

	const [transactionId, setTransactionId] = useState(props.transactionId);
	const [timestamp, setTimestamp] = useState(props.timestamp);
	const [startTime, setStartTime] = useState();
	const [endTime, setEndTime] = useState("");
	const [date, setDate] = useState("");
	const [location, setLocation] = useState("");
	const [totalPrice, setTotalPrice] = useState(0);
	const [netCharges, setNetCharges] = useState(0);
	const [rideType,setRideType] = useState("")

	const ref = React.createRef();

	const options = {
		orientation: 'landscape'
	};


	useEffect(()=>{
		makeRequest(SEARCH_RIDES).then((res) => {
			for(var i=0;i<res.getRides.length;i++){
				if(res.getRides[i].id===props.rideId){
					setStartTime(YMDHMS(res.getRides[i].startTime).substring(11, 16));
					setEndTime(YMDHMS(res.getRides[i].endTime).substring(11, 16));
					setDate(YMDHMS(res.getRides[i].startTime).substring(0, 10));
					setLocation(res.getRides[i].location);
					setRideType(res.getRides[i].rideType);
					setTotalPrice((parseInt(res.getRides[i].price)*props.riderCount)+(parseInt(res.getRides[i].price)*props.riderCount*0.025));
					setNetCharges((parseInt(res.getRides[i].price)*props.riderCount*0.025))
				}
			}
		})
	}, [])

	const createPdf = (html) => Doc.createPdf(html);
	
	return (
		<div className="container bg-light mt-5 p-3 px-4 rounded-lg">
			<h1 className="mb-4"> Your Ticket </h1>
			<PdfContainer createPdf={createPdf}>
			<div className="card-group">
				<div className="card">
					<div className="card-body" ref={ref}>
						<div className="d-flex">
							<div>
								<h4 className="card-title"><b>E-Ticket</b></h4>
								<h6>Booking ID: <b>{bookingId}</b></h6>
								<h6>Booked on: <b>{YMDHMS(timestamp)}</b></h6>
								
							</div>
							<div className="ml-auto">
								<img src={logo} alt="logo" style={{height: 100, width: 100}}></img>
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
						<hr style={{color: '#007bff', backgroundColor: '#007bff', height: .5, borderColor : '#007bff'}}></hr>
						<div className="d-flex">
							<div>
								<h6 className="card-title">Start Time: <b>{startTime}</b></h6>
								<h5 className="card-title"><b>{date}</b></h5>
							</div>
							<div className="ml-auto">
								<img src={poom} alt="logo" style={{height: 40}}></img>
							</div>
							<div className="ml-auto">
								<h6>End Time: <b>{endTime}</b></h6>
								<h5 className="card-title"><b>{date}</b></h5>
							</div>
						</div>
						<hr style={{color: '#6c757d', backgroundColor: '#6c757d', height: .3, borderColor : '#6c757d'}}></hr>
						<div className="d-flex justify-content-center align-items-center">
							<h2>Booking Information </h2>
						</div>
						<div className="d-flex">
							<div className="ml-auto">
								<h6> Booker Name: <b>{bookerName}</b></h6>
							</div>
							<div className="ml-auto">
								<h6>School Name : <b>{schoolName}</b></h6>
							</div>
							<div className="ml-auto">
								<h6>School District : <b>{schoolDistrict}</b></h6>
							</div>
							<div className="ml-auto">
								<h6> Booker Aadhar: <b>{aadhar}</b></h6>
							</div>
							<div className="ml-auto">
								<h6> Rider Count: <b>{riderCount}</b></h6>
							</div>
						</div>

						<br />
						<br />
						<div className="d-flex">
							<div>
								<h6 className="card-title" style={{color: "#6c757d"}}> Fare and Payment Details</h6>
							</div>
							<div className="ml-auto">
							</div>
						</div>
						<hr style={{color: '#6c757d', backgroundColor: '#6c757d', height: .3, borderColor : '#6c757d'}}></hr>
						<div className="d-flex">
							<div>
								<p className="card-title mb-1">Base Fare: <b>Rs. {totalPrice-netCharges}</b></p>
								<p className="card-title mb-1">Net Charges: <b>Rs. {netCharges}</b></p>
								<p className="card-title mb-1">Total Fare: <b>Rs. {totalPrice}</b></p>
								<p className="card-title mb-1">Transaction ID: <b>{transactionId}</b></p>
							</div>
							<div className="ml-auto">
							</div>
						</div>
						<br />

						<div className="d-flex">
							<div>
								<h6 className="card-title" style={{color: "#6c757d"}}>Cancellation Policy</h6>
							</div>
							<div className="ml-auto">
							</div>
						</div>

						<hr style={{color: '#6c757d', backgroundColor: '#6c757d', height: .3, borderColor : '#6c757d'}}></hr>
						<div className="d-flex">
							<div>
								<ol className="mb-3">
									<li>If cancelled the ticket, before 24 hrs of boarding time, 100% refund will be allowed, except admin and net charges.</li>
									<li>If cancelled between 12 to 24hrs, 75% refund will be allowed, except admin and net charges.</li>
									<li>If cancelled between 8 to 12hrs, 50% refund will be allowed, except admin and net charges.</li>
									<li>If cancelled between 4 to 8 hrs 25% refund will be allowed, except admin and net charges.</li>
									<li>If cancelled within 4 hrs No refund will be allowed.</li>
									<li>If service is cancelled due to bad weather or any other technical issues then the passenger will be requested to avail the next other available slots for the same day or in the next day. If the passengers not accept, full refund shall be done in online, except admin and net charges.</li>
								</ol>
							</div>
							<div className="ml-auto">
							</div>
						</div>
						
						<br />
						<br />

						<div className="d-flex">
							<div>
								<h6 className="card-title" style={{color: "#6c757d"}}>Tourist Places</h6>
							</div>
							<div className="ml-auto">
							</div>
						</div>

						<hr style={{color: '#6c757d', backgroundColor: '#6c757d', height: .3, borderColor : '#6c757d'}}></hr>
						<div className="d-flex">
							<div>
							<p>In and around to Kanyakumari</p>	
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
						<div className="d-flex">
							<div>
								<h6 className="card-title" style={{color: "#6c757d"}}>Conditions</h6>
							</div>
							<div className="ml-auto">
							</div>
						</div>
						<hr style={{color: '#6c757d', backgroundColor: '#6c757d', height: .3, borderColor : '#6c757d'}}></hr>
						<div className="d-flex">
							<div>
								<p>It is presumed that, by purchasing the ticket the guest is agreeing to the following conditions.</p>
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
							<div className="ml-auto">
							</div>
						</div>
					</div>
				</div>
			</div>
			</PdfContainer>
		</div>
	)
}

export default withClient(GenerateTicket);