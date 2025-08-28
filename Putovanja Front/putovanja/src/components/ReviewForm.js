import { useState } from 'react';
import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';

const ReviewForm = ({ onSave, onCancel }) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [text, setText] = useState('');

  const renderStar = (starIndex) => {
    const currentRating = hoverRating || rating;
    if (currentRating >= starIndex) {
      return <FaStar className="text-yellow-400 cursor-pointer" />;
    } else if (currentRating >= starIndex - 0.5) {
      return <FaStarHalfAlt className="text-yellow-400 cursor-pointer" />;
    } else {
      return <FaRegStar className="text-yellow-400 cursor-pointer" />;
    }
  };

  const handleClick = (starIndex) => {
    if (rating === starIndex) {
      setRating(starIndex - 0.5);
    } else if (rating === starIndex - 0.5) {
      setRating(starIndex);
    } else {
      setRating(starIndex);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (rating === 0) {
      alert('Molimo vas da odaberete ocenu.');
      return;
    }
    onSave({ rating, text });
    setRating(0);
    setText('');
  };

  return (
        <form
        onSubmit={handleSubmit}
        onClick={(e) => e.stopPropagation()}
        className="bg-white bg-opacity-95 backdrop-blur-sm rounded-lg p-6 max-w-xl mx-auto shadow-md relative"
        >
        <button
            type="button"
            onClick={onCancel}
            className="absolute top-2 right-3 text-gray-600 hover:text-gray-900 text-3xl font-bold"
            aria-label="Zatvori formu"
        >
            &times;
        </button>

        <h3 className="text-xl font-semibold mb-4 text-center">Dodajte recenziju</h3>

        <div className="flex justify-center items-center mb-6 space-x-4 text-yellow-400 text-5xl select-none">
            {[1, 2, 3, 4, 5].map((star) => (
            <span
                key={star}
                onClick={() => handleClick(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                role="button"
                tabIndex={0}
                aria-label={`${star} zvezdica`}
                className="cursor-pointer"
            >
                {renderStar(star)}
            </span>
            ))}
        </div>

        <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={4}
            placeholder="Opišite vaše utiske..."
            className="w-full border border-gray-300 rounded-md p-2 resize-none focus:outline-none focus:ring-2 focus:ring-yellow-400"
        />

        <button
            type="submit"
            className="mt-6 w-full bg-yellow-400 hover:bg-yellow-500 text-white font-semibold py-3 rounded-md shadow"
        >
            Sačuvaj
        </button>
        </form>

  );
};

export default ReviewForm;
