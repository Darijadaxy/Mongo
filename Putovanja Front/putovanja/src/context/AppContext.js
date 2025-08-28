import React, { createContext, useState, useEffect } from "react";

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [korisnik, setKorisnik] = useState(null);
  const [jeAdmin, setJeAdmin] = useState(false);

  useEffect(() => {
    tryLoad();
  }, []);

  const tryLoad = async () => {
    const token = sessionStorage.getItem("jwt");
    if (token) {
      try {
        const response = await fetch("https://localhost:7080/User/getLoggedInUser", {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (response.ok) {
          const data = await response.json();
          setKorisnik(data);
          setJeAdmin(data.isAdmin);
          sessionStorage.setItem("mojiID", `${data.id}`);
        } else {
          sessionStorage.removeItem("jwt");
        }
      } catch (error) {
        console.error("Greška:", error.message);
      }
    }
  };

  return (
    <AppContext.Provider value={{ korisnik, jeAdmin, tryLoad, setKorisnik }}>
      {children}
    </AppContext.Provider>
  );
};
