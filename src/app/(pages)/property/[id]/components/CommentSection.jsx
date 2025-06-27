"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { Trash2, Pencil, Reply, X } from "lucide-react";

export default function CommentSection({ adId, currentUser }) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [replyTo, setReplyTo] = useState(null);
  const [formContent, setFormContent] = useState("");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState(null);
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editingContent, setEditingContent] = useState("");


  useEffect(() => {
    fetchComments();
  }, [adId]);

  async function fetchComments() {
    setLoading(true);
    try {
      const res = await axios.get(`http://localhost:8000/api/ads/${adId}/comments`);
      setComments(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(parentId = null) {
    if (!formContent.trim()) return;
    try {
      const token = localStorage.getItem("token");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      await axios.post(
        `http://localhost:8000/api/ads/${adId}/comments`,
        { content: formContent, parent_id: parentId },
        { headers }
      );
      setFormContent("");
      setReplyTo(null);
      fetchComments();
    } catch (e) {
      console.error(e);
    }
  }

  async function handleUpdate(commentId, newContent) {
    try {
      const token = localStorage.getItem("token");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      await axios.put(
        `http://localhost:8000/api/comments/${commentId}`,
        { content: newContent },
        { headers }
      );
      fetchComments();
    } catch (e) {
      console.error(e);
    }
  }

  async function confirmDelete() {
    try {
      const token = localStorage.getItem("token");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      await axios.delete(`http://localhost:8000/api/comments/${commentToDelete}`, { headers });
      setCommentToDelete(null);
      setShowConfirmModal(false);
      fetchComments();
    } catch (e) {
      console.error(e);
    }
  }

  function promptDelete(commentId) {
    setCommentToDelete(commentId);
    setShowConfirmModal(true);
  }

  const canModify = (comment) => (currentUser?.id === comment.user.id) || (currentUser?.role === "admin");

  return (
    <div className="bg-white p-6 rounded-lg shadow-md space-y-6">
      <h2 className="text-xl font-semibold">Comments</h2>
      {loading && <p>Loading comments…</p>}

      {currentUser && (
        <div className="flex flex-col space-y-2">
          <textarea
            className="w-200 p-2 border rounded"
            rows={3}
            placeholder="Write a comment..."
            value={formContent}
            onChange={(e) => setFormContent(e.target.value)}
          />
          <button
            className="bg-yellow-400 text-white py-2 px-4 rounded hover:bg-yellow-700 transition duration-300 ease-in-out w-50"
            onClick={() => handleSubmit(null)}
          >
            Add Comment
          </button>
        </div>
      )}

      {comments.map((comment) => (
        <div key={comment.id} className="border ms-5 pt-4 space-y-2">
          <div>
            <div className="flex items-center space-x-3 ms-5">
              <div className="w-8 h-8 rounded-full bg-gray-500 text-white flex items-center justify-center font-bold text-sm">
                {comment.user.name.charAt(0).toUpperCase()}
              </div>
              <p className="font-semibold">{comment.user.name}</p>
            </div>

            <p className="ms-10">{comment.content}</p>
            {editingCommentId === comment.id && (
            <div className="ms-10 space-y-2">
                <textarea
                className="w-full p-2 border rounded"
                rows={2}
                value={editingContent}
                onChange={(e) => setEditingContent(e.target.value)}
                />
                <div className="flex space-x-2">
                <button
                    className="bg-blue-600 text-white px-4 py-1 rounded"
                    onClick={async () => {
                    await handleUpdate(comment.id, editingContent);
                    setEditingCommentId(null);
                    setEditingContent("");
                    }}
                >
                    Save
                </button>
                <button
                    className="bg-gray-300 text-gray-800 px-4 py-1 rounded"
                    onClick={() => {
                    setEditingCommentId(null);
                    setEditingContent("");
                    }}
                >
                    Cancel
                </button>
                </div>
            </div>
            )}

            <div className="text-gray-500 text-sm flex space-x-2 mt-1 ms-5 mb-5">
              {currentUser && (
                <button
                  className="flex items-center gap-1 bg-yellow-400 text-white py-1 px-4 rounded"
                  onClick={() => setReplyTo(comment.id)}
                >
                  <Reply className="w-4 h-4" />
                </button>
              )}

              {canModify(comment) && (
                <>
                {editingCommentId !== comment.id && (
                <button
                    className="flex items-center gap-1 text-blue-600"
                    onClick={() => {
                    setEditingCommentId(comment.id);
                    setEditingContent(comment.content);
                    }}
                >
                    <Pencil className="w-4 h-4" />
                    {/* Edit */}
                </button>
                )}


                  <button onClick={() => promptDelete(comment.id)}>
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </button>
                </>
              )}
            </div>
          </div>

          {replyTo === comment.id && (
            <div className="ml-6 space-y-2">
              <textarea
                className="w-full p-2 border rounded"
                rows={2}
                placeholder="Write a reply..."
                value={formContent}
                onChange={(e) => setFormContent(e.target.value)}
              />
              <div className="flex space-x-2 mb-2">
                <button
                  className="flex items-center gap-1 bg-yellow-400 text-white py-1 px-4 rounded"
                  onClick={() => handleSubmit(comment.id)}
                >
                  <Reply className="w-4 h-4" />
                  
                </button>
                <button
                  className="bg-gray-300 text-gray-800 py-1 px-4 rounded hover:bg-gray-400"
                  onClick={() => {
                    setReplyTo(null);
                    setFormContent("");
                  }}
                >
                  <X className="w-4 h-4" />
                  
                </button>
              </div>
            </div>
          )}

          {comment.replies?.map((reply) => (
            <div key={reply.id} className="ml-6 border-l pl-4 space-y-2 pt-2">
              <div className="flex items-center space-x-3 ms-5">
                <div className="w-8 h-8 rounded-full bg-gray-500 text-white flex items-center justify-center font-bold text-sm">
                  {reply.user.name.charAt(0).toUpperCase()}
                </div>
                <p className="font-semibold">{reply.user.name}</p>
              </div>

              <p className="ms-10">{reply.content}</p>
              {editingCommentId === reply.id && (
                <div className="ms-10 space-y-2">
                    <textarea
                    className="w-full p-2 border rounded"
                    rows={2}
                    value={editingContent}
                    onChange={(e) => setEditingContent(e.target.value)}
                    />
                    <div className="flex space-x-2">
                    <button
                        className="bg-blue-600 text-white px-4 py-1 rounded"
                        onClick={async () => {
                        await handleUpdate(reply.id, editingContent);
                        setEditingCommentId(null);
                        setEditingContent("");
                        }}
                    >
                        Save
                    </button>
                    <button
                        className="bg-gray-300 text-gray-800 px-4 py-1 rounded"
                        onClick={() => {
                        setEditingCommentId(null);
                        setEditingContent("");
                        }}
                    >
                        Cancel
                    </button>
                    </div>
                </div>
                )}

              <div className="text-gray-500 text-sm flex space-x-2 mb-3 ms-5">
                {canModify(reply) && (
                  <>
                    {editingCommentId !== reply.id && (
                    <button
                        className="flex items-center gap-1 text-blue-600"
                        onClick={() => {
                        setEditingCommentId(reply.id);
                        setEditingContent(reply.content);
                        }}
                    >
                        <Pencil className="w-4 h-4" />
                        {/* Edit */}
                    </button>
                    )}
                    <button onClick={() => promptDelete(reply.id)}>
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      ))}

      {showConfirmModal && (
        <div className="fixed inset-0 z-50  bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-full max-w-sm shadow-xl animate-fadeIn">
            <h2 className="text-lg font-semibold mb-4">Delete Comment</h2>
            <p className="text-gray-700 mb-6">
              Are you sure you want to delete this comment?
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
