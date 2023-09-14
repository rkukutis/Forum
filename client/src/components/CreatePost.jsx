import { useState } from 'react';
import Button from './Button';
import config from  "../config.json"


function CreatePost({ type }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [error, setError] = useState('');

  async function handleCreatePost() {
    if (type === 'post' && (!body || !title))
      return setError('Title or body empty');
    if (type === 'comment' && !body) return setError('Comment body empty');

    await fetch(`http://${config.backendBaseAdress}:8000/posts`, {
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

export default CreatePost;
