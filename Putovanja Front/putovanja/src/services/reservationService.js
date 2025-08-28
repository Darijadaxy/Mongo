import { getAuthHeaders } from "../utils/authHeaders";
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

export const updateReservation = async (id, updatedData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/Reservation/updateReservation/${id}`, {
      method: 'PUT',
      headers:getAuthHeaders(),
      body: JSON.stringify(updatedData),
    });

    if (!response.ok) {
      throw new Error('Greška pri ažuriranju rezervacije');
    }

    return await response.text();
  } catch (error) {
    console.error('Greška:', error);
    throw error;
  }
};


export const  updateReservationStatus=async (id, status)=>
{
      try {
    const response = await fetch(`${API_BASE_URL}/Reservation/updateReservationStatus/${id}/${status}`, {
      method: 'PUT',
      headers:getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Greška pri ažuriranju statusa');
    }
    return await response.text();
  } catch (error) {
    console.error('Greška:', error);
    throw error;
  }

};

export const getTripReservations = async (tripId) =>{
  try {
    const response = await fetch(`${API_BASE_URL}/Reservation/getTripReservations/${tripId}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Greška pri dohvatanju rezervacija putovanja sa ID: ${tripId}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Greška:', error);
    
  }
};

export const addReservation = async (data) => {
  const response = await fetch(`${API_BASE_URL}/Reservation/AddReservation`, {
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

export const getAllReservations = async () =>{
  try {
    const response = await fetch(`${API_BASE_URL}/Reservation/getAllReservations`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Greška pri dohvatanju rezervacija` );
    }
    return await response.json();
  } catch (error) {
    console.error('Greška:', error);
    
  }
};


export const deleteReservation = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/Reservation/deleteReservation/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Greška pri brisanju rezervacije');
    }

    return await response.text();
  } catch (error) {
    console.error('Greška:', error);
    throw error;
  }
};