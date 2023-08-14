import { useMainPost } from '../contexts/MainPostContext';
import { formatDate } from '../utils';
import Author from './Author';

function MainPost() {
  const { mainPost, error, isLoading } = useMainPost();
  console.log(mainPost);

  return (
    <div>
      {isLoading && (
        <>
          <h1>{mainPost.title}</h1>
          <h2>{mainPost && formatDate(mainPost.created_at)}</h2>
          <Author author={mainPost.author} />
          <div className="mainPost-body">
            <p>{mainPost.body}</p>
          </div>
        </>
      )}
    </div>
  );
}

export default MainPost;
