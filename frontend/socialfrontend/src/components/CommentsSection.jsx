/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { addComment, addReply, getCommentsByPost } from "../api/comments";
import { toast } from "sonner";
import { Send } from "lucide-react";

function CommentsSection({
  postId,
  showComments,
  commentsCount,
  onCountChange,
}) {
  const [comments, setComents] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [replyText, setReplyText] = useState({});
  const [showReplyInput, setShowReplyInput] = useState({});
  const [loadingComments, setLoadingComments] = useState(false);
  const [commentsLoaded, setCommentsLoaded] = useState(false);

  // Toggle comments visibility
  // Load comments for a post

  const loadComments = async () => {
    setLoadingComments(true);

    try {
      const data = await getCommentsByPost(postId);
      setComents(data);
      setCommentsLoaded(true);

      if (onCountChange) {
        onCountChange(data.length);
      }
    } catch (error) {
      toast.error("Failed to load comments");
      console.error(error);
    } finally {
      setLoadingComments(false);
    }
  };

  useEffect(() => {
    if (showComments && !commentsLoaded) {
      loadComments();
    }
  }, [showComments, commentsLoaded]);

  // Add comment

  const handleAddComment = async () => {
    const text = commentText.trim();

    if (!text) {
      toast.error("Comment cannot be empty");
      return;
    }

    try {
      const newComment = await addComment(postId, text);
      setComents((prev) => [newComment, ...prev]);
      setCommentText("");
      toast.success("comment Added successfully");

      if (onCountChange) {
        onCountChange(commentsCount + 1);
      }
    } catch (error) {
      toast.error("Failed to add comment");
      console.error(error);
    }
  };

  // Add reply to comment

  const handleAddReply = async (commentId) => {
    const text = replyText[commentId]?.trim();

    if (!text) {
      toast.error("reply cannot be empty");
      return;
    }

    try {
      const updatedComment = await addReply(commentId, text);
      setComents((prev) =>
        prev.map((comment) =>
          comment._id === commentId ? updatedComment : comment
        )
      );

      setReplyText((prev) => ({ ...prev, [commentId]: "" }));
      setShowReplyInput((prev) => ({ ...prev, [commentId]: false }));
      toast.success("reply added");
    } catch (error) {
      toast.error("Failed to add reply");
      console.error(error);
    }
  };

  return (
    <>
      {/* Comments Section */}

      {showComments && (
        <div className="mt-4 space-y-4">
          {/* add Comment input */}
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="add a comment..."
              className="flex-1 px-3 py-2 border border-gray-300"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleAddComment()}
            />

            <button
              onClick={handleAddComment}
              className="bg-primary px-4 py-2 text-white"
            >
              <Send size={18} />
            </button>
          </div>

          {/* Comments List */}

          {loadingComments ? (
            <div className="flex justify-center py-6">
              <div className="w-6 h-6 border-t-primary  border-2 border-gray-300 animate-spin rounded-full"></div>
            </div>
          ) : (
            <div className="space-y-3">
              {comments.length === 0 ? (
                <p className="text-gray-400 text-sm">no comments yet</p>
              ) : (
                comments?.map((comment) => (
                  <div key={comment?._id} className="bg-gray-50 p-3 rounded-lg">
                    <div className="flex gap-2">
                      <img
                        className="h-8 w-8 rounded-full object-cover"
                        src={comment?.user?.avatar || "/avatar.png"}
                        alt=""
                      />

                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm">{comment?.user?.name}</span>

                          <span className="text-gray-400 text-sm">
                            {new Date(comment.createdAt).toLocaleString()}
                          </span>
                        </div>

                        <p className="text-sm mt-1">{comment?.text}</p>

                        {/* button reply */}

                        <button
                          className="text-sm text-primary"
                          onClick={() =>
                            setShowReplyInput((prev) => ({
                              ...prev,
                              [comment._id]: !prev[comment._id],
                            }))
                          }
                        >
                          reply
                        </button>

                        {/* Reply Input */}

                        {showReplyInput[comment._id] && (
                          <div className="flex gap-2 mt-2">
                            <input
                              className="flex-1 px-2 py-1  border border-gray-300"
                              type="text"
                              placeholder="add reply..."
                              value={replyText[comment?._id]}
                              onChange={(e) =>
                                setReplyText((prev) => ({
                                  ...prev,
                                  [comment._id]: e.target.value,
                                }))
                              }
                              onKeyPress={(e) =>
                                e.key === "Enter" && handleAddReply(comment._id)
                              }
                            />

                            <button
                              onClick={() => handleAddReply(comment._id)}
                              className="bg-primary px-4 py-2 text-white"
                            >
                              <Send size={18} />
                            </button>
                          </div>
                        )}

                        {/* Replies */}

                        {comment?.replies.length > 0 && (
                          <div className="mt-2 ml-4 space-y-2">
                            {comment?.replies?.map((reply, idx) => (
                              <div key={idx} className="flex gap-2">
                                <img
                                  src={reply?.user?.avatar || "/avatar.png"}
                                  className="h-6 w-6 rounded-full object-cover"
                                  alt=""
                                />

                                <div className="flex-1 bg-white p-2 rounded">
                                  <div className="flex items-center gap-2">
                                    <span className="font-semibold text-xs">
                                      {reply?.user?.name}
                                    </span>

                                    <span>
                                      {new Date(
                                        reply.createdAt
                                      ).toLocaleString()}
                                    </span>
                                  </div>

                                  <p className="text-xs mt-1">{reply?.text}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      )}
    </>
  );
}

export default CommentsSection;
