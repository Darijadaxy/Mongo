import { useState, useEffect } from "react";
import { updateUser, getUserProfile } from "../services/userService";

const UpdateProfileForm = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    phoneNumber: "",
    username: "",
    password: "",
  });

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!isOpen) return;

    const fetchProfile = async () => {
      try {
        const data = await getUserProfile();
        setFormData({
          phoneNumber: data.phoneNumber || "",
          username: data.username || "",
          password: "",
        });
      } catch (error) {
        console.error("Greška pri učitavanju profila:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [isOpen]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateUser(formData);
      setMessage("Profil uspešno ažuriran ✅");
      onClose();
    } catch (error) {
      console.error("Greška:", error);
      setMessage("Došlo je do greške pri ažuriranju ❌");
    }
  };

  if (!isOpen) return null;
  if (loading) return <p className="text-center mt-4 text-gray-700">Učitavanje podataka...</p>;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-gray-50 rounded-lg p-6 w-full max-w-md shadow-lg border border-gray-300">
        <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">Ažuriraj profil</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="phoneNumber"
            placeholder="Broj telefona"
            value={formData.phoneNumber}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
            required
          />
          <input
            type="text"
            name="username"
            placeholder="Korisničko ime"
            value={formData.username}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Nova lozinka"
            value={formData.password}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
          />
          <div className="flex justify-between mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded border border-gray-400 bg-gray-200 text-gray-800 hover:bg-gray-300"
            >
              Otkaži
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
            >
              Sačuvaj izmene
            </button>
          </div>
        </form>
        {message && (
          <p className="mt-4 text-center text-sm font-medium text-gray-800">{message}</p>
        )}
      </div>
    </div>
  );
};

export default UpdateProfileForm;


