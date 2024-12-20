import './MaintenanceComp.css'

export default function MaintenanceComp(props){
    return(
        <div className="maincomp-div">
            <div className="">
                <h2>Here are Your Maintenance Records:</h2>
                <div className="loadlist">
                    {props.maintenance.length > 0 ? (
                        <ul className='main-ul'>
                        {props.maintenance.map(m => (
                            <li key={m.id} className='main-li'>
                                <div className="main-li-top">
                                    <p><strong>Date:</strong> {m.date}</p> 
                                    <p><strong>Type:</strong> {m.type} </p>
                                    <p><strong>Price:</strong> ${m.price} </p>
                                    <p><strong>KM:</strong> {m.km}</p>
                                    <p><strong>Location:</strong> {m.location}</p>
                                </div>
                                <div className="main-li-button"><button onClick={() => props.deleteMaintenance(m.id)}>Delete</button></div>
                            </li>
                        ))}
                        </ul>
                    ) : (
                        <p>No maintenance records found for this car.</p>
                    )}
                    <div className='btnholder'>
                        <button onClick={() => props.fetchMaintenance(true)} disabled={props.loading} className='loadbtn'>
                            {props.loading ? 'Loading...' : 'Load More'}
                        </button>
                    </div>
                </div>

                <div className="bottom">
                    <div className="newMain-form">
                        <h3>New Maintenance?</h3>
                        {!props.addNewMaintenance && <button onClick={() => (props.setAddNewMaintenance(prev => !prev))} className='newbtn1 newMain-btn' >Add New Maintenance</button>}
                        {props.addNewMaintenance && 
                        <form onSubmit={props.addMaintenance}>
                            <label htmlFor="type">Type of Serivce:</label>
                            <select id="type" name="type" defaultValue="" value={props.selectedType} onChange={props.handleTypeChange} required>
                            <option value="" disabled>-- Select service --</option>
                            <option value="Oil Change">Oil Change</option>
                            <option value="Engine Air Filter">Engine Air Filter</option>
                            <option value="Transmisson Oil">Transmisson Oil</option>
                            <option value="Coolant">Coolant</option>
                            <option value="other">Other</option>
                            </select>
                            {props.selectedType === "other" && (
                                <>
                                <label htmlFor="custom">Type Service Name:</label>
                                <input id="custom" type="text" name="custom" placeholder="Enter service name" required/>
                                </>
                            )}
                            
                            <label htmlFor="date">Date of Service:</label>
                            <input id="date" type="date" name="date" required></input>
                        
                            <label htmlFor="km">Current KM:</label>
                            <input id="km" type="number" name="km" placeholder="32000" required></input>
                            
                            <label htmlFor="price">Price of serivce:</label>
                            <input id="price" type="float" name="price" placeholder="150" required></input>
                            
                            <label htmlFor="location">Location of maintence:</label>
                            <input id="location" type="text" name="location" placeholder="BMW Toronto" required></input>

                            <div className="newformbutton">
                                <button className='newAdd newMain-btn'>Add</button>
                                <button onClick={() => props.setAddNewMaintenance(prev => !prev)} className='newCancel newMain-btn' >Cancel</button>
                            </div>
                        </form>}
                        </div>

                        <div className="upcoming">
                            <h2 className='uh2'>Here are your Upcoming Maintenance:</h2>
                            <p className='up'>{props.upcomingMessage}</p>
                        </div>
                    </div>
                </div>
        </div>

    )
}