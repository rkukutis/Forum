import { formatDate } from "../utils";
import config from  "../config.json"


function Author({ author }) {
  return (
    <div className=" flex flex-col items-center">
      <h3 className="text-medium font-semibold">{author.username}</h3>
      <img
        className={`h-16 w-16 rounded-full border-4 border-blue-300`}
        src={`http://${config.backendBaseAdress}:8000/userPhotos/${author.image}`}
        alt={`User ${author.username}`}
      />
      <h4 className="text-sm font-semibold text-slate-700">
        {[author.status, author.role].join(" ")}{" "}
      </h4>
      <h5 className="text-xs italic text-slate-600">
        Joined {formatDate(author.created_at, { dateStyle: "medium" })}
      </h5>
    </div>
  );
}

export default Author;
