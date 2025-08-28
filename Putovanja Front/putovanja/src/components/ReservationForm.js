import { useState} from 'react';
import { validateReservationForm } from "../utils/validation";

function ReservationForm({ isOpen, onClose, onSave, trip}) {

    const [formData, setFormData] = useState({
        date: '',
        numberOfPeople: '',
    });
    const [errors, setErrors] = useState({});
    const [selectedRange, setSelectedRange] = useState("");

    const options = trip.availableDates.map((range, index) => {
        const start = new Date(range.startDate).toISOString();
        const end = new Date(range.endDate).toISOString();
        return {
            value: JSON.stringify({ startDate: start, endDate: end }),
            label: `${new Date(start).toLocaleDateString()} - ${new Date(end).toLocaleDateString()}`,
            key: index,
        };
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));

        if (value.trim() !== "") {
            setErrors((prevErrors) => ({
                ...prevErrors,
                [name]: undefined,
            }));
        }
    };

    const handleSave = async () => {
        if (!selectedRange) {
        setErrors((prev) => ({ ...prev, date: "Morate odabrati termin" }));
        return;
        }

        const chosen = JSON.parse(selectedRange);

        const payload = {
            tripId: trip.id,
            date: {
                startDate: chosen.startDate,
                endDate: chosen.endDate,
            },
            numberOfPeople: parseInt(formData.numberOfPeople, 10),
        };

        console.log("Reservation payload:", JSON.stringify(payload, null, 2));

        const newErrors = validateReservationForm(payload);

        if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
        }

        try {
        await onSave(payload);
        window.location.reload();
        setErrors({});
        onClose();
        } catch (error) {
        console.error("Greška pri dodavanju rezervacije:", error);
        alert(`Greška: ${error.message}`);
        }
    };

    if (!isOpen) return null;

    return (
        <div
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                zIndex: 9999,
            }}
        >
            <div
                style={{
                    backgroundColor: 'white',
                    borderRadius: '10px',
                    padding: '20px',
                    width: '400px',
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                    position: 'relative',
                }}
            >
                <h2 style={{ textAlign: 'center', marginBottom: '20px', color: '#000' }}>
                    Rezerviši putovanje
                </h2>
                <form>
                    <div style={{ marginBottom: '15px' }}>
                        <label
                        htmlFor="date"
                        style={{
                            display: 'block',
                            marginBottom: '5px',
                            fontWeight: 'bold',
                            color: '#333',
                        }}
                        >
                        Izaberi datum od - do:
                        </label>
                        <select
                            id="date"
                            name="date"
                            value={selectedRange}
                            onChange={(e) => setSelectedRange(e.target.value)}
                            className={`w-full p-2 border rounded mb-2 text-black ${errors.date ? "border-red-500" : ""}`}
                            >
                            <option value="">-- Odaberi termin --</option>
                            {options.map((opt) => (
                                <option key={opt.key} value={opt.value}>
                                {opt.label}
                                </option>
                            ))}
                        </select>
                        {errors.date && <p className="text-red-500 text-sm">{errors.date}</p>}
                    </div>

                    <div style={{ marginBottom: '15px' }}>
                        <label
                            htmlFor="numberOfPeople"
                            style={{
                                display: 'block',
                                marginBottom: '5px',
                                fontWeight: 'bold',
                                color: '#333',
                            }}
                        >
                            Broj ljudi:
                        </label>
                        <input
                            type="number"
                            id="numberOfPeople"
                            name="numberOfPeople"
                            value={formData.numberOfPeople}
                            onChange={handleInputChange}
                            className={`w-full p-2 border rounded mb-2 text-black ${errors.numberOfPeople ? "border-red-500" : ""}`}
                        />
                        {errors.numberOfPeople && <p className="text-red-500 text-sm">{errors.numberOfPeople}</p>}
                    </div>                   

                    <div className="flex justify-center space-x-4">
                    <button
                        type="button"
                        onClick={handleSave}
                        className="px-6 py-3 bg-green-700 text-white rounded-lg border-none cursor-pointer hover:bg-green-600"
                    >
                        Sačuvaj
                    </button>

                        <button
                        type="button"
                        onClick={onClose}
                        className="px-6 py-3 bg-red-600 text-white rounded-lg border-none cursor-pointer hover:bg-red-500"
                    >
                        Odustani
                    </button>

                    </div>
                </form>
            </div>
        </div>
    );
}



export default ReservationForm;