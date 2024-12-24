import React, { useState } from 'react';
import { auth, db } from '../../FirebaseConfig';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import './Auth.css'

export default function Auth(){
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState('');
  const [userId, setUserId] = useState(null); 

  const navigate = useNavigate();

  // Register New User
  async function handleRegister(){
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
  async function handleLogin(){
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        setUserId(user.uid);
        // Navigating to list of cars matching user
        navigate(`/cars/${user.uid}`); 
    } catch (err) {
      setError(err.message);
    }
  };

  return (
  <div className='auth-main'>
    <h1>Car Maintenance Tracker</h1>
    <h4>Built By : SR</h4>
    <div className='auth-form'>
      <h2>{isRegistering ? 'Register' : 'Login'}</h2>

      {isRegistering && (
        <div className='name-form form'>
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
      )}

      <div className='email-form form'>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div className='password-form form'>
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      <button onClick={isRegistering ? handleRegister : handleLogin} className='button'>
        {isRegistering ? 'Register' : 'Login'}
      </button>

      <p className='bottom-p'>
        {isRegistering ? 'Already have an account?' : "Don't have an account?"}{' '}
        <span className='special-p' onClick={() => setIsRegistering(!isRegistering)}>{isRegistering ? 'Login' : 'Register'}</span>
      </p>

      {error && <p style={{ color: 'red' }} className='error-p'>{error}</p>}
    </div>
    </div>
  );
};

