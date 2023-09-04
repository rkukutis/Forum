import { useLoggedInUser } from "../contexts/UserContext";
import { formatDate } from "../utils";

function AccountInfo() {
  const { loggedInUser } = useLoggedInUser();
  console.log(loggedInUser);

  return (
    <div className="bg-slate-300">
      <img
        className="h-24 rounded-full"
        src={`http://192.168.1.203:8000/userPhotos/${loggedInUser.image}`}
        alt={loggedInUser.username}
      />
      <p>Username: {loggedInUser?.username}</p>
      <p>Join date: {formatDate(loggedInUser.created_at)}</p>
      <p>Role: {loggedInUser.role.toUpperCase()}</p>
      <p>Email: {loggedInUser.email}</p>
    </div>
  );
}

export default AccountInfo;
