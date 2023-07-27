import { useState, useEffect } from 'react';
import { formatDate } from '../utils';

export function PostCommentStats({ post }) {
  const [latestComment, setLatestComment] = useState('');
  const [totalComments, setTotalComments] = useState(0);

  useEffect(
    function () {
      // returns the total number of comments for post and latest comment
      async function fetchCommentData() {
        const res = await fetch(
          `http://192.168.1.203:8000/posts/${post.id}/comments?limit=1&page=1&sort=-created_at`
        );
        const { data } = await res.json();
        const { count } = data[0];
        setTotalComments(() => Number(count));
        setLatestComment(() => data[1][0]);
      }
      fetchCommentData();
    },
    [post]
  );

  return (
    <div>
      {latestComment && totalComments ? (
        <div>
          <p>
            <b>
              {totalComments} | {[post.comment_number]}
            </b>{' '}
            comments
          </p>
          <p>
            last by {latestComment.author.username}{' '}
            {formatDate(latestComment.created_at, {
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
