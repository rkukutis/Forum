import Footer from '../components/Footer';
import Header from '../components/Header';
import MainPost from '../components/MainPost';
import { CommentsProvider } from '../contexts/CommentContext';
import { MainPostProvider } from '../contexts/MainPostContext';
import CommentContainer from '../components/CommentContainer';

function SinglePost() {
  // TODO wire up mainpost and comment data to components

  return (
    <>
      <Header />
      <MainPostProvider>
        <MainPost />
      </MainPostProvider>
      <CommentsProvider>
        <CommentContainer />
      </CommentsProvider>
      <Footer />
    </>
  );
}

export default SinglePost;
