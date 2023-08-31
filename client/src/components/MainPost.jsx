import { useEffect, useState } from "react";
import { formatDate } from "../utils";
import Author from "../components/Author";
import { useParams } from "react-router-dom";

function MainPost() {
  const { postId } = useParams();
  const [post, setPost] = useState({});
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(
    function () {
      async function fetchPost() {
        try {
          const res = await fetch(`http://192.168.1.203:8000/posts/${postId}`);
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
    <div>
      {!isLoading && !error && (
        <>
          <h1>{post.title}</h1>
          <h2>{formatDate(post.created_at)}</h2>
          <Author author={post.author} />
          <p>{post.body}</p>
        </>
      )}
    </div>
  );
}

export default MainPost;
