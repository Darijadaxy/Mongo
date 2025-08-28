import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { getAllDestinations, deleteDestination, updateDestination, createDestination } from "../services/destinationService";
import DestinationCard from "../components/ui/DestinationCard";
import DestinationForm from "../components/DestinationForm";
import Header from '../components/Header';
import { AppContext } from '../context/AppContext';
import Swal from "sweetalert2";

const Destinations = () => {
    const [destinations, setDestinations] = useState([]);
    const navigate = useNavigate();
    const [editingDestination, setEditingDestination] = useState(null);
    const [addingDestination, setAddingDestination] = useState(false);


    const { jeAdmin } = useContext(AppContext);
    const location = useLocation();

    const showAdminButtons =
    jeAdmin && location.pathname === "/admin/alldestinations";

    useEffect(() => {
        const fetchDestinations = async () => {
        try {
            const data = await getAllDestinations();
            setDestinations(data);
        } catch (error) {
            console.error("Greška pri preuzimanju destinacija:", error);
        }
        };

        fetchDestinations();
    }, []);

    const handleDelete = async (id) => {
        try {
            const result = await deleteDestination(id);
            Swal.fire({
                title: "Success",
                text: result.message,
                icon: "success",
                confirmButtonText: "OK"
            });
            setDestinations(prev => prev.filter(dest => dest.id !== id));
        } catch (error) {
            Swal.fire({
                title: "Error",
                text: error.message,
                icon: "error",
                confirmButtonText: "OK"
            });
        }
    };

    const handleEdit = (destination) => {
        setEditingDestination(destination); 
    };

    return (
        <div className="flex flex-col min-h-screen">
        <Header /> 
        <div className="flex flex-col items-center flex-1 py-6">
            {destinations.length === 0 ? (
            <div className="text-lg font-semibold text-gray-600">
                Nema destinacija
            </div>
            ) : (
            <div className="flex flex-col gap-4 w-full max-w-2xl">
                {destinations.map((dest) => (
                <DestinationCard
                    key={dest.id}
                    name={dest.name}
                    onViewDetails={() => navigate(`/destination/${dest.id}`)}
                    showButtons={showAdminButtons}
                    onEdit={() => handleEdit(dest)}
                    onDelete={() => handleDelete(dest.id)}
                />
                ))}
            </div>
            )}

            {showAdminButtons && (
                <button
                onClick={() => setAddingDestination(true)}
                className="mt-6 px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600"
                >
                Dodaj
                </button>
            )}
        </div>

        {editingDestination && (
        <DestinationForm
            isOpen={!!editingDestination}
            onClose={() => setEditingDestination(null)}
            onSave={(data) => updateDestination(editingDestination.id, data)}
            initialData={editingDestination}
        />
        )}

        {addingDestination && (
        <DestinationForm
            isOpen={addingDestination}
            onClose={() => setAddingDestination(false)}
            onSave={async (data) => {
                await createDestination(data);
                const updatedList = await getAllDestinations();
                setDestinations(updatedList);
                setAddingDestination(false);
            }}
            initialData={{}}
        />
        )}

        </div>

        
    );
};



export default Destinations;
