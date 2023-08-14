import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Navigate } from 'react-router-dom';
import AllPosts from './pages/AllPosts';
import Auth from './pages/Auth';
import Error from './pages/Error';
import Login from './pages/Login';
import Register from './pages/Register';
import { UserProvider } from './contexts/UserContext';
import SinglePost from './pages/SinglePost';

export default function App() {
  return (
    <UserProvider>
      <BrowserRouter>
        <Routes>
          <Route index element={<Navigate to="/posts" />} />
          <Route path="/posts" element={<AllPosts />} />
          <Route path="/posts/:postId" element={<SinglePost />} />
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
