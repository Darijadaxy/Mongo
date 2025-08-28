import { getAuthHeaders } from "../utils/authHeaders";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

export const createDestination = async (data) => {
  const response = await fetch(`${API_BASE_URL}/Destination/createDestination`, {
    method: "POST",
    headers: getAuthHeaders(), 
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorMessage = await response.text();
    throw new Error(errorMessage);
  }

  return await response.json();
};

export const getDestination = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/Destination/getDestination/${id}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Greška pri preuzimanju destinacije.');
    }

    return await response.json();
  } catch (error) {
    console.error('Greška:', error);
    throw error;
  }
};

export const getAllDestinations = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/Destination/getAllDestinations/`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Greška pri preuzimanju svih destinacija.');
    }

    return await response.json();
  } catch (error) {
    console.error('Greška:', error);
    throw error;
  }
};

export const deleteDestination = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/Destination/deleteDestination/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });

     if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || "Greška prilikom brisanja destinacije");
    }

    const message = await response.text();
    return { message }; 

  } catch (error) {
      console.error('Greška:', error);
      throw error;
  }
};

export const updateDestination = async (id, updatedData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/Destination/updateDestination/${id}`, {
      method: 'PUT',
      headers:getAuthHeaders(),
      body: JSON.stringify(updatedData),
    });

    if (!response.ok) {
      throw new Error('Greška pri ažuriranju destinacije');
    }

    return await response.text();
  } catch (error) {
    console.error('Greška:', error);
    throw error;
  }
};