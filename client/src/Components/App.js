import { useState, useEffect } from 'react';
import Modal from './Modal';
import Footer from './Footer';
import LoginRegisterForm from './LoginRegisterForm';
import PostContainer from './Post';

function Navbar({ children }) {
  return <nav>{children}</nav>;
}

function Header({ onLinkClick }) {
  return (
    <header>
      <Navbar>
        <Button onclick={onLinkClick}>Log in | Register</Button>
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

function PostPreview({ author, title, date, postSnippet }) {
  return (
    <div className="post-preview">
      <div
        style={{
          display: 'flex',
          backgroundColor: 'rgb(242, 255, 231)',
          borderRadius: '10px',
        }}
      >
        <div style={{ margin: '10px' }}>
          <img
            alt={`${author.username}`}
            style={{
              width: '50px',
              borderWidth: '5px',
              borderColor: author.role === 'admin' ? 'crimson' : 'teal',
              borderStyle: 'solid',
              borderRadius: '5rem',
            }}
            // 192.168.1.203 is the adress of the desktop pc
            src={`http://192.168.1.203:8000}/userPhotos/user_${author.id}.jpg`}
          />
          <h4>{author.username}</h4>
        </div>
        <div>
          <h3>{title}</h3>
          <p>{postSnippet}</p>
          <h3>Posted {new Date(date).toLocaleDateString()}</h3>
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
function PostPreviewContainer() {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function fetchPostData() {
      try {
        setIsLoading(true);
        const res = await fetch(
          `http://192.168.1.203:8000/posts?limit=10&page=${page}&sort=-created_at`,
          { mode: 'cors' }
        );
        if (!res.ok) throw new Error('failed to fetch posts');
        const data = await res.json();
        if (data.data.length === 0) {
          setError('No more posts :(');
        } else {
          setError('');
        }
        setPosts(data.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }
    fetchPostData();
  }, [page]);

  function handlePrevPage() {
    if (page > 1) setPage((page) => page - 1);
  }
  function handleNextPage() {
    setPage((page) => page + 1);
  }

  return (
    <div className="post-container">
      <nav className="post-nav-buttons">
        <Button color="lightgreen" onclick={handlePrevPage}>
          Previous
        </Button>
        <span style={{ fontSize: '2rem' }}> {page} </span>
        <Button color="lightgreen" onclick={handleNextPage}>
          Next
        </Button>
      </nav>

      {isLoading && <Loading />}
      {!isLoading &&
        !error &&
        posts.map((post) => (
          <PostPreview
            key={post.id}
            author={post.user}
            postSnippet={post.body.split(' ').slice(0, 15).join(' ') + '...'}
            title={post.title}
            date={post.created_at}
          ></PostPreview>
        ))}
      {error && <ErrorMessage errorMessage={error} />}
    </div>
  );
}

function Box() {
  return <div className="box">THIS IS AN EXAMPLE BOX</div>;
}

export default function App() {
  const [modalIsActive, setModalIsActive] = useState(false);
  const [selectedLink, setSelectedLink] = useState('');
  const [mainContent, setMainContent] = useState('posts');

  function handleToggleModal(e) {
    setModalIsActive((c) => !c);
    setSelectedLink(e.target.textContent);
  }

  async function handleCreatePost() {
    const post = {
      title: 'This is a post by Me',
      body: 'Vestibulum non dolor in arcu scelerisque bibendum non id lectus. Curabitur lectus nisi, eleifend at orci quis, vestibulum posuere justo. Nullam maximus maximus nulla vel pellentesque. Duis id metus nec elit mollis malesuada. Sed et odio non orci faucibus finibus vitae interdum tellus. Ut mi lacus, gravida in enim id, efficitur vestibulum augue. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Morbi ullamcorper ipsum eros, ac laoreet leo condimentum nec. Nam imperdiet erat elit, eu finibus justo euismod at. Donec eu lectus venenatis, malesuada nunc quis, sodales ante. Integer vehicula consequat elementum. Mauris placerat nunc nisl, et vestibulum sapien malesuada efficitur. Aliquam ac felis vehicula, accumsan mi eu, cursus massa. Donec bibendum porttitor augue, et dignissim nulla aliquet in. Fusce eros mi, euismod eget massa at, egestas maximus erat. Donec vel tortor tempus, facilisis mi nec, imperdiet arcu.',
    };

    const res = await fetch(`http://localhost:8000/posts`, {
      method: 'POST',
      // mode: 'cors',
      cache: 'no-cache',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(post),
    });
    const data = await res.json();
    console.log(data);
  }

  return (
    <div className="app">
      {modalIsActive && (
        <Modal>
          <LoginRegisterForm />
        </Modal>
      )}
      <Header onLinkClick={handleToggleModal} />
      <Button onclick={handleCreatePost}>Make a post</Button>
      {/* {mainContent === 'posts' ? (
        <PostPreviewContainer />
      ) : (
        <h1>Announcements</h1>
      )} */}
      <PostContainer />

      <Footer />
    </div>
  );
}
//
