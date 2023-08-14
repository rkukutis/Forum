import { useLoggedInUser } from '../contexts/UserContext';
import Author from './Author';

function Header({ children }) {
  const { loggedInUser } = useLoggedInUser();
  return (
    <header>
      {loggedInUser && <Author author={loggedInUser} />}
      {children}
    </header>
  );
}

export default Header;
