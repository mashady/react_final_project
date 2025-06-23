"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";

function OwnerReviewList({ ownerId, refreshKey }) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editContent, setEditContent] = useState("");
  const [editLoading, setEditLoading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const currentUser = useSelector((state) => state.user.data);

  useEffect(() => {
    const fetchReviews = async () => {
      setLoading(true);
      setError("");
      try {
        const token = localStorage.getItem("token");
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        const res = await axios.get(
          `http://127.0.0.1:8000/api/owners/${ownerId}/reviews`,
          { headers }
        );
        setReviews(res.data.data || []);
      } catch (err) {
        setError("Failed to load reviews");
        setReviews([]);
      } finally {
        setLoading(false);
      }
    };
    if (ownerId) fetchReviews();
  }, [ownerId, refreshKey]);

  const handleEdit = (review) => {
    setEditingId(review.id);
    setEditContent(review.content);
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditContent("");
  };

  const handleSave = async (reviewId) => {
    setEditLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      await axios.put(
        `http://127.0.0.1:8000/api/reviews/${reviewId}`,
        { content: editContent },
        { headers }
      );
      setEditingId(null);
      setEditContent("");
      // Refresh reviews
      const res = await axios.get(
        `http://127.0.0.1:8000/api/owners/${ownerId}/reviews`,
        { headers }
      );
      setReviews(res.data.data || []);
    } catch (err) {
      setError("Failed to update review");
    } finally {
      setEditLoading(false);
    }
  };

  const handleDelete = async (reviewId) => {
    if (!window.confirm("Are you sure you want to delete this review?")) return;
    setDeletingId(reviewId);
    setError("");
    try {
      const token = localStorage.getItem("token");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      await axios.delete(`http://127.0.0.1:8000/api/reviews/${reviewId}`, {
        headers,
      });
      // Refresh reviews
      const res = await axios.get(
        `http://127.0.0.1:8000/api/owners/${ownerId}/reviews`,
        { headers }
      );
      setReviews(res.data.data || []);
    } catch (err) {
      setError("Failed to delete review");
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return <div className="text-gray-500">Loading reviews...</div>;
  }
  if (error) {
    return <div className="text-red-500">{error}</div>;
  }
  if (!reviews.length)
    return (
      <div className="text-[#888] text-lg bg-[#f7f7f7] rounded-xl p-6 border border-[#ececec]">
        No reviews yet.
      </div>
    );
  return (
    <div className="space-y-6">
      {reviews.map((review) => {
        const isReviewAuthor =
          currentUser && review.user && review.user.id === currentUser.id;
        return (
          <div
            key={review.id}
            className="p-6 border border-[#ececec] rounded-xl bg-[#f7f7f7] shadow-sm"
          >
            <div className="font-semibold text-[#222] text-lg mb-1 flex items-center justify-between">
              <span>{review.user?.name || "Anonymous"}</span>
              {isReviewAuthor && editingId !== review.id && (
                <div className="flex gap-2 ml-2">
                  <button
                    className="text-xs text-blue-600 hover:underline"
                    onClick={() => handleEdit(review)}
                    disabled={editLoading || deletingId === review.id}
                  >
                    Edit
                  </button>
                  <button
                    className="text-xs text-red-600 hover:underline"
                    onClick={() => handleDelete(review.id)}
                    disabled={deletingId === review.id}
                  >
                    {deletingId === review.id ? "Deleting..." : "Delete"}
                  </button>
                </div>
              )}
            </div>
            {editingId === review.id ? (
              <div>
                <textarea
                  className="w-full p-2 rounded border border-gray-300 mb-2"
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  disabled={editLoading}
                  rows={3}
                />
                <div className="flex gap-2">
                  <button
                    className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
                    onClick={() => handleSave(review.id)}
                    disabled={editLoading || !editContent.trim()}
                  >
                    {editLoading ? "Saving..." : "Save"}
                  </button>
                  <button
                    className="px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 text-sm"
                    onClick={handleCancel}
                    disabled={editLoading}
                  >
                    Cancel
                  </button>
                </div>
                {error && (
                  <div className="text-red-500 text-xs mt-1">{error}</div>
                )}
              </div>
            ) : (
              <div className="text-[#666] text-base">{review.content}</div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default OwnerReviewList;
