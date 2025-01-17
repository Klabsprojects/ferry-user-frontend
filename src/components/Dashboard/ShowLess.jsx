import React from 'react'
import { Link } from 'react-router-dom'
import Swal from 'sweetalert2';
import logoFull from '../../assets/img/logo-full.png';

export default ({ ride, CheckDay, YMDHMS, ...props }) => {
    const available = ride.capacity - ride.totalBooked;
    const alertPopup = () => {
        Swal.fire({
        html: '<b><p style="color: red; text-align: left;">After Making Payment, you will get booking confirmation. Then website will be redirected to My Tickets page. Wait until your ticket details loaded. Then click on view ticket and confirm the details. If ticket details not available send email to psckfsonline@gmail.com with your order id / Payment ID within 24hrs.<br><br>For Better experience use this application in desktop/ laptop.</p></b>',
        imageUrl: logoFull,
        imageWidth: "150px",
        title: 'Terms & Conditions',
        confirmButtonText: 'Accept',
        showCancelButton: true,
        heightAuto: false,
        backdrop:true,
        allowOutsideClick: false,
        allowEscapeKey: false,
        customClass: {
            text: 'swal-css-class',
          }
        }).then((result) => {
            if (result.dismiss !== 'cancel') {
                console.log('Confrimed');
            }
           else
            {
                console.log('Canceled');
                window.location.href = "/searchride";
            }
        })
    }
    return (
        <div className="card mb-2 p-2 col-4">
            <div className="row ">
                <div className="col-md-12">
                    <h5 className="font-weight-bold">{ride.name}</h5>
                    <div className="row">
                        <div className="col-md-6">
                            <p className="mb-0">Ride Type: </p>
                        </div>
                        <div className="col-md-6">
                            <p className="mb-0"><strong>{ride.rideType}</strong></p>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-6">
                            <p className="mb-0">Location: </p>
                        </div>
                        <div className="col-md-6">
                            <p className="mb-0"><em>{ride.location}</em></p>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-6">
                            <p className="mb-0">Start Time: </p>
                        </div>
                        <div className="col-md-6">
                            <p className="mb-0"><em>{YMDHMS(ride.startTime)}</em></p>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-6">
                            <p className="mb-0">End Time: </p>
                        </div>
                        <div className="col-md-6">
                            <p className="mb-0"><em>{YMDHMS(ride.endTime)}</em></p>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-6">
                            <p className="mb-0">Price: </p>
                        </div>
                        <div className="col-md-6">
                            <p className="mb-0"><em><span className="fa fa-rupee-sign"></span>{ride.price}</em></p>
                        </div>
                    </div>
                </div>
                <div className="col-md-12 align-self-center">
                    <div className="row justify-content-center my-2">
                        <div className={`btn ${available ? "btn-primary" : "btn-disabled"}`} onClick={() => CheckDay(ride.startTime)}>

                            {available ? <Link onClick={alertPopup}
                                to={!props.toLogin ?
                                    {
                                        pathname: ride.rideType === "School" ? "/bulkbook" : "/book",
                                        state: { rideId: ride.id, rideName: ride.name, ridePrice: ride.price }
                                    } : {
                                        pathname: "/auth",
                                        state: { rideId: ride.id, rideName: ride.name, ridePrice: ride.price, rideType: ride.rideType }
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