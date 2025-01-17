import React, { useState, useEffect,useRef } from 'react';
import { withAwesomeClient } from '../../client';
import { CREATE_BULK_BOOKING } from '../../graphql/mutations';
import { SEARCH_RIDES } from '../../graphql/queries';
import Swal from 'sweetalert2';
import logoFull from '../../assets/img/logo-full.png';
import { Link, useHistory } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import { postRequest } from '../../utils/requests';
import config from '../../config';

const BulkBooking = ({makeRequest, ...props}) => {

	// if path changed to /book
	const history = useHistory();
	console.log(props.rideId)
	if( !props.rideId ){
		history.goBack();
	}

	const fileRef = useRef(null);

	const [cookies, removeCookie] = useCookies();

	const [bookerName, setBookerName ] = useState("")
	const [riderCount, setRiderCount ] = useState("")
	const [schoolName, setSchoolName ] = useState("")
	const [schoolDistrict, setSchoolDistrict ] = useState("")
	const [aadhar, setAadhar ] = useState("")
	const [fileName, setFileName ] = useState("Choose File")

	const [rideId, setRideId] = useState(props.rideId);
	const [bookerId, setBookerId] = useState();

	const [curIdx, setCurIdx] = useState(0);
	const [active, setActive] = useState("");
	const [prev, setPrev] = useState("active");
	const [globalIndex, setGlobalIndex] = useState(0);
	const [unitPrice, setUnitPrice] = useState(parseInt(props.ridePrice));
	const [totalPrice, setTotalPrice] = useState(parseInt(unitPrice));

	const [submitting,setSubmitting] = useState(false)

	async function displayRazorpay() {

		const res = await loadScript('https://checkout.razorpay.com/v1/checkout.js');

		if(!res) {
			alert('Razorpay SDK failed to load.')
			return
		}

		var amount = ((totalPrice*parseInt(riderCount))+(totalPrice*parseInt(riderCount)*0.025))*100;
		var finalAmount = amount.toString();

		const data = {finalAmount: finalAmount};

		const url = config.backendUrl + "/razorpay";

		const response = await postRequest(url, data).catch((err)=>{
			Swal.fire({
				imageUrl:logoFull,
				imageWidth: "150px",
				title: 'Error',
				text: 'Something went wrong.',
				confirmButtonText: 'OK',
				heightAuto: false
			});
		});

		if(response.status === 200)
		{
			const orderId = response.data.id;
			var options = {
				"key": process.env.RAZORPAY_KEY_ID || config.razor_key_id, // Enter the Key ID generated from the Dashboard
				"amount": response.data.amount, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
				"currency": response.data.currency,
				"name": "Poombuhar Shipping Corporation Kanyakumari Ferry Service",
				"description": "Payment for Ride Booking",
				"order_id": response.data.id,
				"handler": function (response){
					bookTicket(orderId);
				},
				"theme": {
					"color": "#3399cc"
				}
			};
	
			const paymentObject = new window.Razorpay(options);
			paymentObject.open();
		}
	}

	function loadScript(src) {
		return new Promise(resolve => {
			const script = document.createElement('script');
			script.src = src;
			script.onload = () => {
				resolve(true);
			}
			script.onerror = () => {
				resolve(false);
			}
			document.body.appendChild(script);
		})
	}

	const handleSubmit = async e => {
		e.preventDefault();
		const { getRides : rideCapacityCheck } = await makeRequest(SEARCH_RIDES, {withBooked: true, byRideId: [rideId]})
		if(rideCapacityCheck[0].totalBooked + Number(riderCount) > rideCapacityCheck[0].capacity ){
			Swal.fire({
				imageUrl:logoFull,
					imageWidth: "150px",
					imageHeight:"50px",
					title: `Capacity will be Exceeded! There are only ${rideCapacityCheck[0].capacity - rideCapacityCheck[0].totalBooked} seats left.`,
					confirmButtonText: 'Okay',
					heightAuto: false
				});
			return
		}
		displayRazorpay();
	}

	async function bookTicket(transactionId) {
		setSubmitting(true)
		const vars = {
			rideId,
			bookerName,
			riderCount: Number(riderCount),
			schoolName,
			schoolDistrict,
			aadhar,
			transactionId,
			image: fileRef.current.files[0]
		}
		const result = await makeRequest(CREATE_BULK_BOOKING, vars).catch((err) => {
			if(err.message === "booking will exceed capacity")
				Swal.fire({
					imageUrl:logoFull,
						imageWidth: "150px",
						imageHeight:"50px",
						title: 'Capacity Full!',
						confirmButtonText: 'Okay',
						heightAuto: false
					});
		});
		if(result){
			Swal.fire({
				imageUrl:logoFull,
					imageWidth: "150px",
					title: 'Success',
					text: 'Your ride has been booked!',
					confirmButtonText: 'OK',
					heightAuto: false
			}).then(() => {
				setSubmitting(false)
				history.push('/bulkbookinghistory');
			});
		}

	}

	const bookingCards = (
		<div>
		<div className="form-group">
		<label>
			<i className="fas fa-user" />
			&nbsp; Booker Name
			<input
			type="text"
			placeholder="Enter Booker Name"
			className='form-control mt-2'
			style={{padding:15,borderRadius:10,width:400}}
			onChange={e => setBookerName(e.target.value)}
			value={bookerName}
			required
			/>
		</label>
		</div>

		<div className="form-group">
		<label>
			<i className="fas fa-graduation-cap" />
			&nbsp; School Name
			<input
			type="text"
			placeholder="Enter School Name"
			className='form-control mt-2'
			style={{padding:15,borderRadius:10,width:400}}
			onChange={e => setSchoolName(e.target.value)}
			value={schoolName}
			required
			/>
		</label>
		</div>

		<div className="form-group">
		<label>
			<i className="fas fa-map-marker" />
			&nbsp; School District
			<input
			type="text"
			placeholder="Enter School District"
			className='form-control mt-2'
			style={{padding:15,borderRadius:10,width:400}}
			onChange={e => setSchoolDistrict(e.target.value)}
			value={schoolDistrict}
			required
			/>
		</label>
		</div>

		<div className="form-group">
			<label>
			<i className="fas fa-id-card" />
			&nbsp; Aadhar / Passport Number
			<input
				type="text"
				placeholder="Enter rider Aadhar / Passport Number"
				className='form-control mt-2'
				onChange={e => setAadhar(e.target.value)}
				value={aadhar}
				style={{padding:15,borderRadius:10,width:400}}
				required
			/>
			</label>
			<div className="">
              <small className="form-text text-muted mb-2 ml-1">
			  This will be verefied before entering inside the ferry.
              </small>
            </div>
		</div>

		<div className="form-group">
			<label>
			<i className="fas fa-hashtag" />
			&nbsp; Ride Count
			<input
				type="text"
				placeholder="Enter rider Ride Count"
				className='form-control mt-2'
				style={{padding:15,borderRadius:10,width:400}}
				onChange={e => setRiderCount(e.target.value)}
				value={riderCount}
				pattern="\d+"
			/>
			</label>
		</div>
		<i className="fas fa-image" />
		&nbsp; Letter Head (PNG / JPEG / PDF)
		<div className="custom-file">	
		
		  <input ref={fileRef} type="file" className="custom-file-input" id="bulkFile" onChange={ (e) => {setFileName(e.target.files[0].name)}}/>
		  <label className="custom-file-label" htmlFor="bulkFile" >{fileName}</label>
		</div>
		<div className="">
              <small className="form-text text-muted mb-2 ml-1">
			  Please upload school letter head with list of students coming for ride along with school seal
              </small>
            </div>
		<br />
		</div>
	);


	return (
		<div className="container bg-light mt-5 p-3 px-4 rounded-lg">
			<h1 className="mb-4"> Book your ride </h1>
			<div className="card-group">
				<div className="card">
					<div className="card-body">
						<h5 className="card-title">Book {props.rideName}</h5>
						<form onSubmit={handleSubmit}>
							{bookingCards}
							<br />
							<button 
							type='submit'
							className='btn btn-block btn-primary'
							style={{padding:10,borderRadius:10}}
							>
							{ submitting ? (
								<div class="d-flex justify-content-center">
								  <div class="spinner-border" role="status">
								    <span class="visually-hidden"></span>
								  </div>
								</div>
							) : "Pay"}
							</button>
						</form>
					</div>
				</div>
			</div>
		</div>
	)
}

export default withAwesomeClient(BulkBooking);