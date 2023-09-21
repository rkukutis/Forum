import { useState } from "react";
import Button from "./Button";
import config from "../config.json";
import Loader from "../components/Loader";

// I should have perhaps used a 3rd party form library

function NewPostForm({ onNewPost }) {
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({});

  async function handleSubmit(e) {
    try {
      e.preventDefault();
      setError("");
      if (!formData.title || !formData.body)
        throw new Error("A post must have both a title and a body");

      setIsLoading(true);
      // display new post form after post? false
      const res = await fetch(`http://${config.backendBaseAdress}:8000/posts`, {
        method: "POST",
        mode: "cors",
        cache: "no-cache",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.status === "fail") throw new Error(data.message);
      onNewPost(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <form className="flex flex-col items-center gap-5 py-3">
          <div className="flex w-full flex-col items-center gap-2">
            <label>Post title</label>
            <textarea
              className="block w-full resize-y rounded-md"
              type="text"
              value={formData.title || ""}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
            />
          </div>
          <div className="flex w-full flex-col items-center gap-2">
            <label>Post body</label>
            <textarea
              className="block w-full resize-y rounded-md"
              type="text"
              value={formData.body || ""}
              onChange={(e) =>
                setFormData({ ...formData, body: e.target.value })
              }
            />
          </div>
          <div className="flex flex-col items-center gap-5">
            <Button onclick={handleSubmit}>Submit Post</Button>
            {error && <p className=" font-medium text-red-500">{error}</p>}
          </div>
        </form>
      )}
    </>
  );
}

export default NewPostForm;
