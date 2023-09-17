import config from "../config.json";

export async function getPosts(sortSettings) {
  console.log(sortSettings);
  const res = await fetch(
    `http://${config.backendBaseAdress}:8000/posts?limit=25&page=3&sort=-comment_number`,
    { mode: "cors" },
  );
  if (!res.ok) throw new Error("failed to fetch posts");
  const {
    data: [totalPosts, receivedPosts],
  } = await res.json();
  return { totalPosts, receivedPosts };
}
