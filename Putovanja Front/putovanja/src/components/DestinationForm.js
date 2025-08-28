import { useState, useEffect} from 'react';
import { validateDestinationForm } from "../utils/validation";

function DestinationForm({ isOpen, onClose, onSave, initialData = {} }) {

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        images: [], 
    });
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (isOpen) {
            setFormData({
                name: initialData.name || "",
                description: initialData.description || "",
                images: initialData.images || [],
            });
            setErrors({});
        }
    }, [isOpen, initialData]);

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        const imagePromises = files.map((file) => {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = () => resolve(reader.result);
                reader.onerror = reject;
                reader.readAsDataURL(file);
            });
        });

        Promise.all(imagePromises)
        .then((images) => {
            setFormData((prev) => ({
            ...prev,
            images: [...prev.images, ...images],
            }));
            setErrors((prevErrors) => ({ ...prevErrors, images: undefined }));
        })
        .catch((error) => {
            console.error("Greška prilikom čitanja slika:", error);
        });
    };

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
        const newErrors = validateDestinationForm(formData);
        
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        try {
            await onSave(formData);
            window.location.reload(); 
            setErrors({});
            onClose();

        } catch (error) {
            console.error("Greška pri čuvanju destinacije:", error);
            alert(`Greška: ${error.message}`);
        }
    };

    const handleRemoveImage = (index) => {
        setFormData((prev) => ({
        ...prev,
        images: prev.images.filter((_, i) => i !== index),
        }));
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
                    {initialData.id ? "Izmeni destinaciju" : "Dodaj novu destinaciju"}
                </h2>
                <form>
                    <div style={{ marginBottom: '15px' }}>
                        <label
                            htmlFor="name"
                            style={{
                                display: 'block',
                                marginBottom: '5px',
                                fontWeight: 'bold',
                                color: '#333',
                            }}
                        >
                            Naziv destinacije:
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            className={`w-full p-2 border rounded mb-2 text-black ${errors.name ? "border-red-500" : ""}`}
                        />
                        {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
                    </div>   

                    <div style={{ marginBottom: '15px' }}>
                        <label
                            htmlFor="name"
                            style={{
                                display: 'block',
                                marginBottom: '5px',
                                fontWeight: 'bold',
                                color: '#333',
                            }}
                        >
                            Opis destinacije:
                        </label>
                        <textarea 
                            type="text"
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            className={`w-full p-2 border rounded mb-2 text-black ${errors.description ? "border-red-500" : ""}`}
                        />
                        {errors.description && <p className="text-red-500 text-sm">{errors.description}</p>}
                    </div>                   



                    <div style={{ marginBottom: '20px', position: 'relative' }}>
                        <label
                            htmlFor="images"
                            style={{
                                display: 'block',
                                marginBottom: '5px',
                                fontWeight: 'bold',
                                color: '#333',
                            }}
                        >
                            Dodaj slike:
                        </label>
                        <input
                            type="file"
                            id="images"
                            name="images"
                            accept="image/*"
                            multiple
                            onChange={handleImageChange}
                            style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
                            />
                            {errors.images && <p className="text-red-500 text-sm">{errors.images}</p>}
                            <div style={{ display: 'flex', flexWrap: 'wrap', marginTop: '10px' }}>
                            {formData.images.map((img, index) => (
                                <div key={index} style={{ marginRight: '10px', marginBottom: '10px', position: 'relative' }}>
                                <img
                                    src={img}
                                    alt={`preview-${index}`}
                                    style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '5px' }}
                                />
                                <button
                                    type="button"
                                    onClick={() => handleRemoveImage(index)}
                                    style={{
                                    position: 'absolute',
                                    top: '-8px',
                                    right: '-8px',
                                    backgroundColor: 'red',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '50%',
                                    width: '20px',
                                    height: '20px',
                                    cursor: 'pointer',
                                    }}
                                >
                                    ×
                                </button>
                                </div>
                            ))}
                        </div>
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



export default DestinationForm;