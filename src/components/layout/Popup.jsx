import classNames from 'classnames'
import React from 'react'
import DateTimePicker from 'react-datetime-picker'
import Select from 'react-select'
import ferrySample from '../../assets/img/ferrysample.jpeg'

function Popup({ rides, onSubmit, onCancel, handleStartTimeEqualChoiceValue, startTimeEqualChoiceValue,resetFilters,submitSearch }) {
    const YMDHMS = (datetime) => {
        const pad2 = (n) => n < 10 ? '0' + n : n
        var date = new Date(datetime);
        return `${pad2(date.getDate())}/${pad2(date.getMonth() + 1)}/${date.getFullYear()} ${pad2(date.getHours())}:${pad2(date.getMinutes())}:${pad2(date.getSeconds())}`
    }
    const [selected, setSelected] = React.useState("")
    console.log(rides)
    const options = rides && rides.length ? rides.map(v => (
        {
            label: <div className="select-card d-flex align-items-center">
                <div className="card-image_container col-3">
                    <img src={ferrySample} alt="" />
                </div>
                <div className="card-data_container d-flex flex-wrap">
                    <h5 className="data col-6 mb-0" style={{color:"rgba(0,0,0,.7)"}}>{v.name + "-" + v.location}</h5>
                    <h5 className="data col-6 mb-0" style={{color:"rgba(0,0,0,.7)"}}>{YMDHMS(v.startTime).substring(0, 10)}</h5>
                    <h5 className="data col-6 mb-0" style={{color:"rgba(0,0,0,.7)"}}>{YMDHMS(v.startTime).substring(11, 16)} - {YMDHMS(v.endTime).substring(11, 16)}</h5>
                    {/* <h5 className="data col-6"></h5> */}
                </div>
            </div>,
            value: v.id
        }
    )) : []
    return (
        <div id="popup_container">
            <div className="popup">
            <h3>Select ride to reschedule</h3>

                <div className="row mt-3">
                    <div className="col-md">
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
                                // clearIcon={null}
                                onChange={(e) => {
                                    handleStartTimeEqualChoiceValue(e)
                                }}
                                value={startTimeEqualChoiceValue}
                                />
                                </div>
                                	</div>
                                </div>
                        <div className="d-md-flex mt-3 mb-3">
                            <div className="w-100 d-flex justify-content-start">
                                <div
                                    className="btn btn-primary mx-3 "

                                    onClick={() => {
                                        // setFetching(true)
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
                                {/* <h4 className="d-inline-block mr-2">{showLess ? 'Show More' : 'Show Less'}</h4> */}
                                <label className="switch">
                                    <input
                                        type="checkbox"
                                        onClick={() => {
                                            // setShowLess(!showLess)
                                        }}
                                    />
                                    <span className="slider round"></span>
                                </label>
                            </div>
                        </div>

                <Select options={options}
                    onChange={e => {
                        setSelected(e.value)
                    }}
                    styles={
                        {
                            container: styles => ({ ...styles, height: '50px', padding: '0' }),
                            control: styles => ({ ...styles, height: '50px', padding: '0' }),
                            option: (styles, { data, isDisabled, isFocused, isSelected }) => {
                                console.log("ddd", data)
                                return {
                                    ...styles,
                                    //   backgroundColor: '#aaa'
                                };
                            },
                        }
                    }
                />
                <button className="btn btn-primary mt-4 float-left" onClick={e => onSubmit(selected)}>Confirm</button>
                <button className="btn btn-danger mt-4 float-right" onClick={e => onCancel()}>Cancel</button>
            </div>
        </div>
    )
}

export default Popup
