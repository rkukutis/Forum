import { useEffect, useReducer } from 'react';
import SettingsTab from './SettingsTab';
import ErrorMessage from './ErrorMessage';
import PostPreview from './PostPreview';
import Loading from './Loading';
import { useSearchParams } from 'react-router-dom';
import { usePosts } from '../contexts/PostsContext';

function PostPreviewContainer() {
  const { receivedPosts, isLoading, error, sortSettings } = usePosts();
  const [_, setSearchParams] = useSearchParams();
  // const resultDisplaySettings = {
  //   limit: Number(searchParams.get('limit')),
  //   page: Number(searchParams.get('page')),
  //   sortBy: searchParams.get('sortBy'),
  //   sortDesc: Boolean(searchParams.get('sortDesc')),
  // };
  // const [state, dispatch] = useReducer(reducer, initialState);

  // synchronize URL with context sortSettings
  useEffect(
    function () {
      setSearchParams(sortSettings);
    },
    [setSearchParams, sortSettings]
  );

  return (
    <div className="post-container">
      <SettingsTab
        entryType={'posts'}
        settings={sortSettings}
        onSetSettings={setSearchParams}
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
