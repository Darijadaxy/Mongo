export const validateDestinationForm = (formData) => {
  const errors = {};
  if (!formData.name) errors.name = "*Naziv destinacije je obavezan";
  if (!formData.description) errors.description = "*Opis destinacije je obavezan";
  if (formData.images.length === 0) errors.images = "*Potrebno je dodati barem jednu sliku";
  return errors;
};

export const validateReservationForm = (formData) => {
  const errors = {};
  if (!formData.date) errors.date = "*Datum putovanja je obavezan";
  if (!formData.numberOfPeople) errors.numberOfPeople = "*Broj ljudi je obavezan";
  return errors;
};
