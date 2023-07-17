import { useState, useEffect } from 'react';
import { formatDate } from '../utils';
import Modal from './Modal';
import Footer from './Footer';
import LoginRegisterForm from './LoginRegisterForm';
import PostContainer from './Post';
import Author from './Author';
import { SettingsTab } from './SettingsTab';

function CreatePost({ type }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [error, setError] = useState('');

  async function handleCreatePost() {
    if (type === 'post' && (!body || !title))
      return setError('Title or body empty');
    if (type === 'comment' && !body) return setError('Comment body empty');

    const res = await fetch(`http://192.168.1.203:8000/posts`, {
      method: 'POST',
      mode: 'cors',
      cache: 'no-cache',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title, body }),
    });
    const data = await res.json();
    console.log(data);
  }

  function handleExpand() {
    setIsExpanded(!isExpanded);
  }

  return (
    <div className="create-post">
      {!isExpanded && (
        <button onClick={handleExpand}>
          {type === 'post' ? 'Create a new post' : 'Add a comment'}
        </button>
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

function Navbar({ children }) {
  return <nav>{children}</nav>;
}

function Header({ onLinkClick, loggedinUser }) {
  return (
    <header>
      {loggedinUser && (
        <>
          <h2>Logged in as</h2>
          <Author author={loggedinUser} />
        </>
      )}
      <Navbar>
        {!loggedinUser && (
          <Button onclick={onLinkClick}>Log in | Register</Button>
        )}
      </Navbar>
    </header>
  );
}

function Button({ children, onclick, color = 'rgb(87, 237, 112)' }) {
  return (
    <button className="button" onClick={onclick}>
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
      {latestComment && totalComments && (
        <div className="comments-stats">
          <span>{totalComments} comments</span>
          <span>
            | last by {latestComment.author.username} at{' '}
            {formatDate(latestComment.created_at, {
              dateStyle: 'short',
              timeStyle: 'short',
            })}
          </span>
        </div>
      )}
    </div>
  );
}

function PostPreview({ id, author, title, date, postSnippet, onSelectPost }) {
  return (
    <div className="post-preview">
      <div
        style={{
          display: 'flex',
          backgroundColor: 'rgb(242, 255, 231)',
          borderRadius: '10px',
        }}
      >
        <Author author={author} />
        <div>
          <h2>{title}</h2>
          <p>{postSnippet}</p>
          <span>Posted {new Date(date).toLocaleDateString()}</span>
          <PostCommentStats postId={id} />
          <Button onclick={() => onSelectPost(id)}>Add comment</Button>
        </div>
        <div></div>
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
        console.log(receivedPosts);
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
      {!isLoading && !error && <CreatePost type={'post'} />}
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

  function handleToggleModal(e) {
    setModalIsActive((c) => !c);
    setSelectedLink(e.target.textContent);
  }

  return (
    <div className="app">
      {modalIsActive && !loggedinUser && (
        <Modal>
          <LoginRegisterForm onLogin={setLoggedinUser} />
        </Modal>
      )}
      <Header onLinkClick={handleToggleModal} loggedinUser={loggedinUser} />
      {!selectedPost ? (
        <PostPreviewContainer onSelectPost={setSelectedPost} />
      ) : (
        <PostContainer postId={selectedPost} onSelectPost={setSelectedPost} />
      )}
      <Footer />
    </div>
  );
}
//
