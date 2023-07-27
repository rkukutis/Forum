import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import cookies from 'js-cookies';

import Homepage from './pages/Homepage';
import Post from './pages/Post';
import Login from './pages/Login';
import Error from './pages/Error';

export default function App() {
  const [loggedinUser, setLoggedinUser] = useState(null);

  // This gets checks if an user is logged in
  // TODO: learn to use global state
  useEffect(function () {
    async function checkUserExists() {
      // check for cookie with jwt
      if (!cookies.getItem('jwt')) return;

      // check jwt validity
      const res = await fetch(`http://localhost:8000/auth/checkUser`, {
        method: 'POST',
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await res.json();
      if (data.status === 'ok') setLoggedinUser(data.user);
    }
    checkUserExists();
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Homepage />}></Route>
        <Route path="/login" element={<Login />}></Route>
        <Route path="/post/:postId" element={<Post />}></Route>
        <Route path="*" element={<Error />}></Route>
      </Routes>
    </BrowserRouter>
  );
}
