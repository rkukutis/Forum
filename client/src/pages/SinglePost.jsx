import Footer from '../components/Footer';
import Header from '../components/Header';
import MainPost from '../components/MainPost';
import CommentContainer from '../components/CommentContainer';

function SinglePost() {
  return (
    <>
      <Header />
      <MainPost />
      <CommentContainer />
      <Footer />
    </>
  );
}

export default SinglePost;
