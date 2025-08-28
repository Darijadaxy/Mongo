import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import myImage from '../assets/putovanja.jpg';
import { registerUser } from '../services/authService';

export default function Register() {
  const [ime, setIme] = useState('');
  const [prezime, setPrezime] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [sifra, setSifra] = useState('');
  const [telefon, setTelefon] = useState('');
  const [greska, setGreska] = useState(null);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const korisnik = {
      Name: ime,
      Surname: prezime,
      Email: email,
      Username: username,
      Password: sifra,
      PhoneNumber: telefon,
    };

    try {
      await registerUser(korisnik);
      alert('Korisnik uspešno registrovan!');
      navigate('/login');
    } catch (error) {
      setGreska(error.message || 'Došlo je do greške prilikom registracije.');
    }
  };

  return (
    <div style={styles.container}>
      <form onSubmit={handleSubmit} style={styles.form}>
        <h2 style={styles.title}>Registracija</h2>
        {greska && <p style={styles.error}>{greska}</p>}
        <div style={styles.inputGroup}>
          <label htmlFor="ime">Ime:</label>
          <input
            type="text"
            id="ime"
            value={ime}
            onChange={(e) => setIme(e.target.value)}
            required
            style={styles.input}
          />
        </div>
        <div style={styles.inputGroup}>
          <label htmlFor="prezime">Prezime:</label>
          <input
            type="text"
            id="prezime"
            value={prezime}
            onChange={(e) => setPrezime(e.target.value)}
            required
            style={styles.input}
          />
        </div>
        <div style={styles.inputGroup}>
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            style={styles.input}
          />
        </div>
        <div style={styles.inputGroup}>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={styles.input}
          />
        </div>
        <div style={styles.inputGroup}>
          <label htmlFor="sifra">Šifra:</label>
          <input
            type="password"
            id="sifra"
            value={sifra}
            onChange={(e) => setSifra(e.target.value)}
            required
            style={styles.input}
          />
        </div>
        <div style={styles.inputGroup}>
          <label htmlFor="telefon">Telefon:</label>
          <input
            type="text"
            id="telefon"
            value={telefon}
            onChange={(e) => setTelefon(e.target.value)}
            style={styles.input}
          />
        </div>

        <button type="submit" style={styles.button}>
          Registruj se
        </button>
      </form>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backgroundImage: `url(${myImage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
  },
  form: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: '40px',
    borderRadius: '12px',
    boxShadow: '0px 0px 15px rgba(0, 0, 0, 0.2)',
    width: '400px',
    minHeight: '500px',
  },
  title: {
    textAlign: 'center',
    marginBottom: '30px',
    fontSize: '24px',
    fontWeight: 'bold',
  },
  inputGroup: {
    marginBottom: '20px',
  },
  input: {
    width: '100%',
    padding: '12px',
    borderRadius: '6px',
    border: '1px solid #ddd',
    fontSize: '16px',
  },
  button: {
    width: '100%',
    padding: '12px',
    backgroundColor: '#4CAF50',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '16px',
  },
  error: {
    color: 'red',
    textAlign: 'center',
    fontSize: '14px',
  },
};
