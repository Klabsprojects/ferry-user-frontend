export const CHECK_AADHAR = `
  query($aadhar : String){
    checkAadhar(aadhar: $aadhar)
  }
`

export const CHECK_PHONE = `
  query($phone : String){
    checkPhone(phone: $phone)
  }
`

export const USER_EXISTS_QUERY = `
  query($email: String!) {
    userExists(email: $email)
  }
`;

// for now get all rides, later get most popular ones
export const GET_FEATURED_RIDES = `
  query{
  	getRides{
  		id
  		name
  		description
      location
  		price
  		startTime
  		endTime
  		capacity
  	}
  }
`


// get all bookings
export const GET_BOOKING_HISTORY = `
  query{
  	getBookingHistory{
		id
		rideId
		bookerId
		riders {
			fullName
			age
      phone
      aadhar
      gender
		}
		transactionId
		timestamp
    startTime
    rideType
    endTime
		status
    tcount
  }
}
`

export const GET_BULK_BOOKING_HISTORY = `
  query{
    getBulkBookingHistory{
      id
      rideId
      bookerId
      bookerName
      riderCount
      schoolName
      schoolDistrict
      aadhar
      transactionId
      timestamp
      status
      fileUrl
  }
}
`

export const GET_USERS = `
  query{
  	getUsers{
      id
      email
      aadhar
      password
      fullName
      age
      phone
      isAdmin
  }
}
`

export const SEARCH_RIDES = `
  query(
    $byRideId: [ID],
    $byName: [String],
    $byPrice: [Int],
    $byPriceLesser: Int,
    $byPriceGreater: Int,
    $byPriceLesserEqual: Int,
    $byPriceGreaterEqual: Int,
    $byLocation: [String],
    $byStartTime: [Date],
    $byStartTimeLesser: Date,
    $byStartTimeLesserEqual: Date,
    $byStartTimeGreater: Date,
    $byStartTimeGreaterEqual: Date,
    $byCapacity: [Int],
    $byCapacityLesser: Int,
    $byCapacityGreater: Int,
    $byCapacityLesserEqual: Int,
    $byCapacityGreaterEqual: Int,
    $byRideType: [String],
    $withBooked: Boolean
  ){
    getRides(
      byRideId: $byRideId,
      byName: $byName,
      byPrice: $byPrice,
      byPriceLesser: $byPriceLesser,
      byPriceGreater: $byPriceGreater,
      byPriceLesserEqual: $byPriceLesserEqual,
      byPriceGreaterEqual: $byPriceGreaterEqual,
      byLocation: $byLocation,
      byStartTime: $byStartTime,
      byStartTimeLesser: $byStartTimeLesser,
      byStartTimeLesserEqual: $byStartTimeLesserEqual,
      byStartTimeGreater: $byStartTimeGreater,
      byStartTimeGreaterEqual: $byStartTimeGreaterEqual,
      byCapacity: $byCapacity,
      byCapacityLesser: $byCapacityLesser,
      byCapacityGreater: $byCapacityGreater,
      byCapacityLesserEqual: $byCapacityLesserEqual,
      byCapacityGreaterEqual: $byCapacityGreaterEqual,
      byRideType: $byRideType,
      withBooked: $withBooked
    ){
      id
      name
      description
      price
      actualPrice
      sgst
      igst
      ttdc
      tnmb
      location
      startTime
      endTime
      capacity
      status
      rideType
      totalBooked
    }
  }
`