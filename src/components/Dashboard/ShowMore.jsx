import { toPairs } from 'lodash';
import React, { useState } from 'react';
import { Link } from 'react-router-dom'
import Swal from 'sweetalert2';
import logoFull from '../../assets/img/logo-full.png';

export default ({ ride, CheckDay, PopupCheckDay, ferrySample, YMDHMS, ...props }) => {
    const available = ride.capacity - ride.totalBooked;
        const alertPopup = () => {
            Swal.fire({
            html: '<b><p style="color: red; text-align: left;">After Making Payment, you will get booking confirmation. Then website will be redirected to My Tickets page. Wait until your ticket details loaded. Then click on view ticket and confirm the details. If ticket details not available send email to psckfsonline@gmail.com with your order id / Payment ID within 24hrs. <br><br>For Better experience use this application in desktop/ laptop.</p></b>',
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
            <div className="row mx-0 p-0">
                <div className="col-5 p-0 m-0 pr-2">
                    <div className="row">
                        <div className="col-md-12 ferrysample">
                            <img src={ferrySample} width={'100%'} height="auto" style={{
                                height: "14vh",

                            }} className="p-0" />
                        </div>
                        <div className="col-md-12">
                            <p className="mb-0" style={{ fontSize: "0.8rem" }}>Location: <em>{ride.location}</em></p>
                            <p className="mb-0" style={{ fontSize: "0.8rem" }}>Date: <em>{YMDHMS(ride.startTime).substring(0, 10)}</em></p>
                            <p className="mb-0" style={{ fontSize: "0.8rem" }}>Start: <em>{YMDHMS(ride.startTime).substring(11, 16)}</em></p>
                            <p className="mb-0" style={{ fontSize: "0.8rem" }}>End: <em>{YMDHMS(ride.endTime).substring(11, 16)}</em></p>
                        </div>
                    </div>
                </div>
                <div className="col-md-7">
                    <div className="row justify-content-end">
                        <div className="col-md-12 px-0">
                            <h6 className="font-weight-bold">{ride.name}</h6>
                        </div>
                    </div>
                    <div className="row justify-content-end">
                        <div className="col-md-5 px-0">
                            <h6 className="mb-0" style={{ fontSize: "0.9rem" }}>Ride Type: </h6>
                        </div>
                        <div className="col-md-7 px-0">
                            <h6 className="mb-0" style={{ fontSize: "0.9rem" }}><strong>{ride.rideType}</strong></h6>
                        </div>
                    </div>
                    <div className="row justify-content-end">
                        <div className="col-md-5 px-0">
                            <h6 className="mb-0" style={{ fontSize: "0.9rem" }}>Available: </h6>
                        </div>
                        <div className="col-md-7 px-0">
                            <h6 className="mb-0" style={{ fontSize: "0.9rem" }}><em>{available}</em></h6>
                        </div>
                    </div>

                    <div className="row justify-content-end">
                        <div className="col-md-5 px-0">
                            <h6 className="mb-0" style={{ fontSize: "0.9rem" }}>Price: </h6>
                        </div>
                        <div className="col-md-7 px-0">
                            <h5><em className="badge badge-secondary"><span className="fa fa-rupee-sign"></span>{ride.price}</em></h5>
                        </div>
                    </div>
                    <div className="row justify-content-center mt-4">
                        <div className={`btn ${available ? "btn-primary" : "btn-disabled"}`} onClick={available === 0 ? null : () => PopupCheckDay(ride.startTime)}>
                            {
                                available ? (
                                    <Link onClick={alertPopup}
                                    to={CheckDay(ride.startTime) ?
                                        !props.toLogin ?
                                            {
                                                pathname: ride.rideType === "School" ? "/bulkbook" : "/book",
                                                state: { rideId: ride.id, rideName: ride.name, ridePrice: ride.price }
                                            } : {
                                                pathname: "/auth",
                                                state: { rideId: ride.id, rideName: ride.name, ridePrice: ride.price, rideType: ride.rideType }
                                            } : NaN
                                    }
                                        className="text-light"
                                    >
                                        Book Now
                                    </Link>) : "Booking Closed"
                            }
                        </div>

                    </div>
                </div>
            </div>
        </div>
    )
}