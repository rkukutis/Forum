import { Link } from "react-router-dom";
import { useLoggedInUser } from "../contexts/UserContext";
import Author from "./Author";
import Button from "./Button";

function Header({ children }) {
  const { loggedInUser } = useLoggedInUser();
  return (
    <header className="bg-blue-500 py-5">
      {!loggedInUser && (
        <Link to="/auth">
          <Button>Login | Register</Button>
        </Link>
      )}
      {loggedInUser && (
        <div>
          <Link to="/posts">Posts</Link>
          <Link to="/account">
            <Author author={loggedInUser} />
          </Link>
        </div>
      )}

      {children}
    </header>
  );
}

export default Header;
