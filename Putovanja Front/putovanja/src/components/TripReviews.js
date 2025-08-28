import { useEffect, useState } from 'react';
import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';
import { FaChevronDown, FaChevronRight } from 'react-icons/fa';
import { getReviews } from '../services/tripService';

const StarRating = ({ rating }) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    if (rating >= i) stars.push(<FaStar key={i} className="text-yellow-400 inline" />);
    else if (rating >= i - 0.5) stars.push(<FaStarHalfAlt key={i} className="text-yellow-400 inline" />);
    else stars.push(<FaRegStar key={i} className="text-yellow-400 inline" />);
  }
  return <span>{stars}</span>;
};

const TripReviews = ({ tripId, reviewsChanged }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const data = await getReviews(tripId);
        setReviews(data);
      } catch (error) {
        console.error('Greška pri učitavanju recenzija:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [tripId, reviewsChanged]);

  if (loading) return <p>Učitavanje recenzija...</p>;

  const reviewCount = reviews.length;

  return (
    <div className="max-w-4xl mx-auto my-8">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center text-xl font-semibold mb-4 focus:outline-none"
        aria-expanded={expanded}
        aria-controls="reviews-list"
      >
        Recenzije putovanja ({reviewCount})
        <span className="ml-2 text-yellow-600">
          {expanded ? <FaChevronDown /> : <FaChevronRight />}
        </span>
      </button>

      {expanded && reviewCount === 0 && <p>Još nema recenzija za ovo putovanje.</p>}

      {expanded && reviewCount > 0 && (
        <div id="reviews-list" className="space-y-6">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="border rounded-md p-4 shadow-sm bg-white"
            >
              <StarRating rating={review.rating} />
              <p className="mt-2 text-gray-700">{review.text}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TripReviews;
