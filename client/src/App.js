import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Homepage from './pages/Homepage';
import Post from './pages/Post';
import Login from './pages/Login';
import Error from './pages/Error';
import { UserProvider } from './contexts/UserContext';

export default function App() {


  return (
    <UserProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Homepage />}></Route>
        <Route path="/login" element={<Login />}></Route>
        <Route path="/post/:postId" element={<Post />}></Route>
        <Route path="*" element={<Error />}></Route>
      </Routes>
    </BrowserRouter>
    </UserProvider>

  );
}
