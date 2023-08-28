import Footer from '../components/Footer';
import Header from '../components/Header';
import PostPreviewContainer from '../components/PostPreviewContainer';
import { PostsProvider } from '../contexts/PostsContext';

function Posts() {
  return (
    <div className="app">
      <Header />
      <PostsProvider>
        <PostPreviewContainer />
      </PostsProvider>
      <Footer />
    </div>
  );
}

export default Posts;
