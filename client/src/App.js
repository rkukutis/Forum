import { BrowserRouter, Routes, Route } from 'react-router-dom';

import AllPosts from './pages/AllPosts';
import Post from './pages/Post';
import Login from './pages/Login';
import Error from './pages/Error';
import Homepage from './pages/Homepage';
import { UserProvider } from './contexts/UserContext';

export default function App() {


  return (
    <UserProvider>
      <BrowserRouter>
        <Routes>
          <Route index element={<Homepage />}/>
          <Route path="/posts" element={<AllPosts />}/>
          <Route path="/posts/:postId" element={<Post />}/>
          <Route path="/login" element={<Login />}></Route>
          <Route path="*" element={<Error />}></Route>
        </Routes>
      </BrowserRouter>
    </UserProvider>

  );
}
