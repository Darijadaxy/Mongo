import { FaTrash, FaEdit } from "react-icons/fa";

const DestinationCard = ({ name, onViewDetails, showButtons, onEdit, onDelete }) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-4 flex justify-between items-center mb-4">
      <span className="text-lg font-semibold">{name}</span>
      <div className="flex gap-2">
        <button
          onClick={onViewDetails}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Pogledaj detalje
        </button>

        {showButtons && (
          <>
            <button
              onClick={onEdit}
              className="bg-green-500 text-white p-2 rounded hover:bg-green-600 flex items-center justify-center"
            >
              <FaEdit size={18} />
            </button>
            <button
              onClick={onDelete}
              className="bg-red-500 text-white p-2 rounded hover:bg-red-600 flex items-center justify-center"
            >
              <FaTrash />
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default DestinationCard;
