import React from 'react';
import { Link } from 'react-router-dom';
import './CarDisplayComp.css'
import cardImage from '../../img/cardisplay.svg'
import trash from '../../img/trash.svg'

export default function CarDisplayComp(props) {
    return (
        <div className='card-main'>
            <div className="about-section">
                <div className="about-left">
                    <h1>About</h1>
                    <p>
                        Hey there! To get started, add the vehicles you’d like to track maintenance for. This will help you stay on top of important service tasks like oil changes, tire rotations, and more. If you already have a vehicle added, simply start tracking its maintenance history to keep everything organized and ensure your vehicle stays in great shape. Why wait, start adding!
                    </p>
                </div>
                <div className="about-right">
                    <img src={cardImage} alt="Towing Image" />
                </div>
            </div>
            <div className='list-section'>
                <h2>Hey, {props.name}!</h2>
                <h3>Here is a list of all your tracked cars:</h3>
                {props.cars.length > 0 ? (
                    <ul className='carlist'>
                        {props.cars.map(car => (
                            <li key={car.id} className='carlist-li'>
                                <Link to={`/cars/maintence/${car.id}`} state={{ userID: props.userID }} className='carlist-link'>
                                    {car.year} {car.make} {car.model} 
                                </Link>
                                <button onClick={() => props.deleteCar(car.id) }><img src={trash} className='trash-img'/></button>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No cars found for this user.</p>
                )}
                <p className='loadP'>
                    Missing a few cars?
                    <button onClick={() => props.fetchUserData(true)} disabled={props.loading} className='loadBtn' >
                        {props.loading ? 'Loading...' : 'Load More'}
                    </button>
                </p>
            </div>

            <div className='addnewcar'>
                <h3>Want to Add a New Car?</h3>
                {!props.addNewCar && <button onClick={() => props.setAddNewCar(prev => !prev)} className='btn1'>Add New Car</button>}

                {props.addNewCar && (
                    <form onSubmit={props.addCar} className='addform'>
                        <label htmlFor="year">Year:</label>
                        <input id="year" type="number" name="year" placeholder="2003" required />

                        <label htmlFor="make">Make:</label>
                        <input id="make" type="text" name="make" placeholder="BMW" required />

                        <label htmlFor="model">Model:</label>
                        <input id="model" type="text" name="model" placeholder="M5" required />

                        <div className="addformbutton">
                            <button style={{ marginTop: '20px' }} type="submit" className='addbtn'>Add</button>
                            <button onClick={() => props.setAddNewCar(prev => !prev)} className='cancelbtn'>Cancel</button>
                        </div>
                    </form>
                )}
                </div>
        </div>
    );
}
