import { useReducer } from 'react';
import { useLoggedInUser } from '../contexts/UserContext';
import { useNavigate } from 'react-router-dom';

const initialState = {
  error: '',
  username: '',
  email: '',
  password: '',
  passwordConfirm: '',
};

function reducer(state, action) {
  switch (action.type) {
    case 'usernameReceived':
      return { ...state, username: action.payload };
    case 'emailReceived':
      return { ...state, email: action.payload };
    case 'passwordReceived':
      return { ...state, password: action.payload };
    case 'passwordConfirmReceived':
      return { ...state, passwordConfirm: action.payload };

    default:
      throw new Error('Unknown action');
  }
}

function Register() {
  const [{ username, password, passwordConfirm, email }, dispatch] = useReducer(
    reducer,
    initialState
  );
  const { register, registerError, loggedInUser } = useLoggedInUser();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    await register(username, email, password, passwordConfirm);
    if (!registerError && loggedInUser)
      navigate('/posts?limit=25&page=1&sortBy=created_at&sortDesc=true');
  }

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="username">Username</label>
        <input
          id="username"
          value={username}
          onChange={(e) =>
            dispatch({ type: 'usernameReceived', payload: e.target.value })
          }
        />
      </div>
      <div>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          value={email}
          onChange={(e) =>
            dispatch({ type: 'emailReceived', payload: e.target.value })
          }
        />
      </div>
      <div>
        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) =>
            dispatch({ type: 'passwordReceived', payload: e.target.value })
          }
        />
      </div>
      <div>
        <label htmlFor="passwordConfirm">Password confirm</label>
        <input
          id="passwordConfirm"
          type="password"
          value={passwordConfirm}
          onChange={(e) =>
            dispatch({
              type: 'passwordConfirmReceived',
              payload: e.target.value,
            })
          }
        />
      </div>
      <button type="submit">submit</button>
      <p>{registerError}</p>
    </form>
  );
}

export default Register;
