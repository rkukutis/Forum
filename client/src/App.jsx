import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Navigate } from "react-router-dom";
import { UserProvider } from "./contexts/UserContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import AllPosts from "./pages/AllPosts";
import Auth from "./pages/Auth";
import Login from "./features/auth/Login";
import Register from "./features/auth/Register";
import SinglePost from "./pages/SinglePost";
import Layout from "./pages/Layout";
import UserAccount from "./pages/UserAccount";
import AccountInfo from "./features/settings/AccountInfo";
import AccountSettings from "./features/settings/AccountSettings";
import AccountClose from "./features/settings/AccountClose";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // staleTime: 60 * 1000,
    },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools initialIsOpen={false} />
      <UserProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Navigate to="posts" />} />
              <Route path="posts" element={<AllPosts />} />
              <Route path="posts/:postId" element={<SinglePost />} />
              <Route path="auth" element={<Auth />}>
                <Route index element={<Navigate replace to={"login"} />} />
                <Route path="login" element={<Login />} />
                <Route path="register" element={<Register />} />
              </Route>
              <Route path="account" element={<UserAccount />}>
                <Route path="info" element={<AccountInfo />} />
                <Route path="settings" element={<AccountSettings />} />
                <Route path="close" element={<AccountClose />} />
              </Route>
            </Route>
          </Routes>
        </BrowserRouter>
      </UserProvider>
    </QueryClientProvider>
  );
}
