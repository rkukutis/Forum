import { createContext, useContext, useEffect, useReducer } from 'react';
import config from  "../config.json"


const PostsContext = createContext();

const initialState = {
  receivedPosts: [],
  totalPosts: 0,
  isLoading: false,
  error: '',
  sortSettings: { page: 1, limit: 25, sortBy: 'created_at', sortDesc: true },
};

function reducer(state, action) {
  switch (action.type) {
    case 'loading':
      return { ...state, isLoading: true };
    case 'postsFetched':
      return {
        ...state,
        totalPosts: action.payload.totalPosts,
        receivedPosts: action.payload.receivedPosts,
        isLoading: false,
      };
    case 'sortSettingsChanged':
      return {
        ...state,
        sortSettings: { ...state.sortSettings, ...action.payload },
      };
    case 'fetchError':
      return { ...state, isLoading: false, error: action.payload };
    default:
      throw new Error('Unknown action');
  }
}

function PostsProvider({ children }) {
  const [
    { receivedPosts, totalPosts, isLoading, error, sortSettings },
    dispatch,
  ] = useReducer(reducer, initialState);

  function updateSortSettings(newSettings) {
    dispatch({ type: 'sortSettingsChanged', payload: newSettings });
  }

  useEffect(() => {
    async function fetchPostData() {
      try {
        dispatch({ type: 'loading' });
        const res = await fetch(
          `http://${config.backendBaseAdress}:8000/posts?limit=${sortSettings.limit}&page=${
            sortSettings.page
          }&sort=${sortSettings.sortDesc ? '-' : ''}${sortSettings.sortBy}`,
          { mode: 'cors' }
        );
        if (!res.ok) throw new Error('failed to fetch posts');
        const {
          data: [totalPosts, receivedPosts],
        } = await res.json();

        dispatch({
          type: 'postsFetched',
          payload: { receivedPosts, totalPosts },
        });
      } catch (err) {
        dispatch({ type: 'fetchError', payload: err.message });
      }
    }
    fetchPostData();
  }, [
    sortSettings.limit,
    sortSettings.page,
    sortSettings.sortBy,
    sortSettings.sortDesc,
  ]);

  return (
    <PostsContext.Provider
      value={{
        receivedPosts,
        totalPosts,
        isLoading,
        error,
        sortSettings,
        updateSortSettings,
      }}
    >
      {children}
    </PostsContext.Provider>
  );
}

function usePosts() {
  const context = useContext(PostsContext);
  if (context === undefined)
    throw new Error('PostsContext used outside PostsProvider');
  return context;
}

export { PostsProvider, usePosts };
