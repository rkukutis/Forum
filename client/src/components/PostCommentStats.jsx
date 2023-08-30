import { formatDate } from '../utils';

export function PostCommentStats({ post }) {
  return (
    <div>
      {post.comment_number ? (
        <div>
          <p>
            <b>{post.comment_number}</b> comments
          </p>
          <p>
            last by {post.latestComment.author}{' '}
            {formatDate(post.latestComment.date, {
              dateStyle: 'short',
              timeStyle: 'short',
            })}
          </p>
        </div>
      ) : (
        <div>No comments yet</div>
      )}
    </div>
  );
}
