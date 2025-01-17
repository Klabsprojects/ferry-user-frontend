import React, { useState, useEffect } from 'react';
import { withClient } from '../../client';
import { GET_BOOKING_HISTORY } from '../../graphql/queries';
import { CANCEL_BOOKING,RESCHEDULE_BOOKING } from '../../graphql/mutations';
import { SEARCH_RIDES } from '../../graphql/queries';
import Swal from 'sweetalert2';
import logoFull from '../../assets/img/logo-full.png';
import { Link } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import moment from "moment"

import $ from 'jquery';
import Popup from '../layout/Popup';

import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
	backdrop: {
		zIndex: theme.zIndex.drawer + 1,
		color: '#ffff',
	},
}))

const BookingHistory = ({ makeRequest }) => {
	const [bookings, setBookings] = useState([]);
	const [featuredRides, setFeaturedRides] = useState([]);
	const [rides, setRides] = useState([]);
	const [bookedRides, setBookedRides] = useState([]);
	const [showRiders, setShowRiders] = useState(null);
	const [resched, setResched] = useState(null);
	const [cookies, removeCookie] = useCookies();
	const [bookerId, setBookerId] = useState(cookies.id);
	const [ticketCount, setTicketCount] = useState([]);
	//const [totalc, setTotalC] = useState(0);

	const [totalPrice, setTotalPrice] = useState(0);
	const YMDHMS = (datetime) => {
		const pad2 = (n) => n < 10 ? '0' + n : n
		var date = new Date(datetime);
		// date = date.to
		return `${pad2(date.getDate())}/${pad2(date.getMonth() + 1)}/${date.getFullYear()} ${pad2(date.getHours())}:${pad2(date.getMinutes())}:${pad2(date.getSeconds())}`
	}
	const classes = useStyles();
	let open = false;
	useEffect(() => {
		makeRequest(GET_BOOKING_HISTORY).then((data) => {
			let myData = [];
			for (var i = 0; i < data.getBookingHistory.length; i++) {
				if (data.getBookingHistory[i].bookerId === bookerId) {
					myData.push(data.getBookingHistory[i]);
				}
			}
			setBookings(myData)
			console.log('myData', myData);
			makeRequest(SEARCH_RIDES, { byRideId: myData.map(v => v.rideId).filter((v, i, a) => a.indexOf(v) === i) }).then(rides => {
				setBookedRides(rides.getRides)
			})
		})
		makeRequest(SEARCH_RIDES, { byRideType: ["General", "Special"] }).then((rides) => {
			setFeaturedRides(rides.getRides)
		})
	}, [])
	console.log('bookedRides ',bookedRides);
	const [startTimeEqualChoiceValue, setStartTimeEqualChoiceValue] = useState('')
	const resetFilters = () => {
		// setStartTimeEqualChoice(null)
		setStartTimeEqualChoiceValue('')
		submitSearch(true)
	}
	const handleStartTimeEqualChoiceValue = (value) => {
		const today = new Date(Date.now())
		if (value <= new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1, 0, 0, 0)) {
			window.alert("start time cannot be in the past")
			return
		}
		setStartTimeEqualChoiceValue(value)
	}
	const initiateLoader = async () => {
		if(open == false){
			//setOpen(true);
			open = true;
		}
	}
	const stopLoader = async () => {
		if(open == true){
			//setOpen(true);
			open = false;
		}
	}
	const submitSearch = async (clear) => {

		// setRides(null)


		if (!startTimeEqualChoiceValue||clear) {

			const response = await makeRequest(SEARCH_RIDES,{ byStartTimeGreaterEqual: Date.now(), withBooked: true })

			setRides(response.getRides)
			return
		}

		const date = new Date(startTimeEqualChoiceValue)
		const start = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0)
		const end = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1, 0, 0, 0)

		const startTimeVariables = {
			byStartTimeLesser: startTimeEqualChoiceValue ? end : null,
			byStartTimeGreaterEqual: startTimeEqualChoiceValue ? start : null
		}

		const variables = {
			...startTimeVariables,
		}

		const response = await makeRequest(SEARCH_RIDES, variables)

		setRides(response.getRides)
	}

	useEffect(() => {
		submitSearch()
	}, [])



	let cancelMyBooking = async (page) => {
		let withinSameDay = false;
		// if(!moment().isBefore(moment(bookedRides?.find(v => (v?.id === page?.rideId))?.startTime).subtract("24", "hours"))){
		if(moment().isSame(moment(bookedRides?.find(v => (v?.id === page?.rideId))?.startTime),"day")){
			if (!window.confirm("Cancelling a booking which is on the same day, no refund will be made."))
				 return
			else
				withinSameDay = true
		}
		Swal.fire({
			imageUrl: logoFull,
			imageWidth: "150px",
			imageHeight: "50px",
			title: 'Are you sure to cancel and agree to our terms?',
			confirmButtonText: 'Yes',
			cancelButtonText: 'No',
			showCancelButton: true,
			heightAuto: false
		}).then(
			async function (data) {
				if (data.value) {
					let response = await makeRequest(CANCEL_BOOKING, { bookingIds: [page.id], transactionId: page.transactionId, withinSameDay }).catch((err) => {
						Swal.fire({
							imageUrl: logoFull,
							imageWidth: "150px",
							imageHeight: "50px",
							title: 'Could not cancel booking !',
							confirmButtonText: 'Take me there',
							heightAuto: false
						})
					})
					if (response === "booking not found") return

					if (!response)
						return

					Swal.fire({
						imageUrl: logoFull,
						imageWidth: "150px",
						imageHeight: "50px",
						title: 'Cancelled booking and processed payment.',
						confirmButtonText: 'Take me there',
						heightAuto: false
					})
					await makeRequest(GET_BOOKING_HISTORY).then((data) => {
						let myData = [];
						for (var i = 0; i < data.getBookingHistory.length; i++) {
							if (data.getBookingHistory[i].bookerId === bookerId) {
								myData.push(data.getBookingHistory[i]);
							}
						}
						setBookings(myData)
					})
				}
			},
			function () {
				return false;
			}
		)
	}
	let rescheduleMyBooking = async (page,rideId) => {
		// Swal.fire({
		// 	imageUrl: logoFull,
		// 	imageWidth: "150px",
		// 	imageHeight: "50px",
		// 	title: 'Are you sure to cancel and agree to our terms?',
		// 	confirmButtonText: 'Yes',
		// 	cancelButtonText: 'No',
		// 	showCancelButton: true,
		// 	heightAuto: false
		// }).then(
			// async function (data) {
				// if (data.value) {
					let response = await makeRequest(RESCHEDULE_BOOKING, { bookingId: page.id, prevRideId:page.rideId,rideId }).catch((err) => {
						Swal.fire({
							imageUrl: logoFull,
							imageWidth: "150px",
							imageHeight: "50px",
							title: 'Could not reschedule booking !',
							confirmButtonText: 'Take me there',
							heightAuto: false
						})
					})
					if (response === "booking not found") {
						setResched(false)
						return
					}

					if (!response){
						setResched(false)
						return
					}

					Swal.fire({
						imageUrl: logoFull,
						imageWidth: "150px",
						imageHeight: "50px",
						title: 'Successfully rescheduled.',
						confirmButtonText: 'Take me there',
						heightAuto: false
					})
					await makeRequest(GET_BOOKING_HISTORY).then((data) => {
						let myData = [];
						for (var i = 0; i < data.getBookingHistory.length; i++) {
							if (data.getBookingHistory[i].bookerId === bookerId) {
								myData.push(data.getBookingHistory[i]);
							}
						}
						setBookings(myData)
					})
					setResched(false)
				// }
			// }
		// 	function () {
		// 		return false;
		// 	}
		// )
	}

	useEffect(() => {
		$('#modal').on('hidden.bs.modal', () => {
			setShowRiders(null)
		})
	}, [])

	const showModal = (idx, tc) => {
		setShowRiders(idx)
		setTicketCount(ticketCount);
		$('#modal').modal('show')
	}


	const riderInfo = () => {
		if (bookings.length === 0 || showRiders === null)
			return null
		const riders = bookings[showRiders]
		const riderCount= riders.riders.length;
		return (
			<div className="overflow-y-scroll" style={{ height: '25vh' }}>
				{riders.riders.map((rider, ix) => {
					if(ticketCount[ix] != null)
					return (
						<div className="card mb-3">
							<div className="card-body">
								<h5>Full Name: {rider.fullName}</h5>
								<h5>Aadhar / Passport No: {rider.aadhar}</h5>
								<h5>{rider.phone ? `Phone : ${rider.phone}` : null}</h5>
								<h5>Total Number of Passengers : {ticketCount[ix]}</h5>
							</div>
						</div>
					)
					else
					return (
						<div className="card mb-3">
							<div className="card-body">
								<h5>Full Name: {rider.fullName}</h5>
								<h5>Aadhar / Passport No: {rider.aadhar}</h5>
								<h5>{rider.phone ? `Phone : ${rider.phone}` : null}</h5>
								<h5>Total Number of Passengers : {riderCount}</h5>
							</div>
						</div>
					)
				})}
			</div>
		)
	}

	var bookingsTable = [];
	for (var i = 0; i < bookings.length; i++) {
		var theDate = new Date(bookings[i].timestamp);
		console.log(bookings[i].startTime)
		const today = new Date(Date.now())
		console.log(new Date(today.getDate()));
		//var format = today.replace("dd", day.toString().padStart(2,"0"));
		function dateFormat(inputDate, format) {
			//parse the input date
			const date = new Date(inputDate);
		
			//extract the parts of the date
			const day = date.getDate();
			const month = date.getMonth() + 1;
			const year = date.getFullYear();    
		
			//replace the month
			format = format.replace("MM", month.toString().padStart(2,"0"));        
		
			//replace the year
			if (format.indexOf("yyyy") > -1) {
				format = format.replace("yyyy", year.toString());
			} else if (format.indexOf("yy") > -1) {
				format = format.replace("yy", year.toString().substr(2,2));
			}
		
			//replace the day
			format = format.replace("dd", day.toString().padStart(2,"0"));
		
			return format;
		}
		
		console.log('Converted date: '+ dateFormat(bookings[i].startTime, 'MM-dd-yyyy'));
		console.log('Converted date: '+ dateFormat(today, 'MM-dd-yyyy'));
		console.log('STSTUS => ', bookings[i].status);
		if (dateFormat(bookings[i].startTime, 'MM-dd-yyyy') < dateFormat(today, 'MM-dd-yyyy')) {
			//window.alert("old booking-> data fetch success");
			console.log(dateFormat(bookings[i].startTime, 'MM-dd-yyyy'));
			console.log(dateFormat(today, 'MM-dd-yyyy'));
			var dateString = theDate.toLocaleString("en-IN");

		for (var j = 0; j < featuredRides.length; j++) {
			if (featuredRides[j].id === bookings[i].rideId) {
				bookings[i].rideName = featuredRides[j].name;
				bookings[i].showStamp = dateString;
				bookings[i].status = "Completed";
			}
		}
		bookingsTable.push(bookings[i]);
		//if(bookingsTable.length > 0) setLoaderFnLoad();
		//else setLoaderFn();
		console.log('bookingsTable =====> ', bookingsTable);
		}
		else{
			//window.alert("new booking-> data fetch success");
			
		}
		
	}
	var tableArray = [];
	console.log('LEN-bookings ', bookingsTable.length);
	console.log('bookingsTable ', bookingsTable);
	console.log('LEN-rides ', bookedRides.length);
	console.log('bookedRides ', bookedRides);
		
	const showBookingsTable = bookingsTable.map((page, idx) => {
		initiateLoader();
		console.log('HISTORY LIST ', page);
			bookedRides.map((ridesInput, index) => {
				if(page.rideId == ridesInput.id){
					stopLoader();
					console.log('Matched rideId ', page.rideId);
					let ticketCountVar = 0;
					if(page.tcount != null){
						ticketCountVar = page.tcount;
					}else
					{
						ticketCountVar = page.riders.length;
					}
					var TotalPrice1 = (parseInt(ridesInput.price) * ticketCountVar) + (parseInt(ridesInput.price) * ticketCountVar * 0.025);
					//setTotalPrice1((parseInt(ridesInput.price) * ticketCountVar) + (parseInt(ridesInput.price) * ticketCountVar * 0.025));
					tableArray.push(<tr key={idx}>
							<td className="px-md-2 numeric text-center">
								{' '}
								{idx + 1}
							</td>
							<td className="px-md-2 numeric text-center">
								{' '}
								{page.status === "inactive" ? "" : <div className="btn btn-primary">
									<Link
										to={{
											pathname: "/ticket",
											state: { rideName: page.rideName, rideId: page.rideId, transactionId: page.transactionId, timestamp: page.showStamp, status: page.status, riders: bookings[idx].riders, bookingId: bookings[idx].id, tcount: ticketCountVar }
										}}
										className="text-light"
									>
										View Ticket
								</Link>
								</div>}
			
							</td>
							<td className="px-md-2 numeric text-center">
								{' '}
								{page.transactionId}
								
							</td>
							
							<td className="px-md-2 numeric text-center">
								{' '}
								{ridesInput.name}
								
							</td>
							
							<td className="px-md-2 numeric text-center">
								{' '}
								{TotalPrice1}
								
							</td>

							<td className="px-md-2 numeric text-center">
								{' '}
								{YMDHMS(ridesInput.startTime).substring(0, 10)}<br></br>
								{YMDHMS(ridesInput.startTime).substring(11, 16)}
							</td>
							<td className="px-md-2 numeric text-center">
								{' '}
								{page.status}
							</td>
						
							<td className="px-md-2 numeric text-center">
								<button
									className="btn btn-secondary"
									onClick={() => {
										showModal(idx, ticketCountVar)
									}}
								>
									View Rider
								</button>
							</td>
							
							
							</tr>);
						
				}
				/*else{
					if(bookingsTable.length != 0 && bookedRides.length != 0){
						if(idx == bookingsTable.length-1 && index == bookedRides.length-1){
							console.log('No data found - no array length 0');
							//setLoaderFn();
						}
					}
					else if(bookingsTable.length != 0 && bookedRides.length == 0){
						if(idx == bookingsTable.length-1){
							console.log('No data found - bookedRides length 0');
							//setLoaderFn();
						}
					}
					else if(bookingsTable.length == 0 && bookedRides.length != 0){
						if(index == bookedRides.length-1){
							console.log('No data found - bookingsTable length 0');
							//setLoaderFn();
						}
					}
					else if(bookingsTable.length == 0 && bookedRides.length == 0){
						console.log('No data found - bookedRides, bookingsTable length 0');
						//setLoaderFn();
					}
				}*/
						})
						if(bookingsTable.length -1  == idx) return tableArray;
						
	})
	return (
		<div className="container bg-light mt-5 p-3 px-4 rounded-lg">
			{resched?
			<Popup 
			rides={rides
				.filter(v=>{
					console.log(v.rideType,resched)
					return(v.rideType==resched.rideType)})
			}
			resetFilters={resetFilters}
			submitSearch={submitSearch}
			onSubmit={(rideId)=>{
				rescheduleMyBooking(resched,rideId)
			}}
			startTimeEqualChoiceValue={startTimeEqualChoiceValue}
			handleStartTimeEqualChoiceValue={handleStartTimeEqualChoiceValue}
			onCancel={()=>setResched(false)}
			/>
			:null}
			<div className="modal fade" id="modal" role="dialog">
				<div className="modal-dialog modal-dialog-centered" role="document">
					<div className="modal-content">
						<div className="modal-header">
							<h5 className="modal-title">Riders</h5>
							<button type="button" className="close" data-dismiss="modal">
								<span className="fa fa-times"></span>
							</button>
						</div>
						<div className="modal-body">
							{riderInfo()}
						</div>
					</div>
				</div>
			</div>
				<h2 className="">Booking History</h2>
				<hr className="my-3" />
				<br />
			<div id="no-more-tables">
				<table className="col-md-12 table-bordered table-striped table-condensed cf">
					<thead className="cf">
						<tr>
							<th className="text-center px-md-4 bgcolor">#</th>
							<th className="text-center px-md-5 bgcolor">Show Ticket</th>
							<th className="text-center px-md-5 bgcolor">Transaction ID</th>
							<th className="text-center px-md-5 bgcolor">Ride Name</th>
							<th className="text-center px-md-4 bgcolor">Total Ticket Fare</th>
							<th className="text-center px-md-5 bgcolor">Time</th>
							<th className="text-center px-md-5 bgcolor">Status</th>
							<th className="text-center px-md-5 bgcolor">Show Riders</th>
							{/* <th className="text-center px-md-5">Cancel Ride</th> */}
						</tr>
					</thead>
					<tbody>{showBookingsTable}</tbody>
					
				</table>
      			<Backdrop
        			className={classes.backdrop}
        			open={open}
      			>
        			<CircularProgress color="inherit" />
      			</Backdrop>
			</div>
		</div>
	)
}

export default withClient(BookingHistory);