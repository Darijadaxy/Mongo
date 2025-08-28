import { useEffect, useState } from 'react';
import { FaChevronDown, FaChevronRight } from 'react-icons/fa';
import { formatFullDate } from "../utils/formatDate";
import { getTripReservations } from '../services/reservationService';

const TripReservations = ({ tripId, reservationsChanged }) => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const statusMap = {
  0: 'Na čekanju',
  1: 'Potvrđeno',
  2: 'Otkazano',
};

  const fetchReservations = async () => {
    setLoading(true);
    try {
      const data = await getTripReservations(tripId);
      setReservations(data);
    } catch (error) {
      console.error('Greška pri učitavanju rezervacija:', error);
      setReservations([]);
    } finally {
      setLoading(false);
    }
  };

  const toggleExpand = () => {
    setExpanded((prev) => !prev);
  };

  useEffect(() => {
      fetchReservations();
  }, [expanded, tripId, reservationsChanged]); 

  const reservationCount = reservations ? reservations.length : 0;

  return (
    <div className="max-w-4xl mx-auto my-8">
      <button
        onClick={toggleExpand}
        className="flex items-center text-xl font-semibold mb-4 focus:outline-none"
        aria-expanded={expanded}
        aria-controls="reservations-list"
      >
        Rezervacije putovanja ({reservationCount})
        <span className="ml-2 text-yellow-600">
          {expanded ? <FaChevronDown /> : <FaChevronRight />}
        </span>
      </button>

      {expanded && (
        <div id="reservations-list" className="space-y-4">
          {loading ? (
            <p>Učitavanje rezervacija...</p>
          ) : reservationCount === 0 ? (
            <p>Još nema rezervacija za ovo putovanje.</p>
          ) : (
            reservations.map((res) => (
              <div key={res.id} className="border rounded-md p-4 shadow-sm bg-white">
                <p><strong>Username:</strong> {res.username}</p>
                <p><strong>Putovanje:</strong> {res.tripName}</p>
                <p><strong>Datum:</strong> {formatFullDate(res.date.startDate)} - {formatFullDate(res.date.endDate)}</p>
                <p><strong>Broj osoba:</strong> {res.numberOfPeople}</p>
                <p><strong>Ukupna cena:</strong> {res.totalPrice} RSD</p>
                <p><strong>Status:</strong> {statusMap[res.status]}</p>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default TripReservations;
