import React, { useState, useEffect } from "react";
import { getAllTrips } from "../services/tripService";
import { getSavedTrips, saveTrip, unSaveTrip } from '../services/userService';
import Card from "../components/ui/Card";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import CreateTripForm from "../components/CreateTripForm";
import { createTrip } from "../services/tripService";

const AdminPageAllTrips = () => {
  const [trips, setTrips] = useState([]);
  const [savedTrips, setSavedTrips] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    getAllTrips()
      .then((data) => setTrips(data))
      .catch((err) => console.error("Greška pri učitavanju putovanja:", err));
  }, []);

  useEffect(() => {
    getSavedTrips()
      .then((data) => setSavedTrips(data.map(trip => trip.id)))
      .catch((err) => console.error("Greška pri učitavanju sačuvanih putovanja:", err));
  }, []);

  const handleSaveTrip = async (tripData) => {
    try {
      await createTrip(tripData);
      setShowForm(false);
      const updatedTrips = await getAllTrips();
      setTrips(updatedTrips);
    } catch (error) {
      console.error("Greška pri kreiranju putovanja:", error);
      alert("Došlo je do greške pri kreiranju putovanja.");
    }
  };

  const handleCancel = () => setShowForm(false);

  const handleCardClick = (tripId) => navigate(`/trip/${tripId}`);

  const handleToggleSave = async (tripId) => {
    try {
      if (savedTrips.includes(tripId)) {
        await unSaveTrip(tripId);
        setSavedTrips(prev => prev.filter(id => id !== tripId));
      } else {
        await saveTrip(tripId);
        setSavedTrips(prev => [...prev, tripId]);
      }
    } catch (error) {
      console.error('Greška pri menjaju sačuvanih putovanja:', error);
    }
  };

  return (
    <>
      <Header />

      <div className="max-w-7xl mx-auto p-4">
        <div className="flex justify-center mb-6">
          <button
            onClick={() => setShowForm(true)}
            className="px-6 py-2 bg-green-500/40 hover:bg-green-600/50 text-black font-bold text-md rounded-xl shadow-lg border-2 border-green-600 backdrop-blur-sm transition-transform transform hover:scale-105"
          >
            Kreiraj novo putovanje
          </button>
        </div>
        {showForm && (
          <CreateTripForm onSave={handleSaveTrip} onCancel={handleCancel} />
        )}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {trips.map((trip) => (
            <Card
              key={trip.id}
              trip={trip}
              onClick={() => handleCardClick(trip.id)}
              savedTrips={savedTrips}
              onToggleSave={handleToggleSave}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default AdminPageAllTrips;
