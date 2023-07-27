import Comment from './Comment';

function CommentContainer({ comments }) {
  return (
    <div className="comment-container">
      {comments.map((comment) => (
        <Comment comment={comment} key={comment.id} />
      ))}
    </div>
  );
}

export default CommentContainer;
