import { useEffect, useState } from 'react';
import { formatDate } from '../utils';
import Author from './Author';

function SettingsTab({ settings, onSetSettings, totalNumEntries }) {
  const pages = Math.ceil(totalNumEntries / settings.limit);

  function handleChangeLimit(e) {
    onSetSettings({
      ...settings,
      limit: e.target.value,
      page: 1,
    });
  }

  function handleNextPage() {
    if (settings.page === pages) return;
    onSetSettings({ ...settings, page: settings.page + 1 });
  }
  function handlePreviousPage() {
    if (settings.page === 1) return;
    onSetSettings({ ...settings, page: settings.page - 1 });
  }
  function handleSortBy(e) {
    onSetSettings({ ...settings, sortBy: e.target.value });
  }
  function toggleSortDirection() {
    onSetSettings({ ...settings, sortDesc: !settings.sortDesc });
  }

  return (
    <div>
      <h1>Comments</h1>
      <span>Display</span>
      <select id="Display" value={settings.limit} onChange={handleChangeLimit}>
        <option value={5}>5 comments</option>
        <option value={10}>10 comments</option>
        <option value={25}>25 comments</option>
        <option value={50}>50 comments</option>
        <option value={100}>100 comments</option>
      </select>
      <span>Sort by</span>
      <select value={settings.sortBy} onChange={handleSortBy}>
        <option value={'created_at'}>date</option>
        <option value={'id'}>comment id</option>
      </select>
      <button onClick={toggleSortDirection}>
        {settings.sortDesc ? '⬇️ Descending order' : '⬆️ Ascending order'}
      </button>
      <span>Total comments: {totalNumEntries}</span>
      <button onClick={handlePreviousPage}>back</button>
      <span>
        Page {settings.page} of {pages}
      </span>
      <button onClick={handleNextPage}>forward</button>
    </div>
  );
}

export default function PostContainer({ postId, onSelectPost }) {
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
      <button onClick={() => onSelectPost(null)}>Go back to all posts</button>
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
      <h2>Comment ID: {comment.id}</h2>
      <p>{comment.body}</p>
      <h3>{formatDate(comment.created_at)}</h3>
    </div>
  );
}
