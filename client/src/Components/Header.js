import Author from './Author';
import { Navbar, Button } from './App';
import LoginRegisterForm from './LoginRegisterForm';

export function Header({ onLinkClick, loggedinUser, onLogOut }) {
  return (
    <header>
      <div className="loggedin-user">
        {loggedinUser ? (
          <>
            <img
              src={`http://192.168.1.203:8000/userPhotos/user_${loggedinUser.id}.jpg`}
              alt={`Current user ${loggedinUser.username}`}
            ></img>
            <Button onclick={() => onLogOut(null)}>Log out</Button>
          </>
        ) : (
          <Button onclick={onLinkClick}>Log in | Register</Button>
        )}
      </div>
    </header>
  );
}
