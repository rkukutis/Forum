import Author from "../../ui/Author";
import Button from "../../ui/Button";
import { NavLink } from "react-router-dom";

function PostPreview({ post, postSnippet }) {
  return (
    <div className="flex items-center space-x-3 rounded-md bg-slate-100 px-5 py-5">
      <div className="flex-shrink-0">
        <Author author={post.user} />
      </div>
      <div className="">
        <div className="">
          <h4 className="text-sm font-semibold capitalize">{post.title}</h4>
          <p className="hidden text-sm sm:block">{postSnippet}</p>
          <span className="text-xs">
            Posted {new Date(post.created_at).toLocaleDateString()}
          </span>
        </div>
        <div className="mt-2 flex items-center space-x-5">
          <p className="text-sm font-light text-slate-800">
            {post.comment_number} comments
          </p>
          <NavLink to={`${post.id}`}>
            <Button color="blue">Add comment</Button>
          </NavLink>
          <p></p>
        </div>
      </div>
    </div>
  );
}
export default PostPreview;
