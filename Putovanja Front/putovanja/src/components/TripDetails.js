import React, { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getTripById, updateTrip, addReview } from '../services/tripService';
import { addReservation } from '../services/reservationService';
import DestinationCard from './ui/DestinationCard';
import Header from './Header';
import { FaCalendarAlt } from "react-icons/fa";
import { formatShortDate } from '../utils/formatDate';
import TransportInfo from './ui/TransportInfo';
import TripReviews from './TripReviews';
import ReviewForm from './ReviewForm';
import EditTripModal from './ui/EditTripModal';
import { AppContext } from '../context/AppContext';
import TripReservations from './TripReservations';
import ReservationForm from './ReservationForm';


const TripDetails = () => {
  const { id } = useParams();
  const {korisnik} = useContext(AppContext);
  const [trip, setTrip] = useState(null); 
  const [reviewsChanged, setReviewsChanged] = useState(false);
  const [reservationsChanged, setReservationsChanged] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const navigate = useNavigate();
  const { jeAdmin } = useContext(AppContext);
  const [showReservationForm, setShowReservationForm] = useState(false);


  useEffect(() => {
    const fetchTrip = async () => {
      try {
        const data = await getTripById(id);
        console.log(data)
        setTrip(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchTrip();
  }, [id]);

  if (!trip) {
    return <p className="text-center mt-10">Učitavanje...</p>;
  }

  const handleSaveReview = async (newReview) => {
    try {
      await addReview(id, newReview);
      setShowReviewForm(false);
      setReviewsChanged(prev => !prev);
    } catch (error) {
      console.error('Greška pri dodavanju recenzije:', error);
      alert('Nije uspelo dodavanje recenzije, pokušaj ponovo.');
    }
  };

  const handleSaveReservation = async (newReservation) => {
    try {
      await addReservation(newReservation);
      setShowReservationForm(false);
      setReservationsChanged(prev => !prev);
    } catch (error) {
      console.error('Greška pri dodavanju rezervacije:', error);
      alert('Nije uspelo dodavanje rezervacije, pokušaj ponovo.');
    }
  };

  const handleSaveTripUpdate = async (updatedTripData) => {
    try {
      await updateTrip(trip.id, updatedTripData);
      setShowEditForm(false);
      const refreshed = await getTripById(trip.id);
      setTrip(refreshed);
    } catch (error) {
      console.error("Greška pri ažuriranju putovanja:", error);
      alert("Nije uspelo ažuriranje putovanja.");
    }
  };

  return (
    <>
      <Header />

      {trip.picture && (
        <div className="w-full">
          <img
            src={`data:image/jpeg;base64,${trip.picture}`}
            alt={trip.name}
            className="w-full h-96 object-cover"
          />
        </div>
      )}

      <div className="max-w-4xl mx-auto mt-8 px-4">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">{trip.name}</h1>
          <div className="flex space-x-2">
            { korisnik && (
              <>
              <button
              onClick={() => setShowReservationForm(true)}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md shadow"
            >
              Rezerviši
            </button> 
            <button
              onClick={() => setShowEditForm(true)}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md shadow"
            >
              Izmeni
            </button> 
            </>)}
          </div>
        </div>

        <h2 className="text-lg mb-6">{trip.description}</h2>

        <div className="text-gray-700 text-lg mb-4">
          <span className="text-red-600 font-bold">€{trip.price}</span> po osobi
        </div>

        <div className="flex flex-wrap gap-6 text-gray-600 mb-6">
          <div className="flex items-center space-x-2">
            <FaCalendarAlt />
            {trip.availableDates?.length > 0 ? (
                trip.availableDates.map((dateObj, idx) => (
                <div
                    key={idx}
                    className="inline-block bg-gray-100 text-gray-800 text-xs font-semibold px-3 py-1 rounded-md"
                >
                    {formatShortDate(dateObj.startDate)}
                </div>
                ))
            ) : (
                <span>Nema dostupnih datuma</span>
            )}
          </div>
          <TransportInfo vehicle={trip.vehicle}/>
        </div>
        
        <h2 className="text-xl font-bold mt-6 mb-6">
          Destinacije u okviru putovanja
        </h2>
        {trip.destinations && trip.destinations.length > 0 ? (
          trip.destinations.map((dest) => (
            <DestinationCard
              key={dest.id}
              name={dest.name}
              onViewDetails={() => navigate(`/destination/${dest.id}`)}
            />
          ))
        ) : (
          <p>Nema destinacija za ovo putovanje.</p>
        )}

        {trip.averageRating &&  (<h2 className='text-xl font-bold'>Prosečna ocena putovanja: {trip.averageRating.toFixed(2)}</h2>) }
        {korisnik && (<button
            onClick={() => setShowReviewForm(true)}
            className="mt-6 bg-yellow-400 hover:bg-yellow-500 text-white font-semibold py-2 px-6 rounded-md shadow"
        >
            Dodaj ocenu
        </button>)}
      </div>

      {showReviewForm && (
        <div
            className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
            onClick={() => setShowReviewForm(false)}
        >
            <ReviewForm
            onSave={handleSaveReview}
            onCancel={() => setShowReviewForm(false)}
            onClick={(e) => e.stopPropagation()} 
            />
        </div>
      )}

      {showEditForm && (
        <EditTripModal
          trip={trip}
          onSave={handleSaveTripUpdate}
          onCancel={() => setShowEditForm(false)}
        />
      )}

      {showReservationForm && (
      <ReservationForm
        isOpen={showReservationForm}
        onSave={handleSaveReservation}
        onClose={() => setShowReservationForm(false)}
        trip={trip}
      />
      )}


      <TripReviews tripId={trip.id} reviewsChanged={reviewsChanged} />
      {jeAdmin && <TripReservations tripId={trip.id} reservationsChanged={reservationsChanged}/>}
    </>
  );
};

export default TripDetails;
