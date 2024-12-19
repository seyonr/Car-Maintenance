import React from 'react';
import { Link } from 'react-router-dom';
import './CarDisplayComp.css'

export default function CarDisplayComp(props) {
    return (
        <div className='card-main'>
            <h2>Hey, {props.name}!</h2>
            <h3>Tracked Cars:</h3>
            {props.cars.length > 0 ? (
                <ul>
                    {props.cars.map(car => (
                        <li key={car.id}>
                            <Link to={`/cars/maintence/${car.id}`} state={{ userID: props.userID }}>
                                {car.make} {car.model} ({car.year})
                            </Link>
                            <button onClick={() => props.deleteCar(car.id)}>Delete</button>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No cars found for this user.</p>
            )}
            <button onClick={() => props.setAddNewCar(prev => !prev)}>Add New Car</button>

            {props.addNewCar && (
                <form onSubmit={props.addCar}>
                    <label htmlFor="year">Year:</label>
                    <input id="year" type="number" name="year" placeholder="2003" required />
                    <br />
                    <label htmlFor="make">Make:</label>
                    <input id="make" type="text" name="make" placeholder="BMW" required />
                    <br />
                    <label htmlFor="model">Model:</label>
                    <input id="model" type="text" name="model" placeholder="M5" required />
                    <br />
                    <button style={{ marginTop: '20px' }} type="submit">
                        Add New Car
                    </button>
                </form>
            )}
        </div>
    );
}
