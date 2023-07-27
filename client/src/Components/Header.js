import { NavLink } from 'react-router-dom';

function Header() {
  return (
    <header>
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
