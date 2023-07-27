import { formatDate } from '../utils';
import Author from '../components/Author';

function Comment({ comment }) {
  return (
    <div>
      <Author author={comment.author} />
      <h2>Comment ID: {comment.id}</h2>
      <p>{comment.body}</p>
      <h3>{formatDate(comment.created_at)}</h3>
    </div>
  );
}

export default Comment;
