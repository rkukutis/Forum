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
      {loggedInUser && <Author author={loggedInUser} />}

      {children}
    </header>
  );
}

export default Header;
