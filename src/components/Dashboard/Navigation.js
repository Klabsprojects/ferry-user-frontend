import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { ProSidebar, Menu, MenuItem, SubMenu, SidebarHeader, SidebarFooter, SidebarContent} from 'react-pro-sidebar';
import logo from '../../assets/img/ferry_app_icon.png'


import { FiUser,  FiSearch, FiColumns, FiAlignJustify, FiBookOpen } from 'react-icons/fi'

import { AiOutlineLogout } from 'react-icons/ai'



const Navigation = () => {
	const [collapsed,setCollapsed] = useState(false);

useEffect(() => {
	if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)){
		console.log('mobile');
		//setCollapsed(true);
		//setCollapsed(false);
	  }else{
		console.log('desktop');
		//setCollapsed(false);
		}
});

	return (
		<ProSidebar collapsed={collapsed}>
			<SidebarHeader>
				<div className="py-3 text-center">
					{
						collapsed ? (
							<>
								<div 
								 className="d-inline-block align-middle"
								 onClick={() => {setCollapsed(!collapsed)}}
								>
									<FiAlignJustify className="burger"/>
								</div>
							</>
						) : (
							<>
								<img className="mr-2" src={logo} width="40%"/>
								<div 
								 className="d-inline-block ml-2 align-middle"
								 onClick={() => {setCollapsed(!collapsed)}}
								>
									<FiAlignJustify className="burger"/>
								</div>
							</>
						)
					}
				</div>
			</SidebarHeader>
			<SidebarContent>
				<Menu iconShape="square">
					<MenuItem icon={<FiColumns />}>
				    	Dashboard
				    	<Link to='/dashboard'/>
					</MenuItem>
					<MenuItem icon={<FiBookOpen />}>
		                My Tickets
		                <Link to='/bookinghistory' />
		            </MenuItem>
				    {/*<MenuItem icon={<FiColumns />}>
				    	Dashboard
				    	<Link to='/dashboard'/>
				</MenuItem>*/}
					<MenuItem icon={<FiColumns />}>
					    Search Rides
				    	<Link to='/searchride'/>
				    </MenuItem>
				    <MenuItem icon={<FiUser />}>
				    	My Profile
				    	<Link to='/profile'/>
				    </MenuItem>
		            <MenuItem icon={<FiBookOpen />}>
		                My Bulk Bookings
		                <Link to='/bulkbookinghistory' />
		            </MenuItem>
		        	{/* <MenuItem icon={<FiSearch />}>
		               Search for Rides 
		              <Link to='/search'/>
				</MenuItem> */}
				</Menu>
			</SidebarContent>
			<SidebarFooter>
				<Menu iconShape="square">
				    <MenuItem icon={<AiOutlineLogout />}>
				    	Logout
				    	<Link to='/logout'/>
				    </MenuItem>
				  </Menu>
			</SidebarFooter>
		</ProSidebar>
	)
}

export default Navigation;