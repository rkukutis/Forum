import MainPost from "../components/MainPost";
import CommentContainer from "../components/CommentContainer";
import Button from "../components/Button";

function SinglePost() {
  return (
    <div className="px-4 py-5">
      <MainPost />
      <CommentContainer />
      <Button to="/posts">Back to posts</Button>
    </div>
  );
}

export default SinglePost;
