import { useState, useEffect } from "react";
import { getAllDestinations } from "../services/destinationService";

const CreateTripForm = ({ onSave, onCancel, existingTrip }) => {
  const [name, setName] = useState("");
  const [destinations, setDestinations] = useState([]);
  const [selectedDestinations, setSelectedDestinations] = useState([]);
  const [price, setPrice] = useState(0);
  const [description, setDescription] = useState("");
  const [datePairs, setDatePairs] = useState([{ startDate: "", endDate: "" }]);
  const [status, setStatus] = useState(0); 
  const [vehicle, setVehicle] = useState(0); 
  const [picture, setPicture] = useState("");

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const data = await getAllDestinations();
        setDestinations(data);
      } catch (error) {
        console.error("Greška pri dobijanju destinacija:", error);
      }
    };
    fetchDestinations();
  }, []);

  useEffect(() => {
    if (existingTrip) {
      setName(existingTrip.name || "");
      setPrice(existingTrip.price || "");
      setDescription(existingTrip.description || "");
      setStatus(existingTrip.status ?? 0);
      setVehicle(existingTrip.vehicle ?? 0);
      setPicture(existingTrip.picture || "");
      setSelectedDestinations(
        existingTrip.destinations?.map((d) => d.id) || []
      );
      setDatePairs(
        existingTrip.availableDates?.map((d) => ({
          startDate: d.startDate.slice(0, 10),
          endDate: d.endDate.slice(0, 10),
        })) || [{ startDate: "", endDate: "" }]
      );
    }
  }, [existingTrip]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      if (reader.result) {
        const base64String = reader.result.split(",")[1]; 
        setPicture(base64String); 
      }
    };
    if (file) reader.readAsDataURL(file);
  };

  const handleAddDatePair = () => {
    setDatePairs([...datePairs, { startDate: "", endDate: "" }]);
  };

  const handleDateChange = (index, field, value) => {
    const newPairs = [...datePairs];
    newPairs[index][field] = value;
    setDatePairs(newPairs);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const tripData = {
      name,
      destinationIds: selectedDestinations,
      price: Number(price),
      description,
      availableDates: datePairs.map((p) => ({
        startDate: new Date(p.startDate).toISOString(),
        endDate: new Date(p.endDate).toISOString(),
      })),
      status,
      vehicle,
      picture,
    };
    onSave(tripData, existingTrip?.id);
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-center z-50 p-4"
      onClick={onCancel}
    >
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-lg shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6"
        onClick={(e) => e.stopPropagation()}
      >

        <div>
          <label className="block font-semibold mb-1">Naziv</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <div className="mt-4">
          <label className="block font-semibold mb-1">Destinacije</label>
          <select
            multiple
            value={selectedDestinations}
            onChange={(e) =>
              setSelectedDestinations(
                Array.from(e.target.selectedOptions, (o) => o.value)
              )
            }
            className="w-full border rounded px-3 py-2 h-32 text-black"
          >
            {destinations.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>
          <p className="text-sm text-gray-500 mt-1">
            *Držite Ctrl da biste izabrali više destinacija
          </p>
        </div>

        <div className="mt-4">
          <label className="block font-semibold mb-1">Cena (€)</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
            required
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <div className="mt-4">
          <label className="block font-semibold mb-1">Opis</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className="w-full border rounded px-3 py-2 resize-y"
            required
          />
        </div>

        <div className="mt-4">
          <label className="block font-semibold mb-1">Dostupni datumi</label>
          {datePairs.map((pair, idx) => (
            <div key={idx} className="flex space-x-2 mb-2">
              <input
                type="date"
                value={pair.startDate}
                onChange={(e) =>
                  handleDateChange(idx, "startDate", e.target.value)
                }
                required
                className="border rounded px-3 py-2"
              />
              <input
                type="date"
                value={pair.endDate}
                onChange={(e) =>
                  handleDateChange(idx, "endDate", e.target.value)
                }
                required
                className="border rounded px-3 py-2"
              />
            </div>
          ))}
          <button
            type="button"
            onClick={handleAddDatePair}
            className="text-blue-600 hover:underline text-sm"
          >
            Dodaj još datuma
          </button>
        </div>

        <div className="flex items-center space-x-4 mt-4">
          <label className="flex items-center space-x-1">
            <input
              type="radio"
              checked={status === 0}
              onChange={() => setStatus(0)}
            />
            <span>Dostupno</span>
          </label>
          <label className="flex items-center space-x-1">
            <input
              type="radio"
              checked={status === 1}
              onChange={() => setStatus(1)}
            />
            <span>Nedostupno</span>
          </label>
        </div>

        <div className="mt-4">
          <label className="block font-semibold mb-1">Prevoz</label>
          <div className="flex space-x-4">
            <label className="flex items-center space-x-1 cursor-pointer">
              <input
                type="radio"
                name="vehicle"
                checked={vehicle === 0}
                onChange={() => setVehicle(0)}
              />
              <span>Sopstveni prevoz</span>
            </label>
            <label className="flex items-center space-x-1 cursor-pointer">
              <input
                type="radio"
                name="vehicle"
                checked={vehicle === 1}
                onChange={() => setVehicle(1)}
              />
              <span>🚌 Autobus</span>
            </label>
            <label className="flex items-center space-x-1 cursor-pointer">
              <input
                type="radio"
                name="vehicle"
                checked={vehicle === 2}
                onChange={() => setVehicle(2)}
              />
              <span>✈️ Avion</span>
            </label>
          </div>
        </div>

        <div className="mt-4">
          <label className="block font-semibold mb-1">Slika</label>
          <input type="file" accept="image/*" onChange={handleFileChange} />
          {picture && (
            <img
              src={`data:image/jpeg;base64,${picture}`}
              alt="preview"
              className="mt-2 w-40 h-40 object-cover rounded"
            />
          )}
        </div>

        <div className="flex justify-end space-x-2 mt-6">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 rounded border border-gray-400"
          >
            Otkaži
          </button>
          <button
            type="submit"
            className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
          >
            Sačuvaj
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateTripForm;

