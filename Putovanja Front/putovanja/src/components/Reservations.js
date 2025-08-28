import React, { useEffect, useState } from 'react';
import { getUserReservations } from '../services/userService';
import { updateReservationStatus, updateReservation } from '../services/reservationService';
import { getTripById } from '../services/tripService'; // 👈 dodaj ovo
import EditReservationForm from './EditReservationForm';
import { formatFullDate } from "../utils/formatDate";

const statusMap = {
  0: 'Na čekanju',
  1: 'Potvrđeno',
  2: 'Otkazano',
};

const Reservations = () => {
  const [reservations, setReservations] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editingTrip, setEditingTrip] = useState(null);

  useEffect(() => {
    loadReservations();
  }, []);

  const loadReservations = () => {
    getUserReservations()
      .then(setReservations)
      .catch((err) => console.error('Greška pri učitavanju rezervacija:', err));
  };

  const handleEditClick = async (reservation) => {
    try {
      const trip = await getTripById(reservation.tripId); // fetch trip sa availableDates
      setEditingTrip(trip);
      setEditingId(reservation.id);
    } catch (err) {
      console.error("Greška pri učitavanju tripa:", err);
      alert("Nije moguće učitati dostupne datume za ovo putovanje.");
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingTrip(null);
  };

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      await updateReservationStatus(id, newStatus);
      loadReservations();
    } catch (error) {
      alert('Greška pri ažuriranju statusa');
    }
  };

  const handleSave = async (updatedData) => {
    try {
      await updateReservation(editingId, updatedData);
      setEditingId(null);
      setEditingTrip(null);
      loadReservations();
    } catch (error) {
      alert('Greška pri čuvanju rezervacije');
    }
  };

  return (
    <div>
      {reservations.length === 0 ? (
        <p>Nemate rezervacija.</p>
      ) : (
        <ul className="space-y-4">
          {reservations.map((res) => (
            <li key={res.id} className="border p-4 rounded shadow bg-white">
              {editingId === res.id ? (
                editingTrip && (
                  <EditReservationForm
                    reservation={res}
                    trip={editingTrip}
                    onSave={handleSave}
                    onCancel={handleCancelEdit}
                  />
                )
              ) : (
                <div className="flex justify-between items-start">
                  <div>
                    <p><strong>Putovanje:</strong> {res.tripName}</p>
                    <p><strong>Datum:</strong> {formatFullDate(res.date.startDate)} - {formatFullDate(res.date.endDate)}</p>
                    <p><strong>Broj osoba:</strong> {res.numberOfPeople}</p>
                    <p><strong>Ukupna cena:</strong> {res.totalPrice} RSD</p>
                    <p><strong>Status:</strong> {statusMap[res.status]}</p>

                    {res.status === 0 && (
                      <div className="mt-2 space-x-2">
                        <button
                          onClick={() => handleStatusUpdate(res.id, 1)}
                          className="bg-green-600 hover:bg-green-700 text-white font-semibold py-1 px-3 rounded"
                        >
                          Potvrdi
                        </button>
                        <button
                          onClick={() => handleStatusUpdate(res.id, 2)}
                          className="bg-red-600 hover:bg-red-700 text-white font-semibold py-1 px-3 rounded"
                        >
                          Otkaži
                        </button>
                      </div>
                    )}
                  </div>

                  {res.status === 0 && (
                    <button
                      onClick={() => handleEditClick(res)}
                      className="ml-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded"
                    >
                      Izmeni
                    </button>
                  )}
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Reservations;




