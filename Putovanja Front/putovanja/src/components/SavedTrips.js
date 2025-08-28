import { useEffect, useState } from 'react';
import Card from './ui/Card';
import { getSavedTrips, saveTrip, unSaveTrip } from '../services/userService';

const SavedTrips = () => {
  const [trips, setTrips] = useState([]);
  const [savedTrips, setSavedTrips] = useState([]); 
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadSavedTrips();
  }, []);

  const loadSavedTrips = async () => {
    setLoading(true);
    try {
      const data = await getSavedTrips();
      setTrips(data);

      setSavedTrips(data.map(trip => trip.id));
    } catch (error) {
      console.error('Greška pri učitavanju putovanja:', error);
    }
    setLoading(false);
  };

  const handleToggleSave = async (tripId) => {
    if (savedTrips.includes(tripId)) {

      try {
        await unSaveTrip(tripId);
        setSavedTrips(prev => prev.filter(id => id !== tripId));

      } catch (error) {
        console.error('Greška pri uklanjanju sačuvanog putovanja:', error);
      }
    } else {

      try {
        await saveTrip(tripId);
        setSavedTrips(prev => [...prev, tripId]);
      } catch (error) {
        console.error('Greška pri čuvanju putovanja:', error);
      }
    }
  };


  const handleCardClick = (trip) => {

    console.log('Kliknuto na putovanje:', trip.name);
  };

  if (loading) {
    return <p className="text-center mt-12">Učitavanje putovanja...</p>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-4">
      {trips.map((trip) => (
        <Card
          key={trip.id}
          trip={trip}
          onClick={handleCardClick}
          savedTrips={savedTrips}
          onToggleSave={handleToggleSave}
        />
      ))}
    </div>
  );
};

export default SavedTrips;



