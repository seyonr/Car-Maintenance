import React, { useState, useEffect } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { db } from '../../FirebaseConfig'
// import { ref, get, child } from "firebase/database";
import { doc, getDoc, collection, getDocs, addDoc, deleteDoc } from "firebase/firestore";

import Header from '../../components/Header/Header';
import CarDisplayComp from '../../components/CarDisplayComp/CarDisplayComp';



export default function CarDisplayPage(){
    const { userID } = useParams();
    const [name, setName] = useState("");
    const [cars, setCars] = useState([]);
    const [maintence, setMaintence] = useState([]);
    const [loading, setLoading] = useState(true);
    const [addNewCar, setAddNewCar] = useState(false)

    useEffect(() => {
        fetchUserData();
    }, [userID]);

    async function fetchUserData(){
        try {
        // Fetch the user's name
        const userRef = doc(db, "users", userID);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
            setName(userSnap.data().name);
        } else {
            console.log("No user data found");
        }

        // Fetch the user's cars
        const carsRef = collection(db, "users", userID, "cars");
        const carsSnapshot = await getDocs(carsRef);

        const carsList = carsSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
        }));

        setCars(carsList);
        } catch (error) {
        console.error("Error fetching data:", error);
        } finally {
        setLoading(false);
        }
    };

    async function addCar(e){
        e.preventDefault();
        try {
          const carsRef = collection(db, "users", userID, "cars");
          
          const formData = new FormData(e.target) // Capture form data
          const userYear = formData.get('year')
          const userMake = formData.get('make')
          const userModel = formData.get('model')

    
          // New car data
          const newCar = {
            make: userMake,
            model: userModel,
            year: userYear,
          };
    
          // Add the new car document to the 'cars' collection
          await addDoc(carsRef, newCar);
    
          // Refresh the cars list after adding the new car
          fetchUserData();
    
        //   setCars(updatedCarsList);
          e.target.reset();
          setAddNewCar(prev => !prev)
          console.log("Car added successfully!");
        } catch (error) {
          console.error("Error adding car:", error);
        }
    };

    async function deleteCar(carID){
        try{
            const carsRef = doc(db, "users", userID, "cars", carID);
            await deleteDoc(carsRef)
            fetchUserData()
            console.log('Car deleted successfully!');
        }catch(error){
            console.error('Error deleting car:', error);
        }
    }

    if (loading) return <p>Loading...</p>;

    return (
        <div>
            <Header userID={userID}/>
            <CarDisplayComp
                name={name}
                cars={cars}
                userID={userID}
                addNewCar={addNewCar}
                setAddNewCar={setAddNewCar}
                deleteCar={deleteCar}
                addCar={addCar}
            />
        </div>
    );
}




