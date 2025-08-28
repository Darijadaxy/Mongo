import { useEffect, useState } from "react";
import { getAllReservations, deleteReservation } from "../services/reservationService";

const statusMap = {
  0: "Na čekanju",
  1: "Potvrđeno",
  2: "Otkazano"
};

const AllReservations = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getAllReservations();
        setReservations(data);
      } catch (err) {
        console.error("Greška prilikom učitavanja rezervacija:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleDelete = async (id) => {
    try {
      await deleteReservation(id);
      setReservations((prev) => prev.filter((res) => res.id !== id));
    } catch (err) {
      console.error("Greška prilikom brisanja rezervacije:", err);
    }
  };

  if (loading) return <p>Učitavanje...</p>;

  const now = new Date();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Sve rezervacije</h1>
      {reservations.length === 0 ? (
        <p>Nema rezervacija.</p>
      ) : (
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border border-gray-300 p-2">Korisnik</th>
              <th className="border border-gray-300 p-2">Putovanje</th>
              <th className="border border-gray-300 p-2">Početak</th>
              <th className="border border-gray-300 p-2">Kraj</th>
              <th className="border border-gray-300 p-2">Broj osoba</th>
              <th className="border border-gray-300 p-2">Cena</th>
              <th className="border border-gray-300 p-2">Status</th>
              <th className="border border-gray-300 p-2">Akcije</th>
            </tr>
          </thead>
          <tbody>
            {reservations.map((res) => {
              const endDate = new Date(res.date.endDate);
              const canDelete = res.status === 2 || endDate < now; // otkazano ili završeno

              return (
                <tr key={res.id}>
                  <td className="border border-gray-300 p-2">{res.username}</td>
                  <td className="border border-gray-300 p-2">{res.tripName}</td>
                  <td className="border border-gray-300 p-2">
                    {new Date(res.date.startDate).toLocaleDateString()}
                  </td>
                  <td className="border border-gray-300 p-2">
                    {endDate.toLocaleDateString()}
                  </td>
                  <td className="border border-gray-300 p-2">{res.numberOfPeople}</td>
                  <td className="border border-gray-300 p-2">{res.totalPrice} €</td>
                  <td className="border border-gray-300 p-2">
                    {statusMap[res.status] ?? "Nepoznat"}
                  </td>
                  <td className="border border-gray-300 p-2 text-center">
                    {canDelete && (
                      <button
                        onClick={() => handleDelete(res.id)}
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                      >
                        Obriši
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AllReservations;




