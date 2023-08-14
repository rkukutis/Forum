import { useComments } from '../contexts/CommentContext';
import Comment from './Comment';

function CommentContainer() {
  const { comments } = useComments();
  console.log(comments);

  return (
    <div className="comment-container">
      {comments.map((comment) => (
        <Comment comment={comment} key={comment.id} />
      ))}
    </div>
  );
}

export default CommentContainer;
