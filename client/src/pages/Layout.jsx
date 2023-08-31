import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";

function Layout() {
  return (
    <div className="grid h-screen grid-rows-[auto-1fr-auto]">
      <Header />
      <main className="mx-auto max-w-5xl">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default Layout;
