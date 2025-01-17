export const LOGIN_MUTATION = `
  mutation($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      id
      fullName
      email
      password
      phone
      age
      isAdmin
    }
  }
`;

export const CANCEL_BOOKING = `
  mutation($bookingIds: [ID!]!, $transactionId: String!, $withinSameDay: Boolean) {
    cancelBooking(bookingIds: $bookingIds, transactionId: $transactionId, withinSameDay: $withinSameDay) {
      id
    }
  }
`;


export const RESCHEDULE_BOOKING = `
mutation($rideId: ID!,$prevRideId: ID!,$bookingId: ID!) {
  rescheduleBooking(input: {
    rideId: $rideId,prevRideId: $prevRideId,bookingId: $bookingId,
  }) {
    id
    rideId
    riders {
      fullName
      age
      phone
      aadhar
      gender
    }
    transactionId
    timestamp
    status
    rideType
    startTime
    endTime
  }
}
`;


export const CANCEL_BULK_BOOKING = `
  mutation($bookingIds: [ID!]!, $transactionId: String!) {
    cancelBulkBooking(bookingIds: $bookingIds, transactionId: $transactionId) {
      id
    }
  }
`;

export const SIGNUP_MUTATION = `
  mutation($email: String!, $password: String!, $fullName:String, $phone:String, $age:String) {
    register(input: {
      email: $email, password: $password, fullName: $fullName, phone: $phone, age: $age
    }) {
      id
      fullName
      email
      age
      phone
    }
  }
`;
export const CREATE_BOOKING = `
  mutation($rideId: ID!, $riders: [createBookingInputRider!]!, $transactionId: String!, $tcount: Int!) {
    createBooking(input: {
      rideId: $rideId, riders: $riders, transactionId: $transactionId, tcount: $tcount
    }) {
      id
      rideId
      riders {
        fullName
        age
        phone
        aadhar
        gender
      }
      transactionId
      timestamp
      status
      tcount
    }
  }
`;

export const CREATE_BULK_BOOKING = `
  mutation(
    $rideId: ID!,
    $bookerName: String!,
    $riderCount: Int!,
    $schoolName: String!,
    $schoolDistrict: String!,
    $aadhar: String!,
    $transactionId: String!,
    $image: Upload
  ) {
    createBulkBooking(input: {
      rideId: $rideId,
      bookerName: $bookerName,
      riderCount: $riderCount,
      schoolName: $schoolName,
      schoolDistrict: $schoolDistrict,
      aadhar: $aadhar,
      transactionId: $transactionId,
      image: $image
    }) {
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
    }
  }
`;
export const RESCHEDULE_BULK_BOOKING = `
  mutation(
    $rideId: ID!,
    $prevRideId: ID!,
    $bookingId: ID!,
  ) {
    rescheduleBulkBooking(input: {
      rideId: $rideId,
      prevRideId: $bookingId,
      bookingId: $bookingId,
    }) {
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
    }
  }
`;

export const UPDATE_USER = `
  mutation($userId: ID!, $email: String, $password: String, $fullName: String, $age: Int,  $phone: String, $aadhar: String) {
    updateUser(update: {
      userId: $userId, email: $email, password: $password, fullName: $fullName, age: $age, phone: $phone, aadhar: $aadhar
    }) {
      email
    }
  }
`;

export const LOGOUT_MUTATION = `
  mutation {
    logout
  }
`;

