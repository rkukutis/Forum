import { useState } from 'react';

export default function LoginRegisterForm({ onLogin }) {
  const [error, setError] = useState(null);
  const [action, setAction] = useState('login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [email, setEmail] = useState('');

  const data = {
    username,
    password,
    email,
  };

  const handleUsername = (e) => setUsername(e.target.value);
  const handlePassword = (e) => setPassword(e.target.value);
  const handlePasswordConfirm = (e) => setPasswordConfirm(e.target.value);
  const handleEmail = (e) => setEmail(e.target.value);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!username && passwordConfirm)
      return setError('Username not specified!');
    if (!password) return setError('Password not specified!');
    if (password !== passwordConfirm && passwordConfirm)
      return setError('Passwords do not match');
    if (!email && passwordConfirm) return setError('Email not specified!');
    registerLoginUser(data);
    setUsername('');
    setPassword('');
    setPasswordConfirm('');
    setEmail('');
  };

  const registerLoginUser = async (obj) => {
    const res = await fetch(
      `http://localhost:8000/auth/${action === 'login' ? 'login' : 'signup'}`,
      {
        method: 'POST',
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(obj),
      }
    );
    const data = await res.json();
    if (!data.error) onLogin(data.user);
  };

  return (
    <>
      {error && <h2>{error}</h2>}
      <button onClick={() => setAction('login')}>Log in</button>
      <button onClick={() => setAction('register')}>Register</button>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">Email</label>
          <input id="email" value={email} onChange={handleEmail} />
        </div>
        {action === 'register' && (
          <div>
            <label htmlFor="username">Username</label>
            <input id="username" value={username} onChange={handleUsername} />
          </div>
        )}
        <div>
          <div>
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={handlePassword}
            />
          </div>
          {action === 'register' && (
            <div>
              <label htmlFor="passwordConfirm">Password Confirmation</label>
              <input
                id="passwordConfirm"
                type="password"
                value={passwordConfirm}
                onChange={handlePasswordConfirm}
              />
            </div>
          )}
        </div>
        <button type="submit">submit</button>
      </form>
    </>
  );
}
