import { useState, useEffect } from 'react';
import cookies from 'js-cookies';
import { formatDate } from '../utils';
import Modal from './Modal';
import Footer from './Footer';
import LoginRegisterForm from './LoginRegisterForm';
import PostContainer from './Post';
import Author from './Author';
import { SettingsTab } from './SettingsTab';
import { Header } from './Header';

function CreatePost({ type }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [error, setError] = useState('');

  async function handleCreatePost() {
    if (type === 'post' && (!body || !title))
      return setError('Title or body empty');
    if (type === 'comment' && !body) return setError('Comment body empty');

    await fetch(`http://localhost:8000/posts`, {
      method: 'POST',
      mode: 'cors',
      cache: 'no-cache',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title, body }),
    });
  }

  function handleExpand() {
    setIsExpanded(!isExpanded);
  }

  return (
    <div className="create-post">
      {!isExpanded && (
        <Button onclick={handleExpand}>
          {type === 'post' ? 'Create a new post' : 'Add a comment'}
        </Button>
      )}
      {isExpanded && (
        <div>
          <div>
            <label htmlFor="postTitle">Post title</label>
            <input
              id="postTitle"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            ></input>
          </div>
          <div>
            <label htmlFor="postBody">body</label>
            <input
              id="postBody"
              type="text"
              value={body}
              onChange={(e) => setBody(e.target.value)}
            ></input>
          </div>
          {error && <h3>ERROR: {error}</h3>}
          <button onClick={handleCreatePost}>Post</button>
          {isExpanded && <button onClick={handleExpand}>Cancel</button>}
        </div>
      )}
    </div>
  );
}

export function Button({ children, onclick, style }) {
  return (
    <button style={style} className="button" onClick={onclick}>
      {children}
    </button>
  );
}

function PostCommentStats({ postId }) {
  const [latestComment, setLatestComment] = useState('');
  const [totalComments, setTotalComments] = useState(0);

  useEffect(
    function () {
      // returns the total number of comments for post and latest comment
      async function fetchCommentData() {
        const res = await fetch(
          `http://192.168.1.203:8000/posts/${postId}/comments?limit=1&page=1&sort=-created_at`
        );
        const { data } = await res.json();
        const { count } = data[0];
        setTotalComments(() => Number(count));
        setLatestComment(() => data[1][0]);
      }
      fetchCommentData();
    },
    [postId]
  );

  return (
    <div>
      {latestComment && totalComments ? (
        <div>
          <p>
            <b>{totalComments}</b> comments
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

function PostPreview({ id, author, title, date, postSnippet, onSelectPost }) {
  return (
    <div className="post-preview">
      <div className="post-preview-inner-box">
        <Author author={author} />
        <div className="post-preview-content">
          <h4>{title}</h4>
          <p className="post-preview-text">{postSnippet}</p>
          <span>Posted {new Date().toLocaleDateString()}</span>
        </div>
        <div className="comment-info">
          <PostCommentStats postId={id} />
          <Button color="blue" onclick={() => onSelectPost(id)}>
            Add comment
          </Button>
        </div>
      </div>
    </div>
  );
}

function ErrorMessage({ errorMessage }) {
  return (
    <p>
      <span>😠 </span>
      <b>{errorMessage}</b>
      <span> 😠</span>
    </p>
  );
}

function Loading() {
  return <p>Loading....</p>;
}
function PostPreviewContainer({ onSelectPost }) {
  const [posts, setPosts] = useState([]);
  const [postSortSettings, setPostSortSettings] = useState({
    limit: 25,
    page: 1,
    sortBy: 'created_at',
    sortDesc: true,
  });
  const [totalNumPosts, setTotalNumPosts] = useState(0);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function fetchPostData() {
      try {
        setIsLoading(true);
        const res = await fetch(
          `http://192.168.1.203:8000/posts?limit=${
            postSortSettings.limit
          }&page=${postSortSettings.page}&sort=${
            postSortSettings.sortDesc ? '-' : ''
          }${postSortSettings.sortBy}`,
          { mode: 'cors' }
        );
        if (!res.ok) throw new Error('failed to fetch posts');
        const { data } = await res.json();
        const [numPosts, receivedPosts] = data;
        if (receivedPosts.length === 0) {
          setError('No more posts :(');
        } else {
          setError('');
        }
        setPosts(receivedPosts);
        setTotalNumPosts(numPosts);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }
    fetchPostData();
  }, [postSortSettings]);

  return (
    <div className="post-container">
      <SettingsTab
        entryType={'posts'}
        settings={postSortSettings}
        onSetSettings={setPostSortSettings}
        totalNumEntries={totalNumPosts}
      />

      {isLoading && <Loading />}
      {!isLoading &&
        !error &&
        posts.map((post) => (
          <PostPreview
            key={post.id}
            id={post.id}
            author={post.user}
            postSnippet={post.body.split(' ').slice(0, 15).join(' ') + '...'}
            title={post.title}
            date={post.created_at}
            onSelectPost={onSelectPost}
          ></PostPreview>
        ))}
      {error && <ErrorMessage errorMessage={error} />}
    </div>
  );
}

export default function App() {
  const [modalIsActive, setModalIsActive] = useState(false);
  const [selectedLink, setSelectedLink] = useState('');
  const [loggedinUser, setLoggedinUser] = useState(null);
  const [selectedPost, setSelectedPost] = useState(null);

  useEffect(function () {
    async function checkUserExists() {
      // check for cookie with jwt
      if (!cookies.getItem('jwt')) return;

      // check jwt validity
      const res = await fetch(`http://localhost:8000/auth/checkUser`, {
        method: 'POST',
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await res.json();
      console.log(data);
      if (data.status === 'ok') setLoggedinUser(data.user);
    }
    checkUserExists();
  }, []);

  function handleToggleModal(e) {
    setModalIsActive((c) => !c);
    setSelectedLink(e.target.textContent);
  }

  function handleLogin(user) {
    setLoggedinUser(user);
  }

  return (
    <div className="app">
      {modalIsActive && !loggedinUser && (
        <Modal>
          <LoginRegisterForm onLogin={handleLogin} />
        </Modal>
      )}
      <Header
        onLinkClick={handleToggleModal}
        loggedinUser={loggedinUser}
        onLogOut={setLoggedinUser}
      />
      <div className="content">
        {loggedinUser && <CreatePost type={'post'} />}
        {!selectedPost ? (
          <PostPreviewContainer onSelectPost={setSelectedPost} />
        ) : (
          <PostContainer postId={selectedPost} onSelectPost={setSelectedPost} />
        )}
      </div>

      <Footer />
    </div>
  );
}
//
