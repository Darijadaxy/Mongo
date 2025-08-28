import { FaCar, FaBus, FaPlane } from "react-icons/fa";

const vehicleIcons = {
  0: <FaCar className="inline-block mr-1" />,
  1: <FaBus className="inline-block mr-1" />,
  2: <FaPlane className="inline-block mr-1" />,
};

const vehicleNames = {
  0: 'Privatni transport',
  1: 'Autobus',
  2: 'Avion',
};

const TransportInfo = ({ vehicle }) => {
  return (
    <div className="flex flex-wrap gap-6 text-gray-600">
      <div className="flex items-center space-x-2">
        {vehicleIcons[vehicle]}
        <span>{vehicleNames[vehicle]}</span>
      </div>
    </div>
  );
};

export default TransportInfo;
