import { useState, useEffect } from "react";
import { getAvailableTrips, searchTrips, filterTrips } from "../services/tripService";
import { getSavedTrips, saveTrip, unSaveTrip } from '../services/userService';
import Card from "./ui/Card";
import { useNavigate } from "react-router-dom";

const Trip = () => {
  const [trips, setTrips] = useState([]);
  const [savedTrips, setSavedTrips] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    minPrice: "",
    maxPrice: "",
    minRating: "",
    vehicle: "",
    startDate: "",
    endDate: ""
  });


  useEffect(() => {
    loadTrips();
  }, []);

  useEffect(() => {
    getSavedTrips()
      .then((data) => setSavedTrips(data.map(trip => trip.id)))
      .catch((err) => console.error("Greška pri učitavanju sačuvanih putovanja:", err));
  }, []);

  const loadTrips = async () => {
    try {
      const data = await getAvailableTrips();
      setTrips(data);
    } catch (err) {
      console.error("Greška pri učitavanju putovanja:", err);
    }
  };

  const handleCardClick = (tripId) => {
    navigate(`/trip/${tripId}`);
  };

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

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      if (!searchQuery.trim()) {
        loadTrips();
        return;
      }
      const result = await searchTrips(searchQuery.trim());
      setTrips(result);
    } catch (error) {
      console.error("Greška pri pretrazi putovanja:", error);
    }
  };

    const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleFilterSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await filterTrips(filters); 
      setTrips(result);
    } catch (error) {
      console.error("Greška pri filtriranju putovanja:", error);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4 flex">
      <div className="w-64  p-4 rounded-lg shadow-md mr-6">
        <h3 className="text-lg font-semibold mb-4">Filtriraj putovanja</h3>
        <form onSubmit={handleFilterSubmit} className="space-y-4">
          <div>
            <label className="block text-sm">Cena</label>
            <div className="flex space-x-2">
              <input type="number" name="minPrice" placeholder="Min"
                value={filters.minPrice} onChange={handleFilterChange}
                className="w-1/2 px-2 py-1 border rounded" />
              <input type="number" name="maxPrice" placeholder="Max"
                value={filters.maxPrice} onChange={handleFilterChange}
                className="w-1/2 px-2 py-1 border rounded" />
            </div>
          </div>
          <div>
            <label className="block text-sm">Minimalna ocena</label>
            <input type="number" step="0.1" min="0" max="5"
              name="minRating" value={filters.minRating} onChange={handleFilterChange}
              className="w-full px-2 py-1 border rounded" />
          </div>
          <div>
            <label className="block text-sm">Prevoz</label>
            <select name="vehicle" value={filters.vehicle} onChange={handleFilterChange}
              className="w-full px-2 py-1 border rounded">
              <option value="">-- Svi --</option>
              <option value={0}>Sopstveni prevoz</option>
              <option value={1}>Autobus</option>
              <option value={2}>Avion</option>
            </select>
          </div>
          <div>
            <label className="block text-sm">Period</label>
            <div className="flex space-x-2">
              <input type="date" name="startDate" value={filters.startDate} onChange={handleFilterChange}
                className="w-1/2 px-2 py-1 border rounded" />
              <input type="date" name="endDate" value={filters.endDate} onChange={handleFilterChange}
                className="w-1/2 px-2 py-1 border rounded" />
            </div>
          </div>

          <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
            Primeni filtere
          </button>
        </form>
      </div>

      <div className="flex-1">
        <form onSubmit={handleSearch} className="mb-6 flex">
          <input
            type="text"
            placeholder="Pretraži putovanja..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 px-3 py-2 border rounded-l-lg"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-r-lg hover:bg-blue-700"
          >
            Pretraži
          </button>
        </form>

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
    </div>
  );
};

export default Trip;


