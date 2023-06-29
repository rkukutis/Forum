export default function Button({
  children,
  onclick,
  color = "rgb(87, 237, 112)",
}) {
  return (
    <button className="button" onClick={onclick}>
      {children}
    </button>
  );
}
