import CreateTripForm from "../CreateTripForm";

const EditTripModal = ({ trip, onSave, onCancel }) => {
  if (!trip) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 overflow-auto p-4"
      onClick={onCancel}
    >
      <div
        onClick={(e) => e.stopPropagation()} 
        className="bg-white rounded-lg shadow-lg w-full max-w-2xl p-4"
      >
        <h2 className="text-xl font-bold mb-4">Izmeni putovanje</h2>
        <CreateTripForm
          existingTrip={trip}
          onSave={onSave}
          onCancel={onCancel}
        />
      </div>
    </div>
  );
};

export default EditTripModal;
