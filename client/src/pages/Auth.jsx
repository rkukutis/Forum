import { NavLink, Outlet } from "react-router-dom";
import Button from "../components/Button";

function Auth() {
  return (
    <div className="auth-container">
      <div className="auth-box">
        <div className="auth-btns">
          <NavLink to="auth/login">
            <Button>Login</Button>
          </NavLink>
          <NavLink to="auth/register">
            <Button>Register</Button>
          </NavLink>
        </div>
        <Outlet />
      </div>
    </div>
  );
}

export default Auth;
