import React, { useState } from 'react';

const EditReservationForm = ({ reservation, trip, onSave, onCancel }) => {
  const [selectedRange, setSelectedRange] = useState(
    JSON.stringify({
      startDate: reservation.date.startDate,
      endDate: reservation.date.endDate,
    })
  );
  const [numberOfPeople, setNumberOfPeople] = useState(reservation.numberOfPeople);


  const options = trip.availableDates.map((range, index) => {
    const start = new Date(range.startDate).toISOString();
    const end = new Date(range.endDate).toISOString();
    return {
      value: JSON.stringify({ startDate: start, endDate: end }),
      label: `${new Date(start).toLocaleDateString()} - ${new Date(end).toLocaleDateString()}`,
      key: index,
    };
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    const chosen = JSON.parse(selectedRange);

    const updatedReservation = {
      date: {
        startDate: chosen.startDate,
        endDate: chosen.endDate,
      },
      numberOfPeople: Number(numberOfPeople),
    };

    console.log("Updated reservation:", updatedReservation);
    onSave(updatedReservation);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 p-4 border rounded shadow bg-white max-w-md mx-auto"
    >
      <div>
        <label className="block font-semibold mb-1" htmlFor="date">
          Izaberi datum od - do:
        </label>
        <select
          id="date"
          name="date"
          value={selectedRange}
          onChange={(e) => setSelectedRange(e.target.value)}
          className="w-full border rounded px-3 py-2 text-black"
          required
        >
          {options.map((opt) => (
            <option key={opt.key} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block font-semibold mb-1" htmlFor="numberOfPeople">
          Broj osoba
        </label>
        <input
          type="number"
          id="numberOfPeople"
          value={numberOfPeople}
          onChange={(e) => setNumberOfPeople(e.target.value)}
          min={1}
          required
          className="w-full border rounded px-3 py-2"
        />
      </div>

 
      <div className="flex justify-end space-x-2">
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
  );
};

export default EditReservationForm;



