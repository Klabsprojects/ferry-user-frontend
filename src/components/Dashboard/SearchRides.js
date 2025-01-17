import React, { useState } from 'react';
import classNames from 'classnames';
import DateTimePicker from 'react-datetime-picker';

import { SEARCH_RIDES } from '../../graphql/queries';
import { withClient } from '../../client';
import { YMDHMS } from '../../utils/datetime';

import { Link } from 'react-router-dom'

import ferrySample from '../../assets/img/ferrysample.jpeg'

const SearchRides = ({ makeRequest }) => {

	const filters = [
		'name',
		'price',
		// 'location',
		// 'capacity',
		'start time'
	]

	const [curFilter, setCurFilter] = useState(filters[0])

	// name filter state

	const [byName, setByName] = useState([])
	const [inpName, setInpName] = useState('')

	// location filter state

	const [byLocation, setByLocation] = useState([])
	const [inpLocation, setInpLocation] = useState('')

	// price filter state

	const [priceGreaterChoice, setPriceGreaterChoice] = useState(null)
	const [priceGreaterChoiceValue, setPriceGreaterChoiceValue] = useState('')
	const [priceLesserChoice, setPriceLesserChoice] = useState('lt')
	const [priceLesserChoiceValue, setPriceLesserChoiceValue] = useState('')
	const [priceEqualChoice, setPriceEqualChoice] = useState(null)
	const [priceEqualChoiceValue, setPriceEqualChoiceValue] = useState('')

	// capacity filter state

	const [capacityGreaterChoice, setCapacityGreaterChoice] = useState(null)
	const [capacityGreaterChoiceValue, setCapacityGreaterChoiceValue] = useState('')
	const [capacityLesserChoice, setCapacityLesserChoice] = useState(null)
	const [capacityLesserChoiceValue, setCapacityLesserChoiceValue] = useState('')
	const [capacityEqualChoice, setCapacityEqualChoice] = useState(null)
	const [capacityEqualChoiceValue, setCapacityEqualChoiceValue] = useState('')

	// startTime filter state

	const [startTimeGreaterChoice, setStartTimeGreaterChoice] = useState(null)
	const [startTimeGreaterChoiceValue, setStartTimeGreaterChoiceValue] = useState('')
	const [startTimeLesserChoice, setStartTimeLesserChoice] = useState(null)
	const [startTimeLesserChoiceValue, setStartTimeLesserChoiceValue] = useState('')
	const [startTimeEqualChoice, setStartTimeEqualChoice] = useState(null)
	const [startTimeEqualChoiceValue, setStartTimeEqualChoiceValue] = useState('')

	// results

	const [rides, setRides] = useState(null)
	const [fetching, setFetching] = useState(false)
	const [showLess, setShowLess] = useState(false)

	// overall handlers

	const submitSearch = async () => {

		const priceVariables = {
			byPrice: priceEqualChoiceValue === '' ? null : [Number(priceEqualChoiceValue)],
			byPriceLesser: priceLesserChoice === "lt" ? Number(priceLesserChoiceValue) : null,
			byPriceGreater: priceGreaterChoice === "gt" ? Number(priceGreaterChoiceValue) : null,
			byPriceLesserEqual: priceLesserChoice === "lte" ? Number(priceLesserChoiceValue) : null,
			byPriceGreaterEqual: priceGreaterChoice === "gte" ? Number(priceGreaterChoiceValue) : null,
		}

		const capacityVariables = {
			byCapacity: capacityEqualChoiceValue === '' ? null : [Number(capacityEqualChoiceValue)],
			byCapacityLesser: capacityLesserChoice === "lt" ? Number(capacityLesserChoiceValue) : null,
			byCapacityGreater: capacityGreaterChoice === "gt" ? Number(capacityGreaterChoiceValue) : null,
			byCapacityLesserEqual: capacityLesserChoice === "lte" ? Number(capacityLesserChoiceValue) : null,
			byCapacityGreaterEqual: capacityGreaterChoice === "gte" ? Number(capacityGreaterChoiceValue) : null,
		}

		// const startTimeVariables = {
		// 	byStartTime: startTimeEqualChoiceValue === '' ? null : [startTimeEqualChoiceValue] ,
		// 	byStartTimeLesser: startTimeLesserChoice === "lt" ? startTimeLesserChoiceValue : null,
		// 	byStartTimeGreater: startTimeGreaterChoice === "gt" ? startTimeGreaterChoiceValue : null,
		// 	byStartTimeLesserEqual: startTimeLesserChoice === "lte" ? startTimeLesserChoiceValue : null ,
		// 	byStartTimeGreaterEqual: startTimeGreaterChoice === "gte" ? startTimeGreaterChoiceValue : Date.now(),
		// }

		const date = new Date(startTimeEqualChoiceValue ? startTimeEqualChoiceValue : null)
		const start = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0)
		const end = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1, 0, 0, 0)

		const startTimeVariables = {
			byStartTimeLesser: startTimeEqualChoiceValue ? end : null,
			byStartTimeGreaterEqual: startTimeEqualChoiceValue ? start : Date.now(),
		}

		const variables = {
			byName: byName.length > 0 ? byName : null,
			byLocation: byLocation.length > 0 ? byLocation : null,
			...priceVariables,
			...capacityVariables,
			...startTimeVariables,
			withBooked: true
		}

		setFetching(true)

		const response = await makeRequest(SEARCH_RIDES, variables)

		setFetching(false)
		setRides(response.getRides)
	}

	const resetFilters = () => {
		setByName([])
		setInpName('')
		setByLocation([])
		setInpLocation('')
		setPriceGreaterChoice(null)
		setPriceGreaterChoiceValue('')
		setPriceLesserChoice(null)
		setPriceLesserChoiceValue('')
		setPriceEqualChoice(null)
		setPriceEqualChoiceValue('')
		setCapacityGreaterChoice(null)
		setCapacityGreaterChoiceValue('')
		setCapacityLesserChoice(null)
		setCapacityLesserChoiceValue('')
		setCapacityEqualChoice(null)
		setCapacityEqualChoiceValue('')
		setStartTimeGreaterChoice(null)
		setStartTimeGreaterChoiceValue('')
		setStartTimeLesserChoice(null)
		setStartTimeLesserChoiceValue('')
		setStartTimeEqualChoice(null)
		setStartTimeEqualChoiceValue('')
	}

	const changeCurFilter = (filter) => {
		setCurFilter(filter);
	}

	const getCurFilter = (filter) => {
		switch (filter) {
			case 'name': {
				return nameFilter
				break
			}

			case 'price': {
				return priceFilter
				break
			}

			case 'location': {
				return locationFilter
				break
			}

			case 'capacity': {
				return capacityFilter
				break
			}

			case 'start time': {
				return startTimeFilter
				break
			}
		}
	}

	// name filter handlers

	const changeName = (name) => {
		setInpName(name);
	}

	const addName = () => {
		if (inpName === '')
			return
		setByName([...byName, inpName]);
		setInpName('')
	}

	const removeName = (ix) => {
		setByName([...byName.slice(0, ix), ...byName.slice(ix + 1)])
	}

	// location filter handlers

	const changeLocation = (location) => {
		setInpLocation(location);
	}

	const addLocation = () => {
		if (inpLocation === '')
			return
		setByLocation([...byLocation, inpLocation]);
		setInpLocation('')
	}

	const removeLocation = (ix) => {
		setByLocation([...byLocation.slice(0, ix), ...byLocation.slice(ix + 1)])
	}

	// capacity filters handlers

	const handleCapacityEqualChoiceValue = (value) => {
		setCapacityEqualChoiceValue(value)
	}

	const handleCapacityGreaterChoiceValue = (value) => {
		setCapacityGreaterChoiceValue(value)
	}

	const handleCapacityLesserChoiceValue = (value) => {
		setCapacityLesserChoiceValue(value)
	}

	const handleCapacityEqualButton = (buttonVal) => {
		if (capacityEqualChoice === buttonVal) {
			setCapacityEqualChoice(null)
			setCapacityEqualChoiceValue('')
		} else {
			setCapacityEqualChoice(buttonVal)
			setCapacityGreaterChoice(null)
			setCapacityGreaterChoiceValue('')
			setCapacityLesserChoice(null)
			setCapacityLesserChoiceValue('')
		}
	}

	const handleCapacityLesserButtons = (buttonVal) => {
		if (capacityLesserChoice === buttonVal) {
			setCapacityLesserChoice(null)
			setCapacityLesserChoiceValue('')
		} else {
			setCapacityLesserChoice(buttonVal)
			setCapacityEqualChoice(null)
			setCapacityEqualChoiceValue('')
		}
	}

	const handleCapacityGreaterButtons = (buttonVal) => {
		if (capacityGreaterChoice === buttonVal) {
			setCapacityGreaterChoice(null)
			setCapacityGreaterChoiceValue('')
		} else {
			setCapacityGreaterChoice(buttonVal)
			setCapacityEqualChoice(null)
			setCapacityEqualChoiceValue('')
		}
	}


	// price filters handlers

	const handlePriceEqualChoiceValue = (value) => {
		setPriceEqualChoiceValue(value)
	}

	const handlePriceGreaterChoiceValue = (value) => {
		setPriceGreaterChoiceValue(value)
	}

	const handlePriceLesserChoiceValue = (value) => {
		setPriceLesserChoiceValue(value)
	}

	const handlePriceEqualButton = (buttonVal) => {
		if (priceEqualChoice === buttonVal) {
			setPriceEqualChoice(null)
			setPriceEqualChoiceValue('')
		} else {
			setPriceEqualChoice(buttonVal)
			setPriceGreaterChoice(null)
			setPriceGreaterChoiceValue('')
			setPriceLesserChoice(null)
			setPriceLesserChoiceValue('')
		}
	}

	const handlePriceLesserButtons = (buttonVal) => {
		if (priceLesserChoice === buttonVal) {
			setPriceLesserChoice(null)
			setPriceLesserChoiceValue('')
		} else {
			setPriceLesserChoice(buttonVal)
			setPriceEqualChoice(null)
			setPriceEqualChoiceValue('')
		}
	}

	const handlePriceGreaterButtons = (buttonVal) => {
		if (priceGreaterChoice === buttonVal) {
			setPriceGreaterChoice(null)
			setPriceGreaterChoiceValue('')
		} else {
			setPriceGreaterChoice(buttonVal)
			setPriceEqualChoice(null)
			setPriceEqualChoiceValue('')
		}
	}

	// start time filter handlers

	const handleStartTimeEqualChoiceValue = (value) => {
		if (value <= Date.now()) {
			window.alert("start time can only be in the future")
			return
		}
		setStartTimeEqualChoiceValue(value)
	}

	const handleStartTimeGreaterChoiceValue = (value) => {
		setStartTimeGreaterChoiceValue(value)
	}

	const handleStartTimeLesserChoiceValue = (value) => {
		if (value <= Date.now()) {
			window.alert("start time can only be in the future")
			return
		}
		setStartTimeLesserChoiceValue(value)
	}

	const handleStartTimeEqualButton = (buttonVal) => {
		if (startTimeEqualChoice === buttonVal) {
			setStartTimeEqualChoice(null)
			setStartTimeEqualChoiceValue('')
		} else {
			setStartTimeEqualChoice(buttonVal)
			setStartTimeGreaterChoice(null)
			setStartTimeGreaterChoiceValue('')
			setStartTimeLesserChoice(null)
			setStartTimeLesserChoiceValue('')
		}
	}

	const handleStartTimeLesserButtons = (buttonVal) => {
		if (startTimeLesserChoice === buttonVal) {
			setStartTimeLesserChoice(null)
			setStartTimeLesserChoiceValue('')
		} else {
			setStartTimeLesserChoice(buttonVal)
			setStartTimeEqualChoice(null)
			setStartTimeEqualChoiceValue('')
		}
	}

	const handleStartTimeGreaterButtons = (buttonVal) => {
		if (startTimeGreaterChoice === buttonVal) {
			setStartTimeGreaterChoice(null)
			setStartTimeGreaterChoiceValue('')
		} else {
			setStartTimeGreaterChoice(buttonVal)
			setStartTimeEqualChoice(null)
			setStartTimeEqualChoiceValue('')
		}
	}

	// filters

	const locationFilter = (
		<div className="row mt-3">
			<div className="col-md-5 ">
				<div className="input-group">
					<div className="input-group-prepend">
						<span className="input-group-text">Location to add</span>
					</div>
					<input
						type="text"
						className="form-control"
						placeholder="Name"
						onChange={(e) => { changeLocation(e.target.value) }}
						value={inpLocation}
					/>
					<div
						className="ml-2 btn btn-primary rounded-circle"
						onClick={() => {
							addLocation();
						}}
					>
						<span className="fa fa-plus"></span>
					</div>
				</div>
			</div>
			<div className="col-md-7 clearfix overflow-x-scroll">
				{
					byLocation.map((location, ix) => {
						return (
							<h2 className="float-left mr-2" key={`${location}-${ix}`}>
								<span
									className="badge badge-primary"
									style={{
										maxWidth: '100%'
									}}
								>
									<span className="mr-2 fa fa-times align-top" onClick={() => {
										removeLocation(ix)
									}}></span>
									{location}
								</span>
							</h2>
						)
					})
				}
			</div>
		</div>
	)

	const capacityFilter = (
		<div className="row mt-3">
			<div className="col-md">
				<div className="input-group">
					<div className="input-group-prepend">
						<div
							className={classNames("input-group-text btn", {
								'input-group-text-active': capacityGreaterChoice === "gt"
							})}
							id="gt"
							onClick={() => {
								handleCapacityGreaterButtons("gt")
							}}
						>
							<span className="fa fa-chair mr-2"></span>
							<span className="fa fa-greater-than"></span>
						</div>

						<div
							className={classNames("input-group-text btn", {
								'input-group-text-active': capacityGreaterChoice === "gte"
							})}
							id="gte"
							onClick={() => {
								handleCapacityGreaterButtons("gte")
							}}
						>
							<span className="fa fa-chair mr-2"></span>
							<span className="fa fa-greater-than-equal"></span>
						</div>
					</div>
					<input
						type="text"
						className="form-control"
						placeholder="Enter Capacity"
						onChange={(e) => {
							handleCapacityGreaterChoiceValue(e.target.value)
						}}
						value={capacityGreaterChoiceValue}
						disabled={capacityGreaterChoice === null}
						pattern="\d+"
					/>
				</div>
			</div>

			<div className="col-md">
				<div className="input-group">
					<div className="input-group-prepend">
						<div
							className={classNames("input-group-text btn", {
								'input-group-text-active': capacityEqualChoice === "eq"
							})}
							onClick={() => {
								handleCapacityEqualButton("eq")
							}}
							id="eq"
						>
							<span className="fa fa-chair mr-2"></span>
							<span className="fa fa-equals"></span>
						</div>

						<input
							type="text"
							className="form-control"
							placeholder="Enter Capacity"
							onChange={(e) => {
								handleCapacityEqualChoiceValue(e.target.value)
							}}
							value={capacityEqualChoiceValue}
							disabled={capacityEqualChoice === null}
							pattern="\d+"
						/>
					</div>
				</div>
			</div>

			<div className="col-md">
				<div className="input-group">
					<div className="input-group-prepend">
						<div
							className={classNames("input-group-text btn", {
								'input-group-text-active': capacityLesserChoice === "lt"
							})}
							id="lt"
							onClick={() => {
								handleCapacityLesserButtons("lt")
							}}
						>
							<span className="fa fa-chair mr-2"></span>
							<span className="fa fa-less-than"></span>
						</div>

						<div
							className={classNames("input-group-text btn", {
								'input-group-text-active': capacityLesserChoice === "lte"
							})}
							id="lte"
							onClick={() => {
								handleCapacityLesserButtons("lte")
							}}
						>
							<span className="fa fa-chair mr-2"></span>
							<span className="fa fa-less-than-equal"></span>
						</div>
					</div>
					<input
						type="text"
						className="form-control"
						placeholder="Enter Capacity"
						onChange={(e) => {
							handleCapacityLesserChoiceValue(e.target.value)
						}}
						value={capacityLesserChoiceValue}
						disabled={capacityLesserChoice === null}
						pattern="\d+"
					/>
				</div>
			</div>
		</div>
	)

	const priceFilter = (
		<div className="row mt-3">
			{/*
			<div className="col-md">
				<div className="input-group">
					<div className="input-group-prepend">
						<div 
						  className={classNames("input-group-text btn", {
						  	'input-group-text-active' : priceGreaterChoice === "gt"
						  })}
						  id="gt"
						  onClick={ () => {
						  	handlePriceGreaterButtons("gt")
						  }}
						>
						<span className="fa fa-rupee-sign mr-2"></span>
						<span className="fa fa-greater-than"></span>
						</div>

						<div 
						  className={classNames("input-group-text btn", {
						  	'input-group-text-active' : priceGreaterChoice === "gte"
						  })}
						  id="gte"
						  onClick={ () => {
						  	handlePriceGreaterButtons("gte")
						  }}
						>
						<span className="fa fa-rupee-sign mr-2"></span>
						<span className="fa fa-greater-than-equal"></span>
						</div>
					</div>
					<input
					  type="text" 
					  className="form-control" 
					  placeholder="Enter Price"
					  onChange={(e)=>{
					  	handlePriceGreaterChoiceValue(e.target.value)
					  }}
					  value={priceGreaterChoiceValue}
					  disabled={priceGreaterChoice === null}
					  pattern="\d+"
					/>
				</div>
			</div>
*/}
			{/*
			<div className="col-md">
				<div className="input-group">
					<div className="input-group-prepend">
						<div 
						  className={classNames("input-group-text btn", {
						  	'input-group-text-active' : priceEqualChoice === "eq"
						  })}
						  onClick={ () => {
						  	handlePriceEqualButton("eq")
						  }}
						  id="eq"
						>
						<span className="fa fa-rupee-sign mr-2"></span>
						<span className="fa fa-equals"></span>
						</div>

						<input
						  type="text" 
						  className="form-control" 
						  placeholder="Enter Price"
						  onChange={(e)=>{
						  	handlePriceEqualChoiceValue(e.target.value)
						  }}
						  value={priceEqualChoiceValue}
						  disabled={priceEqualChoice === null}
						  pattern="\d+"
						/>
					</div>
				</div>
			</div>
*/}

			<div className="col-md">
				<div className="input-group">
					<div className="input-group-prepend">
						<div
							className={classNames("input-group-text btn", {
								'input-group-text-active': priceLesserChoice === "lt"
							})}
							id="lt"
							onClick={() => {
								handlePriceLesserButtons("lt")
							}}
						>
							{/*
						<span className="fa fa-rupee-sign mr-2"></span>
						<span className="fa fa-less-than"></span>
*/}
							Price Lesser Than
						</div>
						{/*
						<div 
						  className={classNames("input-group-text btn", {
						  	'input-group-text-active' : priceLesserChoice === "lte"
						  })}
						  id="lte"
						  onClick={ () => {
						  	handlePriceLesserButtons("lte")
						  }}
						>
						<span className="fa fa-rupee-sign mr-2"></span>
						<span className="fa fa-less-than-equal"></span>
						</div>
*/}
					</div>
					<input
						type="text"
						className="form-control"
						placeholder="Enter Price"
						onChange={(e) => {
							handlePriceLesserChoiceValue(e.target.value)
						}}
						value={priceLesserChoiceValue}
						disabled={priceLesserChoice === null}
						pattern="\d+"
					/>
				</div>
			</div>
		</div>
	)

	const startTimeFilter = (
		<div className="row mt-3">
			{/*
			<div className="col-md">
				<div className="input-group">
					<div className="input-group-prepend">
						<div 
						  className={classNames("input-group-text btn", {
						  	'input-group-text-active' : startTimeGreaterChoice === "gt"
						  })}
						  id="gt"
						  onClick={ () => {
						  	handleStartTimeGreaterButtons("gt")
						  }}
						>
						<span className="fa fa-hourglass-start mr-2"></span>
						<span className="fa fa-greater-than"></span>
						</div>

						<div 
						  className={classNames("input-group-text btn", {
						  	'input-group-text-active' : startTimeGreaterChoice === "gte"
						  })}
						  id="gte"
						  onClick={ () => {
						  	handleStartTimeGreaterButtons("gte")
						  }}
						>
						<span className="fa fa-hourglass-start mr-2"></span>
						<span className="fa fa-greater-than-equal"></span>
						</div>
					</div>
					<DateTimePicker
					  disableClock={true}
					  type="text" 
					  className="form-control" 
					  onChange={(e)=>{
					  	handleStartTimeGreaterChoiceValue(e)
					  }}
					  value={startTimeGreaterChoiceValue}
					  disabled={startTimeGreaterChoice === null}
					/>
				</div>
			</div>
*/}


			<div className="col-md">
				<div className="input-group">
					<div className="input-group-prepend">
						<div
							className={classNames("input-group-text btn", {
								'input-group-text-active': startTimeEqualChoice === "eq"
							})}
							onClick={() => {
								handleStartTimeEqualButton("eq")
							}}
							id="eq"
						>
							{/*
						<span className="fa fa-hourglass-start mr-2"></span>
						<span className="fa fa-equals"></span>
*/}
							Date
						</div>

						<DateTimePicker
							disableClock={true}
							type="text"
							className="form-control no-time"
							onChange={(e) => {
								handleStartTimeEqualChoiceValue(e)
							}}
							value={startTimeEqualChoiceValue}
							disabled={ /* startTimeEqualChoice === null */ false}
						/>
					</div>
				</div>
			</div>

			{/*			
			<div className="col-md">
				<div className="input-group">
					<div className="input-group-prepend">
						<div 
						  className={classNames("input-group-text btn", {
						  	'input-group-text-active' : startTimeLesserChoice === "lte"
						  })}
						  id="lt"
						  onClick={ () => {
						  	handleStartTimeLesserButtons("lte")
						  }}
						>
						<span className="fa fa-hourglass-start mr-2"></span>
						<span className="fa fa-less-than-equal"></span>
						Start Time Before
						</div>

						<div 
						  className={classNames("input-group-text btn", {
						  	'input-group-text-active' : startTimeLesserChoice === "lt"
						  })}
						  id="lte"
						  onClick={ () => {
						  	handleStartTimeLesserButtons("lt")
						  }}
						>
						<span className="fa fa-hourglass-start mr-2"></span>
						<span className="fa fa-less-than"></span>
						</div>
					</div>
					<DateTimePicker
					  disableClock={true}
					  type="text" 
					  className="form-control" 
					  onChange={(e)=>{
					  	handleStartTimeLesserChoiceValue(e)
					  }}
					  value={startTimeLesserChoiceValue}
					  disabled={startTimeLesserChoice === null}
					/>
				</div>
			</div>
*/}
		</div>
	)

	const nameFilter = (
		<div className="row mt-3">
			<div className="col-md-5 ">
				<div className="input-group">
					<div className="input-group-prepend">
						<span className="input-group-text">Name to add</span>
					</div>
					<input
						type="text"
						className="form-control"
						placeholder="Name"
						onChange={(e) => { changeName(e.target.value) }}
						value={inpName}
					/>
					<div
						className="ml-2 btn btn-primary rounded-circle"
						onClick={() => {
							addName();
						}}
					>
						<span className="fa fa-plus"></span>
					</div>
				</div>
			</div>
			<div className="col-md-7 clearfix overflow-x-scroll">
				{
					byName.map((name, ix) => {
						return (
							<h2 className="float-left mr-2" key={`${name}-${ix}`}>
								<span
									className="badge badge-primary"
									style={{
										maxWidth: '100%'
									}}
								>
									<span className="mr-2 fa fa-times align-top" onClick={() => {
										removeName(ix)
									}}></span>
									{name}
								</span>
							</h2>
						)
					})
				}
			</div>
		</div>
	)

	const displayResults = rides && rides.length > 0 ? rides.map((ride, ix) => {
		const available = ride.capacity - ride.totalBooked;
		if (showLess) {
			return (
				<div className="card mb-2 col-12 col-sm-6 col-md-4">
					<div className="row mx-0 p-3">
						<div className="col-md-10">
							<h4 className="">{ride.name}</h4>
							<div className="row">
								<div className="col-md-4">
									<h6>Ride Type: </h6>
								</div>
								<div className="col-md-7">
									<h6><strong>{ride.rideType}</strong></h6>
								</div>
							</div>
							<div className="row">
								<div className="col-md-4">
									<h6>Location: </h6>
								</div>
								<div className="col-md-7">
									<h6><em>{ride.location}</em></h6>
								</div>
							</div>
							<div className="row">
								<div className="col-md-4">
									<h6>Start Time: </h6>
								</div>
								<div className="col-md-7">
									<h6><em>{YMDHMS(ride.startTime)}</em></h6>
								</div>
							</div>
							<div className="row">
								<div className="col-md-4">
									<h6>End Time: </h6>
								</div>
								<div className="col-md-7">
									<h6><em>{YMDHMS(ride.endTime)}</em></h6>
								</div>
							</div>
							<div className="row">
								<div className="col-md-4">
									<h6>Price: </h6>
								</div>
								<div className="col-md-7">
									<h6><em><span className="fa fa-rupee-sign"></span>{ride.price}</em></h6>
								</div>
							</div>
						</div>
						<div className="col-md-2 align-self-center">
							<div className="row justify-content-center mt-2">
								<div className={`btn ${available ? "btn-primary" : "btn-disabled"}`}>
									{available ? <Link
										to={{
											pathname: ride.rideType === "School" ? "/bulkbook" : "/book",
											state: { rideId: ride.id, rideName: ride.name, ridePrice: ride.price }
										}}
										className="text-light"
									>
										Book Now
									</Link> : null}
								</div>
							</div>
						</div>
					</div>
				</div>
			)
		} else {
			return (
				<div className="card mb-2 col-12 col-sm-6 col-md-4">
					<div className="row mx-0 p-3">
						<div className="col-md-2">
							<img src={ferrySample} width={'100%'} height="auto" className="p-2" />
						</div>
						<div className="col-md-6">
							<h4 className="">{ride.name}</h4>
							<p className="text-muted">{ride.description}</p>
						</div>
						<div className="col-md-4">
							<div className="row justify-content-end">
								<div className="col-md-4">
									<h6>Ride Type: </h6>
								</div>
								<div className="col-md-7">
									<h6><strong>{ride.rideType}</strong></h6>
								</div>
							</div>
							<div className="row justify-content-end">
								<div className="col-md-4">
									<h6>Location: </h6>
								</div>
								<div className="col-md-7">
									<h6><em>{ride.location}</em></h6>
								</div>
							</div>
							<div className="row justify-content-end">
								<div className="col-md-4">
									<h6>Start Time: </h6>
								</div>
								<div className="col-md-7">
									<h6><em>{YMDHMS(ride.startTime)}</em></h6>
								</div>
							</div>
							<div className="row justify-content-end">
								<div className="col-md-4">
									<h6>End Time: </h6>
								</div>
								<div className="col-md-7">
									<h6><em>{YMDHMS(ride.endTime)}</em></h6>
								</div>
							</div>
							<div className="row justify-content-end">
								<div className="col-md-4">
									<h6>Capacity: </h6>
								</div>
								<div className="col-md-7">
									<h6><em>{ride.totalBooked} / {ride.capacity}</em></h6>
								</div>
							</div>
							<div className="row justify-content-end">
								<div className="col-md-4">
									<h6>Price: </h6>
								</div>
								<div className="col-md-7">
									<h5><em className="badge badge-secondary"><span className="fa fa-rupee-sign"></span>{ride.price}</em></h5>
								</div>
							</div>
							<div className="row justify-content-center mt-2">
								<div className={`btn ${available ? "btn-primary" : "btn-disabled"}`}>
									{available ? <Link
										to={{
											pathname: ride.rideType === "School" ? "/bulkbook" : "/book",
											state: { rideId: ride.id, rideName: ride.name, ridePrice: ride.price }
										}}
										className="text-light"
									>
										Book Now
									</Link> : "Booking Closed"}
								</div>
							</div>
						</div>
					</div>
				</div>
			)
		}
	}) : fetching ? (
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
				<h2 className="">Filters</h2>
				<hr className="my-3" />
				<div className="w-100">
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
				<div className="d-md-flex">
					<div className="w-100 d-flex justify-content-start">
						<div
							className="btn btn-primary mx-3"
							onClick={() => {
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

			<div className="container mt-5 rounded bg-light p-3">
				<h2 className="">Results</h2>
				<hr className="my-3" />
				<div className='row'>
					{displayResults}
				</div>
			</div>
		</div>
	)
}

export default withClient(SearchRides);