import { createContext, useContext, useEffect, useReducer } from 'react';
import { useFetcher, useParams } from 'react-router-dom';

const MainPostContext = createContext();

const initialState = {
  postId: null,
  mainPost: {},
  error: '',
  isLoading: true,
  sortSettings: { page: 1, limit: 25, sortBy: 'created_at', sortDesc: true },
};

function reducer(state, action) {
  switch (action.type) {
    case 'postIdReceived':
      return { ...state, postId: action.payload };
    case 'loading':
      return { ...state, isLoading: true };
    case 'mainPostFetched':
      return { ...state, mainPost: action.payload, isLoading: false };
    case 'fetchError':
      return { ...state, error: action.payload, isLoading: false };
    default:
      throw new Error('Unknown action');
  }
}

function MainPostProvider({ children }) {
  const [{ mainPost, error, isLoading, postId }, dispatch] = useReducer(
    reducer,
    initialState
  );

  useEffect(
    function () {
      async function fetchPost() {
        try {
          dispatch({ type: 'loading' });
          const res = await fetch(`http://192.168.1.203:8000/posts/${postId}`);
          const { data } = await res.json();
          dispatch({ type: 'mainPostFetched', payload: data });
        } catch (err) {
          dispatch({ type: 'fetchError', payload: err.message });
        }
      }

      fetchPost();
    },
    [postId]
  );

  function getPostId(id) {
    dispatch({ type: 'postIdReceived', payload: id });
  }

  return (
    <MainPostContext.Provider
      value={{ getPostId, postId, mainPost, error, isLoading }}
    >
      {children}
    </MainPostContext.Provider>
  );
}

function useMainPost() {
  const context = useContext(MainPostContext);
  if (context === undefined)
    throw new Error('MainPostContext used outside MainPostProvider');
  return context;
}

export { MainPostProvider, useMainPost };
