import Footer from '../components/Footer';
import Header from '../components/Header';
import PostPreviewContainer from '../components/PostPreviewContainer';

function Homepage() {
  return (
    <div className="app">
      <Header />
      <PostPreviewContainer />
      <Footer />
    </div>
  );
}

export default Homepage;
