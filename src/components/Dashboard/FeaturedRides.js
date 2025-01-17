import React, { useState, useEffect } from 'react';
import classNames from 'classnames';
import DateTimePicker from 'react-datetime-picker';
import ShowMore from './ShowMore'

import { SEARCH_RIDES } from '../../graphql/queries';
import { withClient } from '../../client';
import logoFull from '../../assets/img/logo-full.png';
import Swal from 'sweetalert2';
import { Link, useHistory, useLocation } from 'react-router-dom'
// import './dashboard.scss'
import ferrySample from '../../assets/img/ferrysample1.png'
import ShowLess from './ShowLess';

const SearchRides = ({ makeRequest, ...props }) => {

	let x=0;

	const YMDHMS = (datetime) => {
		const pad2 = (n) => n < 10 ? '0' + n : n
		var date = new Date(datetime);
		return `${pad2(date.getDate())}/${pad2(date.getMonth() + 1)}/${date.getFullYear()} ${pad2(date.getHours())}:${pad2(date.getMinutes())}:${pad2(date.getSeconds())}`
	}

	const filters = [
		'date'
	]

	const location = useLocation()
	const history = useHistory()
	const [curFilter, setCurFilter] = useState(filters[0])

	// startTime filter state

	const [startTimeEqualChoice, setStartTimeEqualChoice] = useState(null)
	const [startTimeEqualChoiceValue, setStartTimeEqualChoiceValue] = useState('')

	// results

	const [rides, setRides] = useState(null)
	const [fetching, setFetching] = useState(false)
	const [showLess, setShowLess] = useState(false)
	const [typeCounter, setTypeCounter] = useState({ general: 0, special: 0 })
	const [generalCount, setGeneralCount] = useState(0)
	const [specialCount, setSpecialCount] = useState(0)

	// To block the link to booking \/
	const [allowedBooking, setAllowedBooking] = useState(false)

	useEffect(() => {
		setAllowedBooking(() => false)
		setFetching(true)
		//var dateNow = new Date();
		//dateNow.setDate(dateNow.getDate());
		//makeRequest(SEARCH_RIDES, { byStartTimeGreater: dateNow, withBooked: true },
		makeRequest(SEARCH_RIDES, { byStartTimeGreaterEqual: Date.now(), withBooked: true },
		
			props.toLogin ?
				{ "Content-Location": "dashboard" }
				: null
		).then((res) => {
			setRides(res.getRides)
			/*var ridesInput = [];
			var ridesData = res.getRides;
			var currentDateTime = new Date();
			var currentDate = currentDateTime.toISOString().slice(0,10);
			//console.log('currentDate ', currentDate);
			for(var i=0; i<ridesData.length;i++){
				var dbDateTime = new Date(ridesData[i].startTime);
				console.log('dbDateTime', dbDateTime);
				var dbDate = dbDateTime.toISOString().split('T')[0];
				console.log('dbDate ', dbDate);
				console.log('currentDate ', currentDate);
				if(currentDate == dbDate){
					if(dbDateTime.toLocaleTimeString()> new Date().toLocaleTimeString()){
						console.log('Greater than current datetime ');
						ridesInput[i] = ridesData[i];
					}
					//ridesInput[i] = ridesData[i];
					if(ridesData[i].price == 300){
						console.log('Date.now() => ', new Date().toLocaleTimeString());
						console.log('dbDate.now() => ', dbDateTime.toLocaleTimeString());
						if(dbDateTime.toLocaleTimeString()> new Date().toLocaleTimeString()){
							console.log('Greater than current datetime ');
							ridesInput[i] = ridesData[i];
						}
						else
						console.log('Less than current datetime ');
					}
				}else {
					ridesInput[i] = ridesData[i];
				}
			}
			setRides(ridesInput)*/
			
			setFetching(false)

		}).catch(() => { setFetching(false) })



	}, [])


	useEffect(() => {
		if (location && location.state && location.state.rideId) {
			history.push({
				pathname: location.state.rideType === "School" ? "/bulkbook" : "/book",
				state: { rideId: location.state.rideId, rideName: location.state.rideName, ridePrice: location.state.ridePrice }
			})
		}
	}, [location])


	// overall handlers

	const submitSearch = async () => {

		setRides(null)


		if (!startTimeEqualChoiceValue) {

			const response = await makeRequest(SEARCH_RIDES, { byStartTimeGreaterEqual: Date.now() },
				props.toLogin ?
					{ "Content-Location": "dashboard" }
					: null
			)
			
			setRides(response.getRides)

			setFetching(false)
			return
		}

		const date = new Date(startTimeEqualChoiceValue)
		const start = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0)
		const end = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1, 0, 0, 0)
		/*var currentDateTime = new Date();
		var currentDate = new Date(currentDateTime.getFullYear(), currentDateTime.getMonth(), currentDateTime.getDate(), 0, 0, 0)
		var search = start.toISOString().slice(0,10);
		var startTimeVariables;
		if(currentDate.getTime() == start.getTime()){
			startTimeVariables = {
				byStartTimeLesser: startTimeEqualChoiceValue ? end : null,
				byStartTimeGreater: startTimeEqualChoiceValue ? start : null
			}
		}
		else{
			startTimeVariables = {
				byStartTimeLesser: startTimeEqualChoiceValue ? end : null,
				byStartTimeGreaterEqual: startTimeEqualChoiceValue ? start : null
			}
		}*/

		const startTimeVariables = {
			byStartTimeLesser: startTimeEqualChoiceValue ? end : null,
			byStartTimeGreaterEqual: startTimeEqualChoiceValue ? start : null
		}
		const variables = {
			...startTimeVariables,
		}

		const response = await makeRequest(SEARCH_RIDES, variables,
			props.toLogin ?
				{ "Content-Location": "dashboard" }
				: null
		)
		/*if(currentDate.getTime() == start.getTime()){
			var ridesInput1 = [];
			var ridesData1 = response.getRides;
			for(var i=0; i<ridesData1.length;i++){
				var dbDateTime1 = new Date(ridesData1[i].startTime);
					if(ridesData1[i].price == 300){
						console.log('Date.now() => ', new Date().toLocaleTimeString());
						console.log('dbDate.now() => ', dbDateTime1.toLocaleTimeString());
						if(dbDateTime1.toLocaleTimeString()> new Date().toLocaleTimeString()){
							console.log('Greater than current datetime ');
							ridesInput1[i] = ridesData1[i];
						}
						else
						console.log('Less than current datetime ');
					}
						//ridesInput1[i] = ridesData1[i];
					
			}
		setFetching(false)
		setRides(ridesInput1);
		}
		else
		{
		setFetching(false)
		setRides(response.getRides)
		}*/
		setFetching(false)
		setRides(response.getRides)
		
	}

	const resetFilters = () => {
		setStartTimeEqualChoice(null)
		setStartTimeEqualChoiceValue('')
	}

	const changeCurFilter = (filter) => {
		setCurFilter(filter);
	}

	const getCurFilter = (filter) => {
		switch (filter) {

			case 'date': {
				return startTimeFilter
				break
			}
		}
	}


	// start time filter handlers

	const handleStartTimeEqualChoiceValue = (value) => {
		const today = new Date(Date.now())
		if (value <= new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1, 0, 0, 0)) {
			window.alert("start time cannot be in the past")
			return
		}
		setStartTimeEqualChoiceValue(value)
	}

	// filters


	const startTimeFilter = (
		<div className="row mt-3">
			<div className="col-md-4">
				<div className="input-group">
					<div className="input-group-prepend">
						<div
							className={classNames("input-group-text btn input-group-text-active")}
							id="eq"
						>
							Date
						</div>

					</div>
					<DateTimePicker
						format={"dd.MM.yyyy hh:mm"}
						disableClock={true}
						type="text"
						className="form-control no-time"
						onChange={(e) => {
							handleStartTimeEqualChoiceValue(e)
						}}
						value={startTimeEqualChoiceValue}
					/>
				</div>
			</div>
			<div className="col-md-8">
			<div className="d-md-flex">
					<div className="w-100 d-flex justify-content-start">
						<div
							className="btn btn-primary mx-3 "

							onClick={() => {
								setFetching(true)
								submitSearch()
							}}
						>
							Submit
						</div>
						<div
							className="btn btn-danger mx-3"
							onClick={() => {
								resetFilters()
							}}
						>
							Reset Fields
						</div>

					</div>

					<div className="w-100 d-flex justify-content-end align-items-center">
						<h4 className="d-inline-block mr-2">{showLess ? 'Show More' : 'Show Less'}</h4>
						<label className="switch">
							<input
								type="checkbox"
								onClick={() => {
									setShowLess(!showLess)
								}}
							/>
							<span className="slider round"></span>
						</label>
					</div>
				</div>
			</div>
		</div>
	)
	useEffect(() => {
		setGeneralCount(0)
		setSpecialCount(0)
		console.log(rides)
		if (rides) {
			rides.forEach((ride) => {
				if (ride.rideType === "General") {
					setGeneralCount(() => generalCount + 1)

				} else if (ride.rideType === "Special") {
					setSpecialCount(() => specialCount + 1)

				}
			})


		}
		console.log(generalCount)
		console.log(specialCount)
	}, [rides])

	const PopupCheckDay = (day) => {
		var options = { year: 'numeric', month: 'numeric', day: 'numeric' }
		var start = Date.parse(day)
		var now = Date.now()

		if (((start - now) / (24 * 3600 * 1000)) > 30) {

			Swal.fire({
				imageUrl: logoFull,
				imageWidth: "150px",
				title: 'Error',
				text: 'Booking slot available only for 30 days',
				confirmButtonText: 'OK',
				heightAuto: false
			});
			return false
		} else {

			return true
		}
	}

	const CheckDay = (day) => {
		var options = { year: 'numeric', month: 'numeric', day: 'numeric' }
		var start = Date.parse(day)
		var now = Date.now()

		if (((start - now) / (24 * 3600 * 1000)) > 30) {
			// setAllowedBooking(() => false)
			// Swal.fire({
			// 	imageUrl:logoFull,
			// 	  imageWidth: "150px",
			// 	  title: 'Error',
			// 	  text: 'Booking slot available only for 30 days',
			// 	  confirmButtonText: 'OK',
			// 	  heightAuto: false
			//   });
			return false
		} else {
			return true
		}
	}

	const displayResults = rides && rides.length > 0 ?
		<>
			{showLess ?
				(
					<div className="row">
						{["active"].map(v => (
							<>
								{rides.filter(ride=>(ride.status==v)).map(ride => (
									<ShowLess ride={ride} CheckDay={CheckDay} PopupCheckDay={PopupCheckDay} YMDHMS={YMDHMS} {...props} />
								))}
							</>
						))}

					</div>
				)
				:
				(
					<div className="row">
						{["active"].map(v => (
							<>
								{rides.filter(ride=>(ride.status==v)).map(ride => (
									<ShowMore ride={ride} CheckDay={CheckDay} PopupCheckDay={PopupCheckDay} YMDHMS={YMDHMS} {...props} ferrySample={ferrySample} />
								))}
							</>
						))}
					</div>
				)}
		</>
		: fetching ? (
			<div class="d-flex justify-content-center">
				<div class="spinner-border" role="status">
				</div>
			</div>
		) : (
				<div className="row justify-content-center">
					<h4>The requested date does not have any rides. Please try other date</h4>
				</div>
			)

	return (
		<div>
			<div className="container mt-5 rounded bg-light p-4">
				<h2 className="">Search for Rides</h2>
				<hr className="my-3" />
				<div className="w-30">
					<ul className="nav nav-tabs" role="tablist">
						{
							filters.map((filter, ix) => {
								return (
									<li className="nav-item" key={`${filter}-${ix}`}>
										<a
											className={"nav-link" + (ix === 0 ? " active" : "")}
											data-toggle="tab"
											onClick={
												() => {
													changeCurFilter(filter)
												}
											}
										>
											{filter.replace(/(^\w{1})|(\s{1}\w{1})/g, match => match.toUpperCase())}
										</a>
									</li>
								)
							})
						}
					</ul>
				</div>
				{
					getCurFilter(curFilter)
				}
				<hr className="my-3" />

				{/*
				<div className="d-md-flex">
					<div className="w-100 d-flex justify-content-start">
						<div
							className="btn btn-primary mx-3 "

							onClick={() => {
								setFetching(true)
								submitSearch()
							}}
						>
							Submit
						</div>
						<div
							className="btn btn-danger mx-3"
							onClick={() => {
								resetFilters()
							}}
						>
							Reset Fields
						</div>

					</div>

					<div className="w-100 d-flex justify-content-end align-items-center">
						<h4 className="d-inline-block mr-2">{showLess ? 'Show More' : 'Show Less'}</h4>
						<label className="switch">
							<input
								type="checkbox"
								onClick={() => {
									setShowLess(!showLess)
								}}
							/>
							<span className="slider round"></span>
						</label>
					</div>
				</div>
				*/}
			</div>

			<div className="container mt-5 rounded bg-light p-3">
				<h2 className="">Results</h2>
				<hr className="my-3" />
				{displayResults}

			</div>
		</div>
	)
}

export default withClient(SearchRides);