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

import classNames from 'classnames';


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
	const YMDHMS = (datetime) => {
		const pad2 = (n) => n < 10 ? '0' + n : n
		var date = new Date(datetime);
		// date = date.to
		return `${pad2(date.getDate())}/${pad2(date.getMonth() + 1)}/${date.getFullYear()} ${pad2(date.getHours())}:${pad2(date.getMinutes())}:${pad2(date.getSeconds())}`
	}
	const classes = useStyles();
	
	const [collapsed,setCollapsed] = useState(false);

	var titleClass = classNames({
		'mb-4': true,
		'title-class': collapsed,
	  });

	var tdClass = classNames({
		'px-md-2': true,
		'numeric': true,
		'text-center': true,
		'table-font': collapsed,
	  });

	  var headerClassnames  = classNames({
		'px-md-5': true,
		'bgcolor': true,
		'text-center': true,
		'table-head': collapsed,
	  });

	  var tableClassnames = classNames({
		'col-md-12': true,
		'table-bordered': true,
		'table-striped': true,
		'table-condensed': true,
		'cf': true,
		'table-class': collapsed,
	  });

	  var btnClasses = classNames({
		'text-light': true,
		'btn-title': collapsed,
	  });

  	//const [open, setOpen] = React.useState(true);
	let open = true;
	useEffect(() => {
		open = true;
		console.log('onload');
		//initiateLoader();
		makeRequest(GET_BOOKING_HISTORY).then((data) => {

			
			let myData = [];
			for (var i = 0; i < data.getBookingHistory.length; i++) {
				if (data.getBookingHistory[i].bookerId === bookerId) {
					myData.push(data.getBookingHistory[i]);
				}
			}
			setBookings(myData)
			console.log('booking data ', myData);
			for (const data of myData) {
				console.log('booking data arr ',data);
				if(data.tcount){
					console.log('page count available');
					}else{
					console.log('page count not availabe');
					}
			  }
			
			makeRequest(SEARCH_RIDES, { byRideId: myData.map(v => v.rideId).filter((v, i, a) => a.indexOf(v) === i) }).then(rides => {
				console.log('GET RIDES ', rides.getRides);
				setBookedRides(rides.getRides)
			})
		})
		makeRequest(SEARCH_RIDES, { byRideType: ["General", "Special"] }).then((rides) => {
			setFeaturedRides(rides.getRides)
		})
	}, [])
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
		console.log('initiateloaded intiated');
		//if(open == false){
			//setOpen(true);
			open = true;
		//}
	}
	const stopLoader = async () => {
		console.log('initiateloaded ended');
		//if(open == true){
			//setOpen(true);
			open = false;
		//}
	}
	/*const setLoaderFn = async () => {
		if(open == true){
			setOpen(false);}
	}*/
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
		//const [collapsed,setCollapsed] = useState(false);
		$('#modal').on('hidden.bs.modal', () => {
			setShowRiders(null)
		})
		if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)){
			console.log('mobile');
			setCollapsed(true);
		  }else{
			console.log('desktop');
			setCollapsed(false);
			}
	}, [])

	const showModal = (idx) => {
		setShowRiders(idx)
		$('#modal').modal('show')
	}


	const riderInfo = () => {
		if (bookings.length === 0 || showRiders === null)
			return null
		const riders = bookings[showRiders]
		var ridersCount= 0;
		if(bookings[showRiders].tcount == null)
			ridersCount = bookings[showRiders].riders.length;
		else
			ridersCount = bookings[showRiders].tcount;
		return (
			<div className="overflow-y-scroll" style={{ height: '25vh' }}>
				{riders.riders.map((rider, ix) => {
					return (
						<div className="card mb-3">
							<div className="card-body">
								<h5>Full Name: {rider.fullName}</h5>
								<h5>Aadhar / Passport No: {rider.aadhar}</h5>
								<h5>{rider.phone ? `Phone : ${rider.phone}` : null}</h5>
								<h5>Total Number of Passengers : {ridersCount}</h5>
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
		if (dateFormat(bookings[i].startTime, 'MM-dd-yyyy') < dateFormat(today, 'MM-dd-yyyy')) {
			//window.alert("old booking-> didnt fetch that");
			//return
		}
		else{
			//window.alert("new booking-> data fetch success");
			// var dateString = YMDHMS(bookings[i].startTime).substring(0, 10) + " " + YMDHMS(bookings[i].startTime).substring(11, 16)+"-"+YMDHMS(bookings[i].endTime).substring(11, 16);
		var dateString = theDate.toLocaleString("en-IN");
		for (var j = 0; j < featuredRides.length; j++) {
			if (featuredRides[j].id === bookings[i].rideId) {
				bookings[i].rideName = featuredRides[j].name;
				bookings[i].showStamp = dateString;
			}
		}
		bookingsTable.push(bookings[i]);
		
		}
		
	}
	console.log('bookingsTable ===>>> ',bookingsTable);
	console.log('bookedRides ===>>> ',bookedRides);
	var tableArray = [];
	console.log('LEN-bookings ', bookingsTable.length);
	console.log('bookingsTable ', bookingsTable);
	console.log('LEN-rides ', bookedRides.length);
	console.log('bookedRides ', bookedRides);
	//if(bookingsTable.length > 0) initiateLoader();
	//const lengthCheck = bookingsTable.length* bookedRides.length;
	const showBookingsTable = bookingsTable.map((page, idx) => {
		//initiateLoader();
		//console.log('print page ', page);
		bookedRides.map((ridesInput, index) => {
			console.log('rideId ', ridesInput.id);
			console.log('Booking ride id ', page.rideId);
			if(page.rideId == ridesInput.id){
				//stopLoader();
				open = false;
				//initiateLoader();
				//setLoaderFn();
				console.log('starttime ', ridesInput.startTime);
		let ticketCountVar = 0;
		if(page.tcount != null){
			ticketCountVar = page.tcount;
		}else
		{
			ticketCountVar = page.riders.length;
		}

		var TotalPrice1 = (parseInt(ridesInput.price) * ticketCountVar) + (parseInt(ridesInput.price) * ticketCountVar * 0.025);
		tableArray.push(<tr key={idx}>
			<td className={tdClass}>
				{' '}
				{idx + 1}
			</td>
			<td className={tdClass}>
				{' '}
				{page.status === "inactive"|| page.status === 'cancelled' ? "" : <div className="btn btn-primary">
					<Link
						to={{
							pathname: "/ticket",
							state: { rideName: page.rideName, rideId: page.rideId, transactionId: page.transactionId, timestamp: page.showStamp, status: page.status, riders: bookings[idx].riders, bookingId: bookings[idx].id, tcount: ticketCountVar }
						}}
						className={btnClasses}
					>
						View Ticket
				</Link>
				</div>
				}

			</td>
			{/*
			<td className={tdClass}>
				{' '}
				{page.transactionId}
			</td>
			<td className={tdClass}>
				{' '}
				{ridesInput.name}
			</td>
			*/}
			<td className={tdClass}>
							{' '}
							{YMDHMS(ridesInput.startTime).substring(0, 10)}<br></br>
							{YMDHMS(ridesInput.startTime).substring(11, 16)}
						</td>
			<td className={tdClass}>
				{' '}
				{TotalPrice1}
				
			</td>
			<td className={tdClass}>
				{' '}
				{page.status}
			</td>
			{/*
			<td className={tdClass}>
				<button
					className="btn btn-secondary"
					onClick={() => {
						showModal(idx)
					}}
				>
					View Rider
				</button>
			</td>
			*/}
			<td className={tdClass}>
				{' '}
				{((page.status === "inactive")||(page.status === "cancelled"))||(page.status === "rescheduled") ? 
				(page.status === "cancelled")?
				/*(<div onClick={e => {
					setResched(page)
					// rescheduleMyBooking(page)
					}} className="btn btn-secondary cursor-pointer">
							Reschedule
						</div>)*/null:null
				:
					(bookedRides.length && bookedRides.filter(v => (v.id === page.rideId)).length) &&
						moment().isBefore(moment(bookedRides?.find(v => (v?.id === page?.rideId))?.startTime)) &&
						!(moment().isSame(moment(bookedRides?.find(v => (v?.id === page?.rideId))?.startTime),"day"))
						//if(moment().isSame(moment(bookedRides?.find(v => (v?.id === page?.rideId))?.startTime),"day")){
					?
						(<div onClick={e => cancelMyBooking(page)} className="btn btn-danger cursor-pointer">
							Cancel
						</div>)
						: null
				}

			</td>
		</tr>);	
		//return ()
				}
				/*else{
					if(bookingsTable.length != 0 && bookedRides.length != 0){
						if(idx == bookingsTable.length-1 && index == bookedRides.length-1){
							console.log('No data found - no array length 0');
							setLoaderFn();
						}
					}
					else if(bookingsTable.length != 0 && bookedRides.length == 0){
						if(idx == bookingsTable.length-1){
							console.log('No data found - bookedRides length 0');
							setLoaderFn();
						}
					}
					else if(bookingsTable.length == 0 && bookedRides.length != 0){
						if(index == bookedRides.length-1){
							console.log('No data found - bookingsTable length 0');
							setLoaderFn();
						}
					}
					else if(bookingsTable.length == 0 && bookedRides.length == 0){
						console.log('No data found - bookedRides, bookingsTable length 0');
						setLoaderFn();
					}
				}*/
			});
			if(bookingsTable.length -1  == idx) {
				//setLoaderFn();
				return tableArray;
			}
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
			<h2 className={titleClass}>  My Tickets </h2>
			<hr className="my-3" />
			<br />
			<div id="no-more-tables">
			{/*<Backdrop open={open}>
				<CircularProgress />
		</Backdrop>*/}
				<table className={tableClassnames}>
					<thead className="cf">
						<tr>
							<th className={headerClassnames}>S.No</th>
							<th className={headerClassnames}>Ticket</th>
							{/*<th className={headerClassnames}>Transaction ID</th>
							<th className={headerClassnames}>Ride Name</th>*/}
							<th className={headerClassnames}>Ride Date</th>
							<th className={headerClassnames}>Ticket Fare</th>
							<th className={headerClassnames}>Status</th>
							{/*<th className={headerClassnames}>Show Riders</th>*/}
							<th className={headerClassnames}>Cancel Ride</th> 
						</tr>
					</thead>
					<tbody>{showBookingsTable}</tbody>
				</table>
				
			</div>
			<Backdrop
        			className={classes.backdrop}
        			open={open}
      			>
        			<CircularProgress color="inherit" />
					Do not press any button, We are fetching your tickets to show you.
      			</Backdrop>
		</div>
	)
}
export default withClient(BookingHistory);