import { FaCalendarAlt, FaHeart, FaRegHeart, FaTrash } from "react-icons/fa";
import { formatShortDate } from "../../utils/formatDate";
import TransportInfo from "./TransportInfo";
import { useContext } from "react";
import { AppContext } from "../../context/AppContext";
import { deleteTrip } from "../../services/tripService";
import Swal from "sweetalert2";


const Card = ({ trip, onClick, savedTrips, onToggleSave }) => {
  const { jeAdmin, korisnik } = useContext(AppContext); 
  const isSaved = savedTrips.includes(trip.id);

  return (
    <div
      onClick={() => onClick(trip)}
      className={`relative max-w-sm rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-xl transition-shadow duration-300
        ${trip.status === 1 ? 'bg-gray-200' : 'bg-white'}`}
    >
      <div className="relative">
        <img
          src={
            trip.picture
              ? `data:image/jpeg;base64,${trip.picture}`
              : trip.imageUrl
          }
          alt={trip.name}
          className="w-full h-48 object-cover"
        />

        {korisnik && (<div
          onClick={(e) => {
            e.stopPropagation();
            onToggleSave(trip.id);
          }}
          className="absolute top-2 right-2 text-red-500 text-2xl"
        >
          {isSaved ? <FaHeart /> : <FaRegHeart />}
        </div>)}
      </div>

      <div className="p-4 space-y-2">
        <div className="text-2xl font-bold">{trip.name}</div>
        <div className="flex items-center text-gray-600 text-sm space-x-4">
          <div className="flex items-center space-x-1">
            <FaCalendarAlt />
            {trip.availableDates?.length > 0
              ? formatShortDate(trip.availableDates[0].startDate)
              : "Datum nije dostupan"}
          </div>
          <TransportInfo vehicle={trip.vehicle} />
        </div>

        <div className="text-gray-700 text-sm">
          <span className="text-red-600 font-bold">
            €{trip.price}
          </span>{" "}
          po osobi
        </div>

        {jeAdmin && (
          <div
            onClick={async (e) => {
              e.stopPropagation();
              try {
                const result = await deleteTrip(trip.id);

                Swal.fire({
                  title: "Success",
                  text: result.message,
                  icon: "success",
                  confirmButtonText: "OK",
                });

              } catch (error) {
                Swal.fire({
                  title: "Error",
                  text: error.message,
                  icon: "error",
                  confirmButtonText: "OK",
                });
              }
            }}
            className="absolute bottom-2 right-2 text-xl text-red-500 text-opacity-60 hover:text-opacity-90 transition"
          >
            <FaTrash />
          </div>
        )}

      </div>
    </div>
  );
};

export default Card;











// import { FaCalendarAlt, FaBus, FaShip, FaCar, FaPlane } from "react-icons/fa";
// import { formatDate } from "../../utils/formatDate";

// const vehicleMap = {
//   0: { label: "Privatni transport", icon: <FaCar /> },
//   1: { label: "Autobus", icon: <FaBus /> },
//   2: { label: "Avion", icon: <FaPlane /> },
// };

// const Card = ({ trip, onClick }) => {
//   const selectedVehicle = vehicleMap[trip.vehicle] || {};

//   return (
//     <div
//       onClick={() => onClick(trip)}
//       className="max-w-sm bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-xl transition-shadow duration-300"
//     >
//       <div className="relative">
//         <img
//           src={
//             trip.picture
//               ? `data:image/jpeg;base64,${trip.picture}`
//               : trip.imageUrl
//           }
//           alt={trip.name}
//           className="w-full h-48 object-cover"
//         />
//       </div>

//       <div className="p-4 space-y-2">
//         <div classname= "text-2xl font-bold">{trip.name}</div>
//         <div className="flex items-center text-gray-600 text-sm space-x-4">
//           <div className="flex items-center space-x-1">
//             <FaCalendarAlt />
//             {trip.availableDates?.length > 0
//               ? formatDate(trip.availableDates[0].startDate)
//               : "Datum nije dostupan"}
//           </div>
//           <div className="flex items-center space-x-1">
//             {selectedVehicle.icon}
//             <span>{selectedVehicle.label}</span>
//           </div>
//         </div>

//         <div className="text-gray-700 text-sm">
//           <span className="text-red-600 font-bold">
//             €{trip.price || 169}
//           </span>{" "}
//           po osobi
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Card;
