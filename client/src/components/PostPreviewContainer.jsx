import SettingsTab from "../components/SettingsTab";
import ErrorMessage from "../components/ErrorMessage";
import PostPreview from "./PostPreview";
import Loader from "../components/Loader";
import { useSearchParams } from "react-router-dom";
import { usePosts } from "../contexts/PostsContext";
import { useEffect, useState } from "react";
import { useLoggedInUser } from "../contexts/UserContext";
import Button from "./Button";
import NewPostForm from "./NewPostForm";

function PostPreviewContainer() {
  const [displayNewPostForm, setDisplayNewPostForm] = useState();
  const {
    receivedPosts,
    isLoading,
    error,
    sortSettings,
    updateSortSettings,
    totalPosts,
  } = usePosts();

  const [_, setSearchParams] = useSearchParams();
  const { loggedInUser } = useLoggedInUser();
  console.log(loggedInUser);

  // synchronize URL with context sortSettings
  useEffect(
    function () {
      setSearchParams(sortSettings);
    },
    [setSearchParams, sortSettings],
  );

  return (
    <div className="ite flex flex-col gap-3">
      <SettingsTab
        entryType={"posts"}
        settings={sortSettings}
        onSetSettings={updateSortSettings}
        totalNumPosts={totalPosts}
      />

      {loggedInUser && (
        <>
          <Button onclick={() => setDisplayNewPostForm((c) => !c)}>
            {displayNewPostForm ? "Cancel new post" : "Create new post"}
          </Button>
          {displayNewPostForm && (
            <NewPostForm onNewPost={setDisplayNewPostForm} />
          )}
        </>
      )}

      {isLoading && <Loader />}
      <div className="divide-y-2 divide-slate-200 rounded-md bg-slate-200 px-6 py-5">
        {!isLoading &&
          !error &&
          receivedPosts.map((post) => (
            <PostPreview
              post={post}
              key={post.id}
              postSnippet={post.body.split(" ").slice(0, 15).join(" ") + "..."}
            ></PostPreview>
          ))}
      </div>

      {error && <ErrorMessage errorMessage={error} />}
    </div>
  );
}

export default PostPreviewContainer;
