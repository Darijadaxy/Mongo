const UserInfo = ({ korisnik }) => {
  if (!korisnik) return null;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md max-w-xl mx-auto">
      <p><span className="font-semibold mr-2">Ime:</span>{korisnik.name}</p>
      <p><span className="font-semibold mr-2">Prezime:</span>{korisnik.surname}</p>
      <p><span className="font-semibold mr-2">Korisničko ime:</span>{korisnik.username}</p>
      <p><span className="font-semibold mr-2">Telefon:</span>{korisnik.phoneNumber}</p>
      <p><span className="font-semibold mr-2">Email:</span>{korisnik.email}</p>
    </div>
  );
};

export default UserInfo;
