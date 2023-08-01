import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Navigate } from 'react-router-dom';
import AllPosts from './pages/AllPosts';
import Post from './pages/Post';
import Auth from './pages/Auth';
import Error from './pages/Error';
import Homepage from './pages/Homepage';
import Login from './pages/Login';
import Register from './pages/Register';
import { UserProvider } from './contexts/UserContext';

export default function App() {
  return (
    <UserProvider>
      <BrowserRouter>
        <Routes>
          <Route index element={<Homepage />} />
          <Route path="/posts" element={<AllPosts />} />
          <Route path="/posts/:postId" element={<Post />} />
          <Route path="/auth" element={<Auth />}>
            <Route index element={<Navigate replace to={'login'} />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
          </Route>
          <Route path="*" element={<Error />}></Route>
        </Routes>
      </BrowserRouter>
    </UserProvider>
  );
}
