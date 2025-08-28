export const getAuthHeaders = () => {
  const token = sessionStorage.getItem('jwt');
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };
};