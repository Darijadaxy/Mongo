import { getAuthHeaders } from "../utils/authHeaders";
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

export const getSavedTrips = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/User/getSavedTrips`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Greška pri dohvatanju sačuvanih putovanja');
    }

    return await response.json();
  } catch (error) {
    console.error('Greška:', error);
    throw error;
  }
};

export const getUserReservations = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/Reservation/getUserReservations`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Greška pri dohvatanju rezervacija');
    }

    return await response.json();
  } catch (error) {
    console.error('Greška:', error);
    throw error;
  }
};

export const saveTrip = async (tripId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/User/saveTrip/${tripId}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Greška pri čuvanju putovanja');
    }

    return await response.text();
  } catch (error) {
    console.error('Greška:', error);
    throw error;
  }
};

export const unSaveTrip = async (tripId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/User/unSaveTrip/${tripId}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Greška pri uklanjanju sačuvanog putovanja');
    }

    return await response.text();
  } catch (error) {
    console.error('Greška:', error);
    throw error;
  }
};

export const updateUser = async (userData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/User/updateUser`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      throw new Error('Greška pri ažuriranju korisnika');
    }

    return await response.text();
  } catch (error) {
    console.error('Greška:', error);
    throw error;
  }
};
export const getUserProfile = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/User/getUser`, {
      method: "GET",
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error("Greška pri dohvatanju profila korisnika");
    }

    return await response.json();
  } catch (error) {
    console.error("Greška:", error);
    throw error;
  }
};

export const deleteProfile = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/User/deleteProfile`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Greška pri brisanju profila -verovatno ima rezervacija');
    }

    return await response.text();
  } catch (error) {
    console.error('Greška:', error);
    throw error;
  }
};