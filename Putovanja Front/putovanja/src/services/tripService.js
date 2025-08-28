import { getAuthHeaders } from "../utils/authHeaders";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

export const getAllTrips = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/Trip/getAllTrips`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Greška pri dohvatanju putovanja');
    }
    console.log(response.data);
    return await response.json();
  } catch (error) {
    console.error('Greška:', error);
    throw error;
  }
};

export const getAvailableTrips = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/Trip/getAvailableTrips`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Greška pri dohvatanju putovanja');
    }
    console.log(response.data);
    return await response.json();
  } catch (error) {
    console.error('Greška:', error);
    throw error;
  }
};

export const getTripById = async (tripId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/Trip/getTripDetails/${tripId}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Greška pri dohvatanju putovanja sa ID: ${tripId}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Greška:', error);
    throw error;
  }
};

export const getReviews = async (tripId) =>{
  try {
    const response = await fetch(`${API_BASE_URL}/Trip/getReviews/${tripId}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Greška pri dohvatanju putovanja sa ID: ${tripId}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Greška:', error);
  }
};

export const addReview = async (tripId, reviewDTO) => {
  try {
    const response = await fetch(`${API_BASE_URL}/Trip/addReview/${tripId}`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(reviewDTO),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || 'Greška pri dodavanju recenzije');
    }

    const resultText = await response.text();
    return resultText;
  } catch (error) {
    console.error('Greška:', error);
    throw error;
  }
};

export const deleteTrip = async (tripId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/Trip/deleteTrip/${tripId}`, {
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

export const createTrip = async (tripDTO) => {
  try {
    const response = await fetch(`${API_BASE_URL}/Trip/createTrip`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
      body: JSON.stringify(tripDTO),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || "Greška pri kreiranju putovanja");
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Greška:", error);
    throw error;
  }
};

export const updateTrip = async (tripId, tripDTO) => {
  try {
    const response = await fetch(`${API_BASE_URL}/Trip/updateTrip/${tripId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
      body: JSON.stringify(tripDTO),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || "Greška pri ažuriranju putovanja");
    }

    const resultText = await response.text();
    return resultText;
  } catch (error) {
    console.error("Greška:", error);
    throw error;
  }
};
export const searchTrips = async (query) => {
  try {
    const response = await fetch(`${API_BASE_URL}/Trip/search?query=${encodeURIComponent(query)}`, {
      method: "GET",
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error("Greška pri pretrazi putovanja");
    return await response.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const filterTrips = async (filter) => {
  try {
    const queryString = new URLSearchParams(filter).toString();

    const response = await fetch(`${API_BASE_URL}/Trip/filter?${queryString}`, {
      method: "GET",
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error("Greška pri pretrazi putovanja");
    return await response.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
};

