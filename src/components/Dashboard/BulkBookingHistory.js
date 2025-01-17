import React, { useState, useEffect } from 'react';
import { withClient } from '../../client';
import { GET_BULK_BOOKING_HISTORY } from '../../graphql/queries';
import { CANCEL_BULK_BOOKING, RESCHEDULE_BULK_BOOKING } from '../../graphql/mutations';
import { SEARCH_RIDES } from '../../graphql/queries';
import Swal from 'sweetalert2';
import logoFull from '../../assets/img/logo-full.png';
import { Link } from 'react-router-dom';
import { useCookies } from 'react-cookie';

import $ from 'jquery';
import Popup from '../layout/Popup';

const BookingHistory = ({ makeRequest }) => {

	const YMDHMS = (datetime) => {
		const pad2 = (n) => n < 10 ? '0' + n : n
		var date = new Date(datetime);
		return `${pad2(date.getDate())}/${pad2(date.getMonth() + 1)}/${date.getFullYear()} ${pad2(date.getHours())}:${pad2(date.getMinutes())}:${pad2(date.getSeconds())}`
	}

	const [bookings, setBookings] = useState([]);
	const [featuredRides, setFeaturedRides] = useState([]);
	const [bookedRides, setBookedRides] = useState([]);
	const [resched, setResched] = useState(null);
	const [showRiders, setShowRiders] = useState(null);
	const [cookies, removeCookie] = useCookies();
	const [bookerId, setBookerId] = useState(cookies.id);

	useEffect(() => {
		makeRequest(GET_BULK_BOOKING_HISTORY).then((data) => {
			var myData = [];
			for (var i = 0; i < data.getBulkBookingHistory.length; i++) {
				if (data.getBulkBookingHistory[i].bookerId === bookerId) {
					myData.push(data.getBulkBookingHistory[i]);
				}
			}
			setBookings(myData)
			makeRequest(SEARCH_RIDES, { byRideId: myData.map(v => v.rideId).filter((v, i, a) => a.indexOf(v) === i) }).then(rides => {
				setBookedRides(rides.getRides)
			})
		})
		makeRequest(SEARCH_RIDES, { byRideType: ["School"] }).then((rides) => {
			setFeaturedRides(rides.getRides)
		})
	}, [])

	let cancelMyBooking = async (page) => {
		console.log(page)
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
					let response = await makeRequest(CANCEL_BULK_BOOKING, { bookingIds: [page.id], transactionId: page.transactionId }).catch((err) => {
						Swal.fire({
							imageUrl: logoFull,
							imageWidth: "150px",
							imageHeight: "50px",
							title: 'Could not cancel booking !',
							confirmButtonText: 'OK',
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
						confirmButtonText: 'OK',
						heightAuto: false
					})
					makeRequest(GET_BULK_BOOKING_HISTORY).then((data) => {
						var myData = [];
						for (var i = 0; i < data.getBulkBookingHistory.length; i++) {
							if (data.getBulkBookingHistory[i].bookerId === bookerId) {
								myData.push(data.getBulkBookingHistory[i]);
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
		let response = await makeRequest(RESCHEDULE_BULK_BOOKING, { bookingIds: [page.id], transactionId: page.transactionId ,rideId}).catch((err) => {
			Swal.fire({
				imageUrl: logoFull,
				imageWidth: "150px",
				imageHeight: "50px",
				title: 'Could not reschedule booking !',
				confirmButtonText: 'OK',
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
			title: 'Successfully rescheduled booking.',
			confirmButtonText: 'OK',
			heightAuto: false
		})
		makeRequest(GET_BULK_BOOKING_HISTORY).then((data) => {
			var myData = [];
			for (var i = 0; i < data.getBulkBookingHistory.length; i++) {
				if (data.getBulkBookingHistory[i].bookerId === bookerId) {
					myData.push(data.getBulkBookingHistory[i]);
				}
			}
			setBookings(myData)
		})

	}

	var bookingsTable = [];
	for (var i = 0; i < bookings.length; i++) {
		var theDate = new Date(bookings[i].timestamp);
		var dateString = theDate.toLocaleString("en-IN");
		for (var j = 0; j < featuredRides.length; j++) {
			if (featuredRides[j].id === bookings[i].rideId) {
				bookings[i].rideName = featuredRides[j].name;
				bookings[i].showStamp = dateString;
			}
		}
		bookingsTable.push(bookings[i]);
	}

	const showBookingsTable = bookingsTable.map((page, idx) => {
		return (
			<tr key={idx}>
				<td className="px-md-2 numeric text-center">
					{' '}
					{idx + 1}
				</td>
				<td className="px-md-2 numeric text-center">
					{' '}
					{page.status === "inactive" ? "" : (<div className="btn btn-primary">
						<Link
							to={{
								pathname: "/bulkticket",
								state: {
									id: page.id,
									rideId: page.rideId,
									rideName: page.rideName,
									bookerName: page.bookerName,
									schoolName: page.schoolName,
									schoolDistrict: page.schoolDistrict,
									riderCount: page.riderCount,
									aadhar: page.aadhar,
									transactionId: page.transactionId,
									timestamp: page.timestamp,
									status: page.status,
								}
							}}
							className="text-light"
						>
							View Ticket
					</Link>
					</div>)}

				</td>
				<td className="px-md-2 numeric text-center">
					{' '}
					{page.rideName}
				</td>
				<td className="px-md-2 numeric text-center">
					{' '}
					{page.bookerName}
				</td>
				<td className="px-md-2 numeric text-center">
					{' '}
					{page.schoolName}
				</td>
				<td className="px-md-2 numeric text-center">
					{' '}
					{page.schoolDistrict}
				</td>
				<td className="px-md-2 numeric text-center">
					{' '}
					{page.riderCount}
				</td>
				<td className="px-md-2 numeric text-center">
					{' '}
					{page.aadhar}
				</td>
				<td className="px-md-2 numeric text-center">
					{' '}
					{page.transactionId}
				</td>
				<td className="px-md-2 numeric text-center">
					{' '}
					{YMDHMS(page.timestamp)}
				</td>
				<td className="px-md-2 numeric text-center">
					{' '}
					{page.status}
				</td>
				<td className="px-md-2 numeric text-center">
					{' '}
					<div className="btn btn-primary">
						<a target="_blank" className="text-light" href={page.fileUrl} download={true}>Letter Head</a>
					</div>
				</td>
				<td className="px-md-2 numeric text-center">
					{' '}
					{(page.status === "inactive" || (page.status === "cancelled")) || (page.status === "rescheduled") ?
						(page.status === "cancelled") ?
							(<div onClick={e => {
								setResched(page)
								// rescheduleMyBooking(page)
							}} className="btn btn-secondary cursor-pointer">
								Reschedule
							</div>) : null
						:
						(bookedRides.length && bookedRides.filter(v => (v.id === page.rideId)).length && ((new Date()).getTime() < ((new Date(bookedRides.filter(v => (v.id === page.rideId))[0].startTime)).getTime() - 86400000))) ?

							<div onClick={e => cancelMyBooking(page)} className="btn btn-danger cursor-pointer">
								Cancel
					</div>
							: null
					}

				</td>

			</tr>
		)

	})

	return (
		<div id="#bulkhistory">
			{resched ?
				<Popup
					rides={featuredRides
						.filter(v => {
							console.log(v.rideType, resched)
							return (v.rideType == resched.rideType)
						})
					}
					onSubmit={(rideId) => {
						rescheduleMyBooking(resched, rideId)
					}}
					onCancel={() => setResched(false)}
				/>
				: null}
			<div className="container bg-light mt-5 p-3 px-4 rounded-lg">
				<div className="modal fade" id="modal" role="dialog">
					<div className="modal-dialog modal-dialog-centered" role="document">
						<div className="modal-content">
							<div className="modal-header">
								<h5 className="modal-title">Riders</h5>
								<button type="button" className="close" data-dismiss="modal">
									<span className="fa fa-times"></span>
								</button>
							</div>
						</div>
					</div>
				</div>
				<h1 className="mb-4"> Your Bulk Booking History </h1>
				<br />
				<div id="no-more-tables">
					<table className="col-md-12 table-bordered table-striped table-condensed cf">
						<thead className="cf">
							<tr>
								<th className="text-center px-md-5">#</th>
								<th className="text-center px-md-5">Show Ticket</th>
								<th className="text-center px-md-5">Ride Name</th>
								<th className="text-center px-md-5">Booker Name</th>
								<th className="text-center px-md-5">School Name</th>
								<th className="text-center px-md-5">School District</th>
								<th className="text-center px-md-5">Rider Count</th>
								<th className="text-center px-md-5">Booker Aadhar</th>
								<th className="text-center px-md-5">Transaction ID</th>
								<th className="text-center px-md-5">Timestamp</th>
								<th className="text-center px-md-5">Status</th>
								<th className="text-center px-md-5">Letter Head</th>
								<th className="text-center px-md-5">Cancel Ride</th>
							</tr>
						</thead>
						<tbody>{showBookingsTable}</tbody>
					</table>
				</div>
			</div>
		</div>
	)
}

export default withClient(BookingHistory);