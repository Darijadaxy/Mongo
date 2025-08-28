import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom'; 
import Slider from 'react-slick';
import { getDestination } from "../services/destinationService";
import Header from '../components/Header';

export default function DestinationDetails() {
  const { id } = useParams(); 
  const [destination, setDestination] = useState(null);

  useEffect(() => {
    const fetchDestination = async () => {
      try {
        const data = await getDestination(id);
        setDestination(data);
      } catch (error) {
        console.error('Greška pri preuzimanju destinacije:', error);
      }
    };

    fetchDestination();
  }, [id]);

  if (!destination) {
    return <p>Učitavanje...</p>;
  }

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  return (
    <>
        <Header />
        <div className="px-5 py-5 max-w-3xl mx-auto">
        <div className="bg-gray-100 p-6 rounded-lg shadow-md mb-8">
            <h1 className="text-center text-3xl font-bold text-gray-800 mb-4">
            {destination.name}
            </h1>
            <p className="text-base leading-relaxed text-gray-600">
            {destination.description}
            </p>
        </div>

        {destination.images && destination.images.length > 0 && (
            <Slider {...sliderSettings}>
            {destination.images.map((imgUrl, index) => (
                <div key={index}>
                <img
                    src={imgUrl}
                    alt={`Destinacija slika ${index + 1}`}
                    className="w-full h-auto rounded-lg shadow-md"
                />
                </div>
            ))}
            </Slider>
        )}
        </div>
    </>
    );

}