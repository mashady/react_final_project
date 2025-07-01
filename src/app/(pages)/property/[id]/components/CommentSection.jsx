"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { Trash2, Pencil, Reply } from "lucide-react";
import { useSelector } from "react-redux";
import LoadingSpinner from "@/app/(pages)/properties/components/LoadingSpinner";
import { useTranslation } from "@/TranslationContext";

export default function CommentSection({ adId, currentUser }) {
  const { data: user, token } = useSelector((state) => state.user);
  const isLoggedIn = !!token;
  const userRole = user?.role;

  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);

  const [replyTo, setReplyTo] = useState(null);
  const [formContent, setFormContent] = useState("");
  const [replyContent, setReplyContent] = useState("");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState(null);
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editingContent, setEditingContent] = useState("");

  const [isAdding, setIsAdding] = useState(false);
  const [isReplying, setIsReplying] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const { t } = useTranslation();

  useEffect(() => {
    fetchComments();
  }, [adId]);

  async function fetchComments() {
    setLoading(true);
    try {
      const res = await axios.get(
        `http://localhost:8000/api/ads/${adId}/comments`
      );
      setComments(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(parentId = null) {
    const contentToSubmit = parentId ? replyContent : formContent;
    if (!contentToSubmit.trim()) return;

    parentId ? setIsReplying(true) : setIsAdding(true);

    try {
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      await axios.post(
        `http://localhost:8000/api/ads/${adId}/comments`,
        { content: contentToSubmit, parent_id: parentId },
        { headers }
      );

      if (parentId) {
        setReplyContent("");
        setReplyTo(null);
      } else {
        setFormContent("");
      }

      fetchComments();
    } catch (e) {
      console.error(e);
    } finally {
      parentId ? setIsReplying(false) : setIsAdding(false);
    }
  }

  async function handleUpdate(commentId, newContent) {
    setIsUpdating(true);
    try {
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      await axios.put(
        `http://localhost:8000/api/comments/${commentId}`,
        { content: newContent },
        { headers }
      );
      setEditingCommentId(null);
      setEditingContent("");
      fetchComments();
    } catch (e) {
      console.error(e);
    } finally {
      setIsUpdating(false);
    }
  }

  async function confirmDelete() {
    setIsDeleting(true);
    try {
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      await axios.delete(
        `http://localhost:8000/api/comments/${commentToDelete}`,
        { headers }
      );
      setCommentToDelete(null);
      setShowConfirmModal(false);
      fetchComments();
    } catch (e) {
      console.error(e);
    } finally {
      setIsDeleting(false);
    }
  }

  function promptDelete(commentId) {
    setCommentToDelete(commentId);
    setShowConfirmModal(true);
  }

  const canDelete = (comment) =>
    currentUser?.id === comment.user.id || userRole === "admin";

  const canEdit = (comment) => currentUser?.id === comment.user.id;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md space-y-6">
      <h2 className="text-xl font-semibold">{t("propertyComments")}</h2>
      {loading && <LoadingSpinner />}

      {currentUser && (
        <div className="flex flex-col space-y-2">
          <textarea
            className="w-full p-2 border rounded"
            rows={3}
            placeholder={t("propertyCommentPlaceholder")}
            value={formContent}
            onChange={(e) => setFormContent(e.target.value)}
          />
          <button
            onClick={() => handleSubmit(null)}
            disabled={isAdding}
            className={`py-2 cursor-pointer px-4 w-50 text-black rounded transition duration-300 ${
              isAdding
                ? "bg-yellow-300 cursor-not-allowed"
                : "bg-yellow-500 hover:bg-yellow-600"
            }`}
          >
            {isAdding ? t("addingComment") || "Adding..." : t("addComment")}
          </button>
        </div>
      )}

      {comments.map((comment) => (
        <div key={comment.id} className="border rounded ms-5 pt-4 space-y-2">
          <div>
            <div className="flex items-center space-x-3 ms-5">
              <p className="font-semibold">{comment.user.name}</p>
            </div>
            <p className="ms-10 my-4">{comment.content}</p>

            {editingCommentId === comment.id && (
              <div className="ms-10 space-y-2">
                <textarea
                  className="w-[90%] p-2 border rounded"
                  rows={2}
                  value={editingContent}
                  onChange={(e) => setEditingContent(e.target.value)}
                />
                <div className="flex space-x-2 mb-8">
                  <button
                    className="bg-black cursor-pointer text-white px-4 py-1 rounded"
                    onClick={() => handleUpdate(comment.id, editingContent)}
                    disabled={isUpdating}
                  >
                    {isUpdating ? t("saving") || "Saving..." : t("saveComment")}
                  </button>
                  <button
                    className="bg-gray-300 cursor-pointer text-gray-800 px-4 py-1 rounded"
                    onClick={() => {
                      setEditingCommentId(null);
                      setEditingContent("");
                    }}
                  >
                    {t("cancelComment")}
                  </button>
                </div>
              </div>
            )}

            <div className="text-gray-500 text-sm flex space-x-2 mt-1 ms-5 mb-5">
              {currentUser && (
                <button
                  className="flex cursor-pointer items-center gap-1 bg-yellow-500 text-black py-1 px-4 rounded"
                  onClick={() => setReplyTo(comment.id)}
                >
                  <Reply className="w-4 h-4" />
                </button>
              )}

              {canEdit(comment) && editingCommentId !== comment.id && (
                <button
                  className="text-blue-600 cursor-pointer"
                  onClick={() => {
                    setEditingCommentId(comment.id);
                    setEditingContent(comment.content);
                  }}
                >
                  {t("editComment")}
                </button>
              )}

              {canDelete(comment) && (
                <button
                  className="text-red-600 cursor-pointer"
                  onClick={() => promptDelete(comment.id)}
                >
                  {t("deleteComment")}
                </button>
              )}
            </div>
          </div>

          {replyTo === comment.id && (
            <div className="ml-6 space-y-2 w-full">
              <textarea
                className="w-[90%] m-2 p-2 border rounded"
                rows={2}
                placeholder={t("writeReply")}
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
              />
              <div className="flex space-x-2 mb-4">
                <button
                  className="bg-yellow-500 cursor-pointer text-black py-1 px-4 rounded"
                  onClick={() => handleSubmit(comment.id)}
                  disabled={isReplying}
                >
                  {isReplying ? t("saving") || "Saving..." : t("saveReply")}
                </button>
                <button
                  className="bg-gray-300 cursor-pointer text-gray-800 py-1 px-4 rounded"
                  onClick={() => {
                    setReplyTo(null);
                    setReplyContent("");
                  }}
                >
                  {t("cancelReply")}
                </button>
              </div>
            </div>
          )}

          {comment.replies?.map((reply) => (
            <div key={reply.id} className="ml-6 border-l pl-4 space-y-2 pt-2">
              <div className="flex items-center space-x-3 ms-5">
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
                      className="bg-black cursor-pointer text-white px-4 py-1 rounded"
                      onClick={() => handleUpdate(reply.id, editingContent)}
                      disabled={isUpdating}
                    >
                      {isUpdating ? t("saving") || "Saving..." : t("saveReply")}
                    </button>
                    <button
                      className="bg-gray-300 cursor-pointer text-gray-800 px-4 py-1 rounded"
                      onClick={() => {
                        setEditingCommentId(null);
                        setEditingContent("");
                      }}
                    >
                      {t("cancelReply")}
                    </button>
                  </div>
                </div>
              )}

              <div className="text-gray-500 text-sm flex space-x-2 mb-3 ms-5">
                {canEdit(reply) && editingCommentId !== reply.id && (
                  <button
                    className="text-blue-600 cursor-pointer"
                    onClick={() => {
                      setEditingCommentId(reply.id);
                      setEditingContent(reply.content);
                    }}
                  >
                    {t("editComment")}
                  </button>
                )}
                {canDelete(reply) && (
                  <button onClick={() => promptDelete(reply.id)}>
                    <span className="text-red-600 cursor-pointer">
                      {t("deleteComment")}
                    </span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      ))}

      {!loading && comments.length === 0 && (
        <p className="text-gray-500 text-sm italic">{t("noCommentsYet")}</p>
      )}

      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="fixed inset-0 bg-[#000000e0] bg-opacity-70 backdrop-blur-sm"
            onClick={() => setShowConfirmModal(false)}
          />
          <div className="relative bg-white rounded-xl p-6 w-full max-w-sm shadow-2xl">
            <h2 className="text-xl font-bold mb-4 text-gray-800">
              {t("deleteAlert")}
            </h2>
            <p className="text-gray-600 mb-6">{t("deleteAlertMessage")}</p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="px-4 cursor-pointer  py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
              >
                {t("cancelComment")}
              </button>
              <button
                onClick={confirmDelete}
                disabled={isDeleting}
                className={`px-4 py-2 cursor-pointer text-white rounded-lg focus:outline-none transition-colors ${
                  isDeleting
                    ? "bg-red-400 cursor-not-allowed"
                    : "bg-red-600 hover:bg-red-700"
                }`}
              >
                {isDeleting
                  ? t("deleting") || "Deleting..."
                  : t("deleteComment")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
