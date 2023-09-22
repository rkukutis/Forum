import PostPreviewContainer from "../features/postList/PostPreviewContainer";
import { PostsProvider } from "../contexts/PostsContext";

function Posts() {
  return (
    <div className="app">
      <PostsProvider>
        <PostPreviewContainer />
      </PostsProvider>
    </div>
  );
}

export default Posts;
