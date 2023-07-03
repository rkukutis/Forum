import { useState } from 'react';
import { useEffect } from 'react';

import Button from './Button';

function Post({ author, title, date, postSnippet }) {
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

export default function PostContainer() {
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
          <Post
            key={post.id}
            author={post.user}
            postSnippet={post.body.split(' ').slice(0, 15).join(' ') + '...'}
            title={post.title}
            date={post.created_at}
          ></Post>
        ))}
      {error && <ErrorMessage errorMessage={error} />}
    </div>
  );
}
