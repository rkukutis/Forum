import { useEffect, useState } from "react";
import { formatDate } from "../utils";
import Author from "../components/Author";
import { useParams } from "react-router-dom";
import config from  "../config.json"


function MainPost() {
  const { postId } = useParams();
  const [post, setPost] = useState({});
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(
    function () {
      async function fetchPost() {
        try {
          const res = await fetch(`http://${config.backendBaseAdress}:8000/posts/${postId}`);
          const { data } = await res.json();
          console.log(data);
          setPost(data);
          setIsLoading(false);
        } catch (err) {
          setError(err.message);
        } finally {
          setIsLoading(false);
        }
      }
      fetchPost();
    },
    [postId],
  );

  return (
    <div className="rounded-xl border-2 border-blue-200 px-4 py-3">
      {!isLoading && !error && (
        <div className="g flex items-center space-x-5">
          <div className="flex-shrink-0">
            <Author author={post.author} />
          </div>
          <div>
            <h1 className="mb-1 font-bold capitalize">
              {post.title}{" "}
              <span className="inline p-2 text-center font-bold text-blue-500">
                (Author)
              </span>
            </h1>

            <h2 className="text-xs">{formatDate(post.created_at)}</h2>
            <p className="py-2 text-sm">{post.body}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default MainPost;
