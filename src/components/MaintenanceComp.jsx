

export default function MaintenanceComp(props){
    return(
        <div>
            <h2>Maintenance Records</h2>
            {props.maintenance.length > 0 ? (
                <ul>
                {props.maintenance.map(m => (
                    <li key={m.id}>
                    {/* {m.date?.toDate ? m.date.toDate().toLocaleDateString() : "Invalid Date"} */}
                    <strong>Date:</strong> {m.date} <br />
                    <strong>Type:</strong> {m.type} <br />
                    <strong>Price:</strong> ${m.price} <br />
                    <strong>KM:</strong> {m.km} <br />
                    <strong>Location:</strong> {m.location} <br />
                    <button onClick={() => props.deleteMaintenance(m.id)}>Delete</button>
                    </li>
                ))}
                </ul>
            ) : (
                <p>No maintenance records found for this car.</p>
            )}
            <button onClick={() => (props.setAddNewMaintenance(prev => !prev))}>Add New Maintenance</button>
            {props.addNewMaintenance && <form onSubmit={props.addMaintenance}>
                <label htmlFor="type">Type of Serivce:</label>
                <select id="type" name="type" defaultValue="" value={props.selectedType} onChange={props.handleTypeChange} required>
                <option value="" disabled>-- Select service --</option>
                <option value="Oil Change">Oil Change</option>
                <option value="Engine Air Filter">Engine Air Filter</option>
                <option value="Transmisson Oil">Transmisson Oil</option>
                <option value="Coolant">Coolant</option>
                <option value="other">Other</option>
                </select>
                <br/>
                {props.selectedType === "other" && (
                    <>
                    <label htmlFor="custom">Type Service Name:</label>
                    <input id="custom" type="text" name="custom" placeholder="Enter service name" required/>
                    <br />
                    </>
                )}
                
                <label htmlFor="date">Date of Service:</label>
                <input id="date" type="date" name="date" required></input>
                <br/>
                <label htmlFor="km">Current KM:</label>
                <input id="km" type="number" name="km" placeholder="32000" required></input>
                <br/>
                <label htmlFor="price">Price of serivce:</label>
                <input id="price" type="float" name="price" placeholder="150" required></input>
                <br/>
                <label htmlFor="location">Location of maintence:</label>
                <input id="location" type="text" name="location" placeholder="BMW Toronto" required></input>
                <br/>
                <button>Add Maintence</button>
            </form>}
        </div>
    )
}