import { createContext, useContext, useEffect, useReducer } from 'react';
import { useParams } from 'react-router-dom';

const CommentsContext = createContext();

const initialState = {
  postId: null,
  mainPost: {},
  error: '',
  isLoading: false,
  commentSortSettings: {
    page: 1,
    limit: 25,
    sortBy: 'created_at',
    sortDesc: true,
  },
};

function reducer(state, action) {
  switch (action.type) {
    case 'loading':
      return { ...state, isLoading: true };
    case 'commentsFetched':
      return { ...state, comments: action.payload, isLoading: false };
    case 'fetchError':
      return { ...state, error: action.payload, isLoading: false };
    default:
      throw new Error('Unknown action');
  }
}

function CommentsProvider({ children }) {
  const [{ comments, error, isLoading, commentSortSettings }, dispatch] =
    useReducer(reducer, initialState);

  const { postId } = useParams();

  useEffect(
    function () {
      async function fetchPost() {
        try {
          dispatch({ type: 'loading' });
          const res = await fetch(
            `http://192.168.1.203:8000/posts/${postId}/comments?limit=${
              commentSortSettings.limit
            }&page=${commentSortSettings.page}&sort=${
              commentSortSettings.sortDesc ? '-' : ''
            }${commentSortSettings.sortBy}`
          );
          const { data } = await res.json();
          console.log(data);
          dispatch({ type: 'commentsFetched', payload: data[1] });
        } catch (err) {
          dispatch({ type: 'fetchError', payload: err.message });
        }
      }

      fetchPost();
    },
    [
      postId,
      commentSortSettings.limit,
      commentSortSettings.page,
      commentSortSettings.sortDesc,
      commentSortSettings.sortBy,
    ]
  );

  return (
    <CommentsContext.Provider value={(postId, comments, error, isLoading)}>
      {children}
    </CommentsContext.Provider>
  );
}

function useComments() {
  const context = useContext(CommentsContext);
  if (context === undefined)
    throw new Error('CommentsContext used outside CommentsProvider');
  return context;
}

export { CommentsProvider, useComments };
