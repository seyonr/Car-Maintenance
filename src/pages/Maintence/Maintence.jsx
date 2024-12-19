import React, { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import { db } from "../../FirebaseConfig";
import { doc, collection, getDocs, addDoc, Timestamp, deleteDoc } from "firebase/firestore";
import MaintenanceComp from "../../components/MaintenanceComp";
import Header from "../../components/Header/Header";

export default function Maintenance() {
  const { carID } = useParams();
  const location = useLocation();
  const { userID } = location.state || {};
  const [maintenance, setMaintenance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState("");
  const [addNewMaintenance, setAddNewMaintenance] = useState(false)

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
    <>
      <Header userID={userID}/>
      <MaintenanceComp 
        maintenance={maintenance}
        deleteMaintenance={deleteMaintenance}
        setAddNewMaintenance={setAddNewMaintenance}
        addNewMaintenance={addNewMaintenance}
        addMaintenance={addMaintenance}
        selectedType={selectedType}
        handleTypeChange={handleTypeChange}
      />
    </>
  );
}



