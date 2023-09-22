import { useNavigate } from "react-router-dom";

function Button({ children, onclick, style, to }) {
  const navigate = useNavigate();

  if (to) {
    return (
      <button
        className="rounded-full bg-blue-500 px-2 py-2 text-sm font-semibold text-blue-100 transition-colors hover:bg-blue-400 hover:text-slate-800"
        onClick={() => navigate(to)}
      >
        {children}
      </button>
    );
  }

  return (
    <button
      style={style}
      className="rounded-full bg-blue-500 px-2 py-2 text-sm font-semibold text-blue-100 transition-colors hover:bg-blue-400 hover:text-slate-800"
      onClick={onclick}
    >
      {children}
    </button>
  );
}

export default Button;
