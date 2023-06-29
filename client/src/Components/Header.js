import Button from "./Button";

function Navbar({ children }) {
  const navbarStyle = {
    display: "flex",
    flexDirection: "column",
  };

  return <nav style={navbarStyle}>{children}</nav>;
}

function Logo() {
  return <img></img>;
}

export default function Header() {
  return (
    <header>
      <Logo />
      <Navbar>
        <Button>Log in</Button>
        <Button>Announcements</Button>
        <Button>Posts</Button>
      </Navbar>
    </header>
  );
}
