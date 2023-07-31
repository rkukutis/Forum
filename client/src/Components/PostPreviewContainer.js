import { useEffect, useReducer } from 'react';
import SettingsTab from './SettingsTab';
import ErrorMessage from './ErrorMessage';
import PostPreview from './PostPreview';
import Loading from './Loading';
import { useSearchParams } from 'react-router-dom';

const initialState = {
  posts: [],
  totalNumPosts: 0,
  error: null,
  isLoading: true,
};

function reducer(state, action) {
  switch (action.type) {
    case 'setPosts':
      return {
        ...state,
        posts: action.payload.receivedPosts,
        totalNumPosts: action.payload.numPosts,
      };
    case 'loaded':
      return { ...state, isLoading: false };
    case 'error':
      return { ...state, error: action.payload };
    default:
      throw new Error('Unknown action');
  }
}

function PostPreviewContainer() {
  const [searchParams, setSearchParams] = useSearchParams()
  const resultDisplaySettings = {limit: Number(searchParams.get('limit')), page: Number(searchParams.get('page')), sortBy: searchParams.get('sortBy'), sortDesc: Boolean(searchParams.get('sortDesc'))}
  const [state, dispatch] = useReducer(reducer, initialState);




  useEffect(() => {
    async function fetchPostData() {
      try {
        const res = await fetch(
          `http://192.168.1.203:8000/posts?limit=${
            resultDisplaySettings.limit
          }&page=${resultDisplaySettings.page}&sort=${
            resultDisplaySettings.sortDesc ? '-' : ''
          }${resultDisplaySettings.sortBy}`,
          { mode: 'cors' }
        );
        if (!res.ok) throw new Error('failed to fetch posts');
        const { data } = await res.json();
        const [numPosts, receivedPosts] = data;
        dispatch({ type: 'setPosts', payload: { receivedPosts, numPosts } });
      } catch (err) {
        dispatch({ type: 'error', payload: err.message });
      } finally {
        dispatch({ type: 'loaded' });
      }
    }
    fetchPostData();
  }, [resultDisplaySettings.limit, resultDisplaySettings.page, resultDisplaySettings.sortBy, resultDisplaySettings.sortDesc]);

  return (
    <div className="post-container">
      <SettingsTab
        entryType={'posts'}
        settings={resultDisplaySettings}
        onSetSettings={setSearchParams}
        totalNumEntries={state.totalNumPosts}
      />

      {state.isLoading && <Loading />}
      {!state.isLoading &&
        !state.error &&
        state.posts.map((post) => (
          <PostPreview
            post={post}
            key={post.id}
            postSnippet={post.body.split(' ').slice(0, 15).join(' ') + '...'}
          ></PostPreview>
        ))}
      {state.error && <ErrorMessage errorMessage={state.error} />}
    </div>
  );
}

export default PostPreviewContainer;
