import Author from './Author';
import { PostCommentStats } from './PostCommentStats';
import Button from './Button';
import { NavLink } from 'react-router-dom';

function PostPreview({ post, postSnippet }) {
  return (
    <div className="post-preview">
      <div className="post-preview-inner-box">
        <Author author={post.user} />
        <div className="post-preview-content">
          <h4>{post.title}</h4>
          <p className="post-preview-text">{postSnippet}</p>
          <span>Posted {new Date(post.created_at).toLocaleDateString()}</span>
        </div>
        <div className="comment-info">
          <PostCommentStats post={post} />
          <NavLink to={`${post.id}`}>
            <Button color="blue">Add comment</Button>
          </NavLink>
        </div>
      </div>
    </div>
  );
}
export default PostPreview;
