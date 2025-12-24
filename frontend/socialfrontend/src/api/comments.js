const COMMENTS = "http://localhost:5000/comments";

// Get all comments for a post
export async function getCommentsByPost(postId) {
  const res = await fetch(`${COMMENTS}/${postId}`, {
    credentials: "include",
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

// Add a comment to a post
export async function getCommentCount(postId) {
  const res = await fetch(`${COMMENTS}/count/${postId}`, {
    credentials: "include",
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = await res.json();
  return data.count;
}

// Add a comment
export async function addComment(postId, text) {
  const res = await fetch(`${COMMENTS}/${postId}`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  });

  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

// Add a reply to a comment
export async function addReply(commentId, text) {
  const res = await fetch(`${COMMENTS}/reply/${commentId}`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  });

  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}
