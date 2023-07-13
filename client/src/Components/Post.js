import { useEffect, useState } from 'react';
import { formatDate } from '../utils';

export default function PostContainer() {
  const [post, setPost] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(function () {
    async function fetchPost() {
      try {
        setIsLoading(true);
        const res = await fetch('http://192.168.1.203:8000/posts/7');
        const { data } = await res.json();
        console.log(data);
        setPost(data);
      } catch (err) {
        setError(err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchPost();
  }, []);

  return (
    <div>
      {isLoading && <h1>Loading...</h1>}
      {post && (
        <div>
          {/* Post title and date */}
          <h1>{post.title}</h1>
          <h2>{post && formatDate(post.created_at)}</h2>

          <Author author={post.author} />

          <div className="post-body">
            <p>{post.body}</p>
          </div>

          {/* If the post doesn't have any comments yet */}
          {[...post.comments].length === 0 ? (
            <h1>
              This post doesn't have any comments :(. You can start the
              conversation :)
            </h1>
          ) : (
            <CommentContainer comments={post.comments} />
          )}
        </div>
      )}
      {error && (
        <h1>
          There was an error fetching this post. Please try again later :)
        </h1>
      )}
    </div>
  );
}

function Author({ author }) {
  return (
    <div className="author-info">
      <h2>{author.username}</h2>
      <img
        src={`http://192.168.1.203:8000/userPhotos/user_${author.id}.jpg`}
        alt={`User ${author.username}`}
      />
      <h3>{[author.status, author.role].join(' ')} </h3>
      <h3>Joined {formatDate(author.created_at, { dateStyle: 'medium' })}</h3>
    </div>
  );
}

function CommentContainer({ comments }) {
  return (
    <div className="comment-container">
      {comments.map((comment) => (
        <Comment comment={comment} key={comment.id} />
      ))}
    </div>
  );
}

function Comment({ comment }) {
  return (
    <div>
      <Author author={comment.author} />
      <p>{comment.body}</p>
      <h3>{formatDate(comment.created_at)}</h3>
    </div>
  );
}
