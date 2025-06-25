"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import Toast from "@/app/(pages)/property/[id]/components/Toast";
import ConfirmDialog from "@/app/(pages)/property/[id]/components/ConfirmDialog";

function OwnerReviewList({ ownerId, refreshKey }) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editContent, setEditContent] = useState("");
  const [editLoading, setEditLoading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [toast, setToast] = useState({ message: "", type: "", visible: false });
  const [confirm, setConfirm] = useState({ open: false, reviewId: null });
  const currentUser = useSelector((state) => state.user.data);

  useEffect(() => {
    const fetchReviews = async () => {
      setLoading(true);
      setError("");
      try {
        const token = localStorage.getItem("token");
        // Only set headers if token exists
        const headers = token
          ? { Authorization: `Bearer ${token}` }
          : undefined;
        const res = await axios.get(
          `http://127.0.0.1:8000/api/owners/${ownerId}/reviews`,
          headers ? { headers } : undefined
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

  const handleDelete = (reviewId) => {
    setConfirm({ open: true, reviewId });
  };

  const handleConfirmDelete = async () => {
    const reviewId = confirm.reviewId;
    setConfirm({ open: false, reviewId: null });
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
      setToast({ message: "Review deleted.", type: "success", visible: true });
    } catch (err) {
      setError("Failed to delete review");
      setToast({
        message: "Failed to delete review",
        type: "error",
        visible: true,
      });
    } finally {
      setDeletingId(null);
    }
  };

  // Check if current user already has a review for this owner
  const userHasReview =
    currentUser && reviews.some((r) => r.user && r.user.id === currentUser.id);

  if (loading) {
    return <div className="text-gray-500">Loading reviews...</div>;
  }
  if (error && (!reviews || reviews.length === 0)) {
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
      {toast.visible && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ ...toast, visible: false })}
        />
      )}
      <ConfirmDialog
        open={confirm.open}
        message="Are you sure you want to delete this review?"
        onConfirm={handleConfirmDelete}
        onCancel={() => setConfirm({ open: false, reviewId: null })}
      />
      {/* Only show review form if user is logged in and hasn't reviewed yet */}
      {currentUser && !userHasReview ? (
        <div className="mb-4">
          {/* Place your review form here, or render children, etc. */}
          {/* Example: <ReviewForm ... /> */}
        </div>
      ) : null}
      {currentUser && userHasReview && (
        <div className="text-blue-600 text-sm mb-2">
          You have already submitted a review for this owner.
        </div>
      )}
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
              {/* Only allow edit/delete if this is the user's own review */}
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
