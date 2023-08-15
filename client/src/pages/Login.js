import { useReducer } from 'react';
import { useLoggedInUser } from '../contexts/UserContext';
import { useNavigate } from 'react-router-dom';

const initialState = {
  error: '',
  email: '',
  password: '',
};

function reducer(state, action) {
  switch (action.type) {
    case 'emailReceived':
      return { ...state, email: action.payload };
    case 'passwordReceived':
      return { ...state, password: action.payload };
    default:
      throw new Error('Unknown action');
  }
}

function Login() {
  const [{ password, email }, dispatch] = useReducer(reducer, initialState);
  const { login, loginError } = useLoggedInUser();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    const user = await login(email, password);
    if (user && !loginError) {
      navigate('/posts');
    }
  }

  return (
    <form onSubmit={handleSubmit}>
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
      <button type="submit">submit</button>
      <p>{loginError}</p>
    </form>
  );
}

export default Login;
