import useAuth from '../hooks/useAuth';
import UserInfo from '../components/UserInfo';
import Tabs from '../components/ui/Tabs';
import SavedTrips from '../components/SavedTrips';
import Reservations from '../components/Reservations';
import Header from '../components/Header';

const Profile = () => {
  const { korisnik } = useAuth();

  if (!korisnik) {
    return <p className="text-center mt-12">Niste ulogovani.</p>;
  }

  const tabs = [
    {
      label: 'Sačuvana putovanja',
      content: <SavedTrips />,
    },
    {
      label: 'Rezervacije',
      content: <Reservations />,
    },
  ];

  return (
    <>
    <Header/>
      <div className="p-8">
        <h1 className="text-3xl font-bold text-center mb-8">Profil</h1>
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-1/3 w-full">
            <UserInfo korisnik={korisnik} />
          </div>
          <div className="lg:w-2/3 w-full">
            <Tabs tabs={tabs} />
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;




