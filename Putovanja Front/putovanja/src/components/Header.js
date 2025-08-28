import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { FaUser, FaCog } from "react-icons/fa";
import UpdateProfileForm from "./UpdateProfileForm";
import { deleteProfile } from '../services/userService';

const Header = () => {
  const { korisnik, jeAdmin, setKorisnik } = useContext(AppContext);
  const navigate = useNavigate();
  const [openDropdown, setOpenDropdown] = useState(false);
  const [isUpdateProfileOpen, setIsUpdateProfileOpen] = useState(false);

  const handleLogoutClick = () => {
    sessionStorage.removeItem("jwt");
    setKorisnik(null);
    navigate("/");
  };

  const handleHeaderClick = () => {
    navigate("/home");
  };

  const toggleDropdown = () => {
    setOpenDropdown((prev) => !prev);
  };

  return (
    <header className="sticky top-0 bg-blue-500 text-white shadow-md z-50 w-full">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <button
          onClick={handleHeaderClick}
          className="text-lg font-bold hover:text-gray-200"
        >
          Travel agency
        </button>

        {korisnik ? (
          <div className="flex items-center space-x-6">
            <button
              onClick={() => navigate("/profile")}
              className="hover:text-gray-200"
              title="Profil"
            >
              <FaUser className="h-6 w-6" />
            </button>

            <div className="flex items-center relative">
              <button
                onClick={toggleDropdown}
                className="hover:text-gray-200"
                title="Podešavanja"
              >
                <FaCog className="h-6 w-6" />
              </button>

              {openDropdown && (
                <div className="absolute right-0 top-full mt-2 w-40 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 text-black z-50">
                  <button
                    onClick={() => {
                      setIsUpdateProfileOpen(true);
                      setOpenDropdown(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-sm hover:bg-blue-100 rounded-t-md"
                  >
                    Ažuriraj profil
                  </button>
                  {jeAdmin && (<button
                    onClick={() => {
                      navigate("/admin/alltrips");
                      setOpenDropdown(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-sm hover:bg-blue-100 rounded-t-md"
                  >
                    Sva putovanja
                  </button>)}

                  {jeAdmin && (<button
                    onClick={() => {
                      navigate("/admin/alldestinations");
                      setOpenDropdown(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-sm hover:bg-blue-100 rounded-t-md"
                  >
                    Sve destinacije
                  </button>)}
                  {jeAdmin && (<button
                    onClick={() => {
                      navigate("/admin/allreservations");
                      setOpenDropdown(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-sm hover:bg-blue-100 rounded-t-md"
                  >
                    Sve rezervacije
                  </button>)}

                  <button
                    onClick={() => {
                      handleLogoutClick();
                      setOpenDropdown(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-100 rounded-b-md"
                  >
                    Odjavi se
                  </button>
                  <button
                    onClick={async () => {
                      const confirmDelete = window.confirm(
                        "Da li ste sigurni da želite da obrišete profil? Ova akcija je nepovratna!"
                      );
                      if (!confirmDelete) return;

                      try {
                        await deleteProfile();
                        alert("Profil je uspešno obrisan.");
                        setKorisnik(null);
                        navigate("/login");
                      } catch (error) {
                        alert("Greška pri brisanju profila - verovatno imate rezervacije.");
                        console.error(error);
                      }
                    }}
                    className="block w-full text-left px-4 py-2 text-sm hover:bg-red-100 rounded-t-md text-red-600"
                  >
                    Obriši profil

                  </button>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="flex space-x-4">
            <button
              onClick={() => navigate("/login")}
              className="bg-blue-700 hover:bg-blue-600 px-3 py-1 rounded"
            >
              Loguj se
            </button>
            <button
              onClick={() => navigate("/register")}
              className="bg-green-600 hover:bg-green-500 px-3 py-1 rounded"
            >
              Registruj se
            </button>
          </div>
        )}
      </div>
      <UpdateProfileForm
        isOpen={isUpdateProfileOpen}
        onClose={() => setIsUpdateProfileOpen(false)}
      />
    </header>
  );
};

export default Header;
