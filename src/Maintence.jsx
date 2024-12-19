import React, { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import { db } from "./FirebaseConfig";
import { doc, collection, getDocs, addDoc, Timestamp, deleteDoc } from "firebase/firestore";

export default function Maintenance() {
  const { carID } = useParams();
  const location = useLocation();
  const { userID } = location.state || {};
  const [maintenance, setMaintenance] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedType, setSelectedType] = useState("");

  useEffect(() => {
    fetchMaintenance();
  }, [userID, carID]);

  async function fetchMaintenance() {
    if (!userID || !carID) {
      console.error("Missing userID or carID");
      setLoading(false);
      return;
    }

    try {
      const maintenanceRef = collection(db, "users", userID, "cars", carID, "maintence");
      const maintenanceSnapshot = await getDocs(maintenanceRef);

      const maintenanceList = maintenanceSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));

      setMaintenance(maintenanceList);
    } catch (error) {
      console.error("Error fetching maintenance records:", error);
    } finally {
      setLoading(false);
    }
  };
 
  async function addMaintenance(e){
    e.preventDefault();
    try {
        const maintenanceRef = collection(db, "users", userID, "cars", carID, "maintence");

        const formData = new FormData(e.target) 
        const userService = selectedType === "other" ? formData.get('custom') : formData.get('type')
        const userDate = formData.get('date')
        const userKM = formData.get('km')
        const userPrice = formData.get('price')
        const userLocation = formData.get('location')


      // New car data
      const newMaintenance = {
        type: userService,
        price: userPrice,
        date: userDate,
        location: userLocation,
        km: userKM,
      };

      // Add the new car document to the 'cars' collection
      await addDoc(maintenanceRef, newMaintenance);

      // Refresh the cars list after adding the new car
      const maintenanceSnapshot = await getDocs(maintenanceRef);
      const updatedmaintenceList = maintenanceSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));

      setMaintenance(updatedmaintenceList);
      e.target.reset();
      setSelectedType("");
      console.log("Car added successfully!");
    } catch (error) {
      console.error("Error adding car:", error);
    }
}

  async function handleTypeChange(e){
    setSelectedType(e.target.value);
  }

  async function deleteMaintenance(maintenanceID){
    try{
        const maintenanceRef = doc(db, "users", userID, "cars", carID, "maintence", maintenanceID);
        await deleteDoc(maintenanceRef)
        fetchMaintenance()
        console.log('Maintenance deleted successfully!');
    }catch(error){
        console.error('Error deleting maintenance:', error);
    }
  }

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h2>Maintenance Records</h2>
      {maintenance.length > 0 ? (
        <ul>
          {maintenance.map(m => (
            <li key={m.id}>
              {/* {m.date?.toDate ? m.date.toDate().toLocaleDateString() : "Invalid Date"} */}
              <strong>Date:</strong> {m.date} <br />
              <strong>Type:</strong> {m.type} <br />
              <strong>Price:</strong> ${m.price} <br />
              <strong>KM:</strong> {m.km} <br />
              <strong>Location:</strong> {m.location} <br />
              <button onClick={() => deleteMaintenance(m.id)}>Delete</button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No maintenance records found for this car.</p>
      )}
      <form onSubmit={addMaintenance}>
        <label htmlFor="type">Type of Serivce:</label>
        <select id="type" name="type" defaultValue="" value={selectedType} onChange={handleTypeChange} required>
          <option value="" disabled>-- Select service --</option>
          <option value="Oil Change">Oil Change</option>
          <option value="Engine Air Filter">Engine Air Filter</option>
          <option value="Transmisson Oil">Transmisson Oil</option>
          <option value="Coolant">Coolant</option>
          <option value="other">Other</option>
        </select>
        <br/>
        {selectedType === "other" && (
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
      </form>
    </div>
  );
}
