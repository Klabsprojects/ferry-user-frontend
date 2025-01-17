import React, { useState } from 'react';

import Booking from './Booking.js';

const BookingHome = (props) => {
	return (
		<div className="container">
			<div className="row">
				<Booking {...props} />
			</div>
		</div>
	);
}

export default BookingHome;