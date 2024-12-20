import React, { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import { db } from "../../FirebaseConfig";
import { doc, collection, getDocs, addDoc, Timestamp, deleteDoc, orderBy, limit, query, startAfter } from "firebase/firestore";
import MaintenanceComp from "../../components/MaintenanceComp/MaintenanceComp";
import Header from "../../components/Header/Header";

export default function Maintenance() {
  const { carID } = useParams();
  const location = useLocation();
  const { userID } = location.state || {};
  const [maintenance, setMaintenance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState("");
  const [addNewMaintenance, setAddNewMaintenance] = useState(false)

  const [lastDoc, setLastDoc] = useState(null)

  const [upcomingMessage, setUpcomingMessage] = useState("");

  useEffect(() => {
    fetchMaintenance();
  }, [userID, carID]);

  useEffect(() => {
    setUpcomingMessage(upcomingMaintenance(maintenance));
  }, [maintenance]);


  async function fetchMaintenance(loadMore = false) {
    if (!userID || !carID) {
      console.error("Missing userID or carID");
      setLoading(false);
      return;
    }

    try {
      let maintenaceQuery = query(
        collection(db, "users", userID, "cars", carID, "maintence"),
        orderBy('date','desc'),
        limit(10)
      )

      if (loadMore && lastDoc) {
        maintenaceQuery  = query(
              collection(db, "users", userID, "cars", carID, "maintence"),
              orderBy('date', 'desc'),
              startAfter(lastDoc),
              limit(10)
          );
      }
      // const maintenanceRef = collection(db, "users", userID, "cars", carID, "maintence");
      const maintenanceSnapshot = await getDocs(maintenaceQuery);

      if (!maintenanceSnapshot.empty) {
          const maintenanceList = maintenanceSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
          }));

          if (loadMore) {
              setMaintenance(prevMain => [...prevMain, ...maintenanceList]);
          } else {
              setMaintenance(maintenanceList);
          }

          // Update the last document for pagination
          setLastDoc(maintenanceSnapshot.docs[maintenanceSnapshot.docs.length - 1]);
        } else {
            console.log('No more maintenance to load');
        }


      // setMaintenance(maintenanceList);
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
      fetchMaintenance()
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

  function upcomingMaintenance(maintenance) {
    // Helper function to calculate the next maintenance schedule
    function getNextMaintenance(records, type, interval) {
      const filteredRecords = records.filter((entry) => entry.type.toLowerCase() === type.toLowerCase());
  
      if (filteredRecords.length === 0) {
        return `No ${type} records found.`;
      }
  
      const lastRecord = filteredRecords[0];
      const nextDueKM = parseInt(lastRecord.km) + interval;
  
      return `Your next ${type} is due at: ${nextDueKM} km.`;
    }
  
    // Messages for each type of maintenance
    const oilChangeMessage = getNextMaintenance(maintenance, "Oil Change", 6500);
    const airFilterMessage = getNextMaintenance(maintenance, "Engine Air Filter", 22000);
    const transFluidMessage = getNextMaintenance(maintenance, "Transmisson Oil", 100000);
    const coolantMessage = getNextMaintenance(maintenance, "Coolant", 70000);
  
    return (
      <>
        <p>{oilChangeMessage}</p>
        <p>{airFilterMessage}</p>
        <p>{transFluidMessage}</p>
        <p>{coolantMessage}</p>
      </>
    );
  }
  
  

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <Header userID={userID}/>
      <MaintenanceComp 
        maintenance={maintenance}
        deleteMaintenance={deleteMaintenance}
        setAddNewMaintenance={setAddNewMaintenance}
        addNewMaintenance={addNewMaintenance}
        addMaintenance={addMaintenance}
        selectedType={selectedType}
        handleTypeChange={handleTypeChange}
        fetchMaintenance={fetchMaintenance}
        loading={loading}
        upcomingMessage={upcomingMessage}
      />
    </div>
  );
}







