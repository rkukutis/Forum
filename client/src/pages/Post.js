import { useEffect, useState } from 'react';
import { formatDate } from '../utils';
import Author from '../components/Author';
import SettingsTab from '../components/SettingsTab';
import CommentContainer from '../components/CommentContainer';
import { useParams } from 'react-router-dom';

export default function PostContainer() {
  const [post, setPost] = useState('');
  const [totalNumComments, setTotalNumComments] = useState(null);
  const [comments, setComments] = useState([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [commentSortSettings, setCommentSortSettings] = useState({
    limit: 25,
    page: 1,
    sortBy: 'created_at',
    sortDesc: true,
  });

  const { postId } = useParams();
  useEffect(
    function () {
      async function fetchPost() {
        try {
          setIsLoading(true);
          const res = await fetch(`http://192.168.1.203:8000/posts/${postId}`);
          const { data } = await res.json();
          setPost(data);
        } catch (err) {
          setError(err);
        } finally {
          setIsLoading(false);
        }
      }

      fetchPost();
    },
    [postId]
  );

  useEffect(
    function () {
      async function fetchComments() {
        try {
          setIsLoading(true);
          const res = await fetch(
            `http://192.168.1.203:8000/posts/${postId}/comments?limit=${
              commentSortSettings.limit
            }&page=${commentSortSettings.page}&sort=${
              commentSortSettings.sortDesc ? '-' : ''
            }${commentSortSettings.sortBy}`
          );
          const {
            data: [{ count }, comments],
          } = await res.json();
          setComments(comments);
          setTotalNumComments(Number(count));
        } catch (err) {
          setError(err);
        } finally {
          setIsLoading(false);
        }
      }
      fetchComments();
    },
    [commentSortSettings, postId]
  );

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
          {comments.length === 0 ? (
            <h1>
              This post doesn't have any comments :(. You can start the
              conversation :)
            </h1>
          ) : (
            <>
              <SettingsTab
                entryType={'comments'}
                settings={commentSortSettings}
                onSetSettings={setCommentSortSettings}
                totalNumEntries={totalNumComments}
              />
              <CommentContainer comments={comments} />
            </>
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
