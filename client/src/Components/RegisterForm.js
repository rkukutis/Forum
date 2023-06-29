import { useState } from "react";
const UserForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");

  const data = {
    username,
    password,
    email,
  };

  const handleUsername = (e) => setUsername(e.target.value);
  const handlePassword = (e) => setPassword(e.target.value);
  const handleEmail = (e) => setEmail(e.target.value);

  const handleSubmit = (e) => {
    e.preventDefault();
    setUsername("");
    setPassword("");
    setEmail("");
    createUser(data);
  };

  const createUser = async (obj) => {
    console.log(obj);

    await fetch("http://localhost:8000/users/signup", {
      method: "POST",
      mode: "cors",
      cache: "no-cache",
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(obj),
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="username">Username</label>
        <input id="username" value={username} onChange={handleUsername} />
      </div>
      <div>
        <label htmlFor="password">Password</label>
        <input id="password" value={password} onChange={handlePassword} />
      </div>
      <div>
        <label htmlFor="email">Email</label>
        <input id="email" value={email} onChange={handleEmail} />
      </div>
      <button type="submit">submit</button>
    </form>
  );
};

export default UserForm;
