import { NavLink } from 'react-router-dom';
import { useLoggedInUser } from '../contexts/UserContext';
import Author from './Author';

function Header() {
  const{loggedInUser} = useLoggedInUser()
  return (
    <header>
      <Author author={loggedInUser}/>
      <ul>
        <li>
          <NavLink to="/">Home</NavLink>
        </li>
        <li>
          <NavLink to="login">Login</NavLink>
        </li>
      </ul>
    </header>
  );
}

export default Header;
