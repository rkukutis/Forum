import { NavLink } from "react-router-dom";

function AccountSideButtons() {
  return (
    <div className="flex flex-col space-y-5 bg-slate-200">
      <NavLink to="info">User information</NavLink>
      <NavLink to="settings">Account settings</NavLink>
      <NavLink to="close">Account deletion</NavLink>
    </div>
  );
}

export default AccountSideButtons;
