import { Outlet } from "react-router-dom";
import AccountSideButtons from "../components/AccountSideButtons";
import { useLoggedInUser } from "../contexts/UserContext";

function UserSettings() {
  const { loggedInUser } = useLoggedInUser();
  return (
    <div className="min-w-screen my-24 grid min-h-screen grid-cols-[25%_1fr] py-12">
      <AccountSideButtons />
      <Outlet context={loggedInUser} />
    </div>
  );
}

export default UserSettings;
