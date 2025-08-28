import { Routes, Route } from "react-router-dom";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Profile from "../pages/Profile";
import Home from "../pages/Home";
import TripDetails from "../components/TripDetails";
import DestinationDetails from "../pages/DestinationDetails";
import FirstPage from "../pages/FirstPage";
import AdminPageAllTrips from "../pages/AdminPageAllTrips";
import Destinations from "../pages/Destinations";
import AllReservations from "../pages/AllReservations";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<FirstPage/>} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/profile" element={<Profile />}/>
      <Route path="/home" element={<Home />}/>
      <Route path="/trip/:id" element={<TripDetails/>} />
      <Route path="/destination/:id" element={<DestinationDetails />} />
      <Route path="/admin/alltrips" element={<AdminPageAllTrips/>} />
      <Route path="/admin/alldestinations" element={<Destinations />} />
      <Route path="/admin/allreservations" element={<AllReservations />} />

    </Routes>
  );
};

export default AppRoutes;
