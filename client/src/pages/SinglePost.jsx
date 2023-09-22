import MainPost from "../features/originalPost/MainPost";
import CommentContainer from "../features/comments/CommentContainer";
import Button from "../ui/Button";

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
