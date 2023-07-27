function Button({ children, onclick, style }) {
  return (
    <button style={style} className="button" onClick={onclick}>
      {children}
    </button>
  );
}

export default Button;
