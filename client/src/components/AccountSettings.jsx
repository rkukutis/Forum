import { useState } from "react";
import Button from "./Button";
import { json } from "react-router-dom";

function AccountSettings() {
  const [image, setImage] = useState({});

  async function handleSubmit(e) {
    try {
      e.preventDefault();
      const formData = new FormData();
      formData.append("avatar", image);

      const res = await fetch("http://localhost:8000/users/uploadPhoto", {
        method: "POST",
        mode: "cors",
        cache: "no-cache",
        credentials: "include",
        body: formData,
      });
      const data = await res.json();
      console.log(data);
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <div>
      <form>
        <label htmlFor="img">Submit new profile picture</label>
        <input
          type="file"
          id="img"
          name="image"
          onInput={(e) => setImage(e.target.files[0])}
        />
        <Button onclick={handleSubmit}>Upload Picture</Button>
      </form>
    </div>
  );
}

export default AccountSettings;
