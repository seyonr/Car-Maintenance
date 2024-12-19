import React, { useState } from 'react';
import { auth, db } from '../../FirebaseConfig';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
// import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const Auth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState('');
  const [userId, setUserId] = useState(null); 

  const navigate = useNavigate();

  // Register New User
  const handleRegister = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Add user to Firestore
      await setDoc(doc(db, 'users', user.uid), {
        name: name,
        email: email,
      });

      alert('Registration successful!');
    } catch (err) {
      setError(err.message);
    }
  };

  // Login Existing User
  const handleLogin = async () => {
    try {
    //   await signInWithEmailAndPassword(auth, email, password);
    //   alert('Login successful!');

        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        setUserId(user.uid);
        navigate(`/cars/${user.uid}`); // This links to the navigate page
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <h2>{isRegistering ? 'Register' : 'Login'}</h2>

      {isRegistering && (
        <div>
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
      )}

      <div>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div>
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      <button onClick={isRegistering ? handleRegister : handleLogin}>
        {isRegistering ? 'Register' : 'Login'}
      </button>

      <p>
        {isRegistering ? 'Already have an account?' : "Don't have an account?"}{' '}
        <span
          style={{ cursor: 'pointer', color: 'blue' }}
          onClick={() => setIsRegistering(!isRegistering)}
        >
          {isRegistering ? 'Login' : 'Register'}
        </span>
      </p>

      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default Auth;

