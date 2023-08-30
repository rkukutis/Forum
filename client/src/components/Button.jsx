function Button({ children, onclick, style }) {
  return (
    <button style={style} className="text-yellow-500" onClick={onclick}>
      {children}
    </button>
  );
}

export default Button;
