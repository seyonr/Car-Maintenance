import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { db } from '../../FirebaseConfig'
import { doc, getDoc, collection, getDocs, addDoc, deleteDoc, orderBy, query, limit, startAfter  } from "firebase/firestore"
import Header from '../../components/Header/Header'
import CarDisplayComp from '../../components/CarDisplayComp/CarDisplayComp'



export default function CarDisplayPage(){
    const { userID } = useParams()
    const [name, setName] = useState("")
    const [cars, setCars] = useState([])
    const [loading, setLoading] = useState(true)
    const [addNewCar, setAddNewCar] = useState(false)
    const [lastDoc, setLastDoc] = useState(null)

    useEffect(() => {
        fetchUserData()
    }, [userID])

    async function fetchUserData(loadMore = false) {
        try {
            setLoading(true)
            // Fetch the userID
            const userRef = doc(db, "users", userID)
            const userSnap = await getDoc(userRef)

            if (userSnap.exists()) {
                setName(userSnap.data().name)
            } else {
                console.log("No user data found")
            }
    
            // Car Fetching
            let carQuery = query(
                collection(db, "users", userID, "cars"),
                orderBy('year', 'desc'),
                limit(5)
            )
    
            // If loading more, use the lastDoc for pagination
            if (loadMore && lastDoc) {
                carQuery = query(
                    collection(db, "users", userID, "cars"),
                    orderBy('year', 'desc'),
                    startAfter(lastDoc),
                    limit(5)
                )
            }
    
            const carSnapshot = await getDocs(carQuery)
    
            if (!carSnapshot.empty) {
                const newCars = carSnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }))
    
                if (loadMore) {
                    setCars(prevCars => [...prevCars, ...newCars])
                } else {
                    setCars(newCars)
                }
    
                // Update the last document for pagination
                setLastDoc(carSnapshot.docs[carSnapshot.docs.length - 1])
            } else {
                console.log('No more cars to load')
            }
        } catch (error) {
            console.error("Error fetching data:", error)
        } finally {
            setLoading(false)
        }
    }
    

    async function addCar(e){
        e.preventDefault()
        try {
          const carsRef = collection(db, "users", userID, "cars")
          
          const formData = new FormData(e.target) // Capture form data
          const userYear = formData.get('year')
          const userMake = formData.get('make')
          const userModel = formData.get('model')

    
          // New car data
          const newCar = {
            make: userMake,
            model: userModel,
            year: userYear,
          }
    
          await addDoc(carsRef, newCar) // Add new car
          fetchUserData() // Refresh list
          e.target.reset() // Reset table
          setAddNewCar(prev => !prev)
          console.log("Car added successfully!")
        } catch (error) {
          console.error("Error adding car:", error)
        }
    }

    async function deleteCar(carID){
        try{
            const carsRef = doc(db, "users", userID, "cars", carID) // Creating reference of car to delete
            await deleteDoc(carsRef) // Delete car
            fetchUserData() // Reload car list
            console.log('Car deleted successfully!')
        }catch(error){
            console.error('Error deleting car:', error)
        }
    }

    if (loading) return <p>Loading...</p>

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
                loading={loading}
                fetchUserData={fetchUserData}
            />
        </div>
    )
}