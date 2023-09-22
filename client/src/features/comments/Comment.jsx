import { formatDate } from "../../utils";
import Author from "../../ui/Author";

function Comment({ comment }) {
  return (
    <div className="my-2 flex items-center space-x-4 rounded-md bg-slate-200 px-3 py-3">
      <div className="flex-shrink-0">
        <Author author={comment.author} />
      </div>
      <div>
        <h2 className="font-bold text-slate-400">Comment ID: {comment.id}</h2>
        <p className="py-2 text-sm">{comment.body}</p>
        <h3 className="text-xs">{formatDate(comment.created_at)}</h3>
      </div>
    </div>
  );
}

export default Comment;
