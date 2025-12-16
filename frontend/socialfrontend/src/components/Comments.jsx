// src/components/Comments.jsx
import { MessageCircle, Send, CornerDownRight } from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { addComment, addReply, getComments } from "../api/comments";

export default function Comments({ postId, initialCount = 0 }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState([]); // comments
  const [text, setText] = useState("");

  // state للردود
  const [replyOpenId, setReplyOpenId] = useState(null);
  const [replyText, setReplyText] = useState("");

  const count = useMemo(() => {
    return items.length || initialCount || 0;
  }, [items.length, initialCount]);

  const toggle = async () => {
    setOpen((v) => !v);
  };

  useEffect(() => {
    if (!open || items.length) return;
    (async () => {
      try {
        setLoading(true);
        const data = await getComments(postId);
        setItems(Array.isArray(data) ? data : []);
      } catch {
        toast.error("Failed to load comments");
      } finally {
        setLoading(false);
      }
    })();
  }, [open, postId, items.length]);

  const handleAddComment = async () => {
    if (!text.trim()) return;
    try {
      const t = toast.loading("Adding comment...");
      const newC = await addComment(postId, text.trim());
      setItems((prev) => [newC, ...prev]);
      setText("");
      toast.success("Comment added", { id: t });
    } catch {
      toast.error("Failed to add comment");
    }
  };

  const handleAddReply = async (commentId) => {
    if (!replyText.trim()) return;
    try {
      const t = toast.loading("Adding reply...");
      const updated = await addReply(commentId, replyText.trim());
      // استبدل التعليق المحدّث ضمن القائمة
      setItems((prev) =>
        prev.map((c) => (c._id === updated._id ? updated : c))
      );
      setReplyText("");
      setReplyOpenId(null);
      toast.success("Reply added", { id: t });
    } catch {
      toast.error("Failed to add reply");
    }
  };

  return (
    <div className="mt-2">
      <button
        className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
        onClick={toggle}
      >
        <MessageCircle />
        <span>
          {count} Comment{count === 1 ? "" : "s"}
        </span>
      </button>

      {open && (
        <div className="mt-3 rounded-xl border border-gray-200 p-3">
          {/* Write comment */}
          <div className="flex gap-2">
            <textarea
              className="flex-1 border rounded-lg p-2 text-sm outline-none focus:ring"
              placeholder="Write a comment..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={2}
            />
            <button
              className="px-3 py-2 border rounded-lg text-sm flex items-center gap-1 hover:bg-gray-50"
              onClick={handleAddComment}
            >
              <Send size={16} />
              Send
            </button>
          </div>

          {/* List comments */}
          {loading ? (
            <div className="text-sm text-gray-500 p-3">Loading comments...</div>
          ) : items.length ? (
            <ul className="mt-4 space-y-4">
              {items.map((c) => (
                <li key={c._id} className="border-b pb-3">
                  <div className="flex items-start gap-2">
                    <img
                      src={c?.user?.avatar || "/avatar.png"}
                      className="h-8 w-8 rounded-full object-cover"
                      alt=""
                    />
                    <div className="flex-1">
                      <div className="text-sm">
                        <span className="font-medium">{c?.user?.name}</span>{" "}
                        <span className="text-gray-500">
                          {new Date(c?.createdAt).toLocaleString()}
                        </span>
                      </div>
                      <div className="text-sm mt-1 whitespace-pre-wrap">
                        {c?.text}
                      </div>

                      {/* Replies */}
                      {!!c?.replies?.length && (
                        <div className="mt-3 space-y-3">
                          {c.replies.map((r, idx) => (
                            <div key={idx} className="flex gap-2 pl-6">
                              <CornerDownRight className="mt-1" size={16} />
                              <img
                                src={r?.user?.avatar || "/avatar.png"}
                                className="h-6 w-6 rounded-full object-cover"
                                alt=""
                              />
                              <div className="flex-1">
                                <div className="text-xs">
                                  <span className="font-medium">
                                    {r?.user?.name}
                                  </span>{" "}
                                  <span className="text-gray-500">
                                    {new Date(r?.createdAt).toLocaleString()}
                                  </span>
                                </div>
                                <div className="text-sm whitespace-pre-wrap">
                                  {r?.text}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Reply box toggle */}
                      <div className="mt-2">
                        {replyOpenId === c._id ? (
                          <div className="flex gap-2">
                            <textarea
                              className="flex-1 border rounded-lg p-2 text-sm outline-none focus:ring"
                              placeholder="Write a reply..."
                              value={replyText}
                              onChange={(e) => setReplyText(e.target.value)}
                              rows={2}
                            />
                            <button
                              className="px-3 py-2 border rounded-lg text-sm flex items-center gap-1 hover:bg-gray-50"
                              onClick={() => handleAddReply(c._id)}
                            >
                              <Send size={16} />
                              Reply
                            </button>
                          </div>
                        ) : (
                          <button
                            className="text-xs text-gray-500 hover:text-gray-800"
                            onClick={() => {
                              setReplyOpenId(c._id);
                              setReplyText("");
                            }}
                          >
                            Reply
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-sm text-gray-500 mt-3">No comments yet.</div>
          )}
        </div>
      )}
    </div>
  );
}
