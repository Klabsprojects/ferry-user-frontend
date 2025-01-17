import React from 'react';
import { useCookies } from 'react-cookie';
import { makeRequest } from '../client';
import { GET_USERS } from '../graphql/queries'
import { Link } from 'react-router-dom';

// import lazy
const Navigation = React.lazy(() => import('../components/Dashboard/Navigation'));
const DashboardHome = React.lazy(() => import('../components/Dashboard/DashboardHome.js'));
const DashboardHome1 = React.lazy(() => import('../components/Dashboard/DashboardHome1.js'));
const SearchHome = React.lazy(() => import('../components/Dashboard/SearchHome.js'));
const BookingHome = React.lazy(() => import('../components/Dashboard/BookingHome.js'));
const SearchRides = React.lazy(() => import('../components/Dashboard/SearchRides'));
const BookingHistory = React.lazy(() => import('../components/Dashboard/BookingHistory'));
const BulkBookingHistory = React.lazy(() => import('../components/Dashboard/BulkBookingHistory'));
const GenerateTicket = React.lazy(() => import('../components/Dashboard/GenerateTicket'))
const GenerateBulkTicket = React.lazy(() => import('../components/Dashboard/GenerateBulkTicket'))
const Profile = React.lazy(() => import('../components/Dashboard/Profile'))
const BulkBooking = React.lazy(() => import('../components/Dashboard/BulkBooking'))

const Dashboard = ({ location, props }) => {
	const { pathname } = location;
	return (
		<div className="d-flex">
			<div className="h-100">
				<Navigation />
			</div>
			<div id="Content" className="w-100 overflow-y-scroll">
				{
					pathname === "/dashboard" && (<BookingHistory />)
				}
				{
					pathname === "/searchride" && (<SearchHome />)
				}
				{
					pathname === "/profile" && (<Profile />)
				}
				{
					pathname === "/book" && (<BookingHome {...location.state} />)
				}
				{
					pathname === "/bulkbook" && (<BulkBooking {...location.state} />)
				}
				{
					pathname === "/bookinghistory" && (<DashboardHome1 />)
				}
				{
					pathname === "/bulkbookinghistory" && (<BulkBookingHistory />)
				}
        		{
					pathname === "/search" && (<SearchRides />)
				}
				{
					pathname === "/ticket" && (<GenerateTicket {...location.state} />)
				}
				{
					pathname === "/bulkticket" && (<GenerateBulkTicket {...location.state} />)
				}
			</div>
		</div>
	)
}

export default Dashboard;