import { useEffect, useReducer, useState } from "react";
import Comment from "./Comment";
import { useParams } from "react-router-dom";
import SettingsTab from "../components/SettingsTab";
import config from  "../config.json"


const initialState = {
  comments: [],
  totalComments: 0,
  isLoading: true,
  error: "",
  commentDisplaySettings: {
    page: 1,
    limit: 25,
    sortBy: "created_at",
    sortDesc: true,
  },
};

function reducer(state, action) {
  switch (action.type) {
    case "commentsFetched":
      return {
        ...state,
        comments: action.payload.comments,
        totalComments: action.payload.count,
        isLoading: false,
      };
    case "fetchFailed":
      return { ...state, error: action.payload, isLoading: false };
    case "displayUpdate":
      return {
        ...state,
        commentDisplaySettings: {
          ...state.commentDisplaySettings,
          ...action.payload,
        },
      };
    default:
      throw new Error("Unknown action");
  }
}

function CommentContainer() {
  const [
    { comments, totalComments, isLoading, error, commentDisplaySettings },
    dispatch,
  ] = useReducer(reducer, initialState);

  const { postId } = useParams();

  function updateDisplaySettings(newSettings) {
    dispatch({ type: "displayUpdate", payload: newSettings });
  }

  useEffect(
    function () {
      async function fetchPost() {
        try {
          const res = await fetch(
            `http://${config.backendBaseAdress}:8000/posts/${postId}/comments?limit=${
              commentDisplaySettings.limit
            }&page=${commentDisplaySettings.page}&sort=${
              commentDisplaySettings.sortDesc ? "-" : ""
            }${commentDisplaySettings.sortBy}`,
          );
          const { data } = await res.json();
          console.log(data);
          dispatch({
            type: "commentsFetched",
            payload: {
              comments: data[1],
              count: Number(Object.values(data[0])),
            },
          });
        } catch (err) {
          dispatch({ type: "fetchFailed", payload: err.message });
        }
      }

      fetchPost();
    },
    [
      postId,
      commentDisplaySettings.limit,
      commentDisplaySettings.page,
      commentDisplaySettings.sortDesc,
      commentDisplaySettings.sortBy,
    ],
  );

  return (
    <div className="flex flex-col">
      {!isLoading && !error && (
        <>
          <SettingsTab
            entryType={"comments"}
            totalNumPosts={totalComments}
            settings={commentDisplaySettings}
            onSetSettings={updateDisplaySettings}
          />
          {comments.map((comment) => (
            <Comment comment={comment} key={comment.id} />
          ))}
        </>
      )}
    </div>
  );
}

export default CommentContainer;
