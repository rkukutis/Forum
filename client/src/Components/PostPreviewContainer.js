import { useEffect, useReducer } from 'react';
import SettingsTab from './SettingsTab';
import ErrorMessage from './ErrorMessage';
import PostPreview from './PostPreview';
import Loading from './Loading';
import { useSearchParams } from 'react-router-dom';
import { usePosts } from '../contexts/PostsContext';

function PostPreviewContainer() {
  const {
    receivedPosts,
    isLoading,
    error,
    sortSettings,
    updateSortSettings,
    totalPosts,
  } = usePosts();
  const [_, setSearchParams] = useSearchParams();

  // synchronize URL with context sortSettings
  // useEffect(
  //   function () {
  //     setSearchParams(sortSettings);
  //   },
  //   [setSearchParams, sortSettings]
  // );

  return (
    <div className="post-container">
      <SettingsTab
        entryType={'posts'}
        settings={sortSettings}
        onSetSettings={updateSortSettings}
        totalNumPosts={totalPosts}
      />

      {isLoading && <Loading />}
      {!isLoading &&
        !error &&
        receivedPosts.map((post) => (
          <PostPreview
            post={post}
            key={post.id}
            postSnippet={post.body.split(' ').slice(0, 15).join(' ') + '...'}
          ></PostPreview>
        ))}
      {error && <ErrorMessage errorMessage={error} />}
    </div>
  );
}

export default PostPreviewContainer;
