"use client";
import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import Toast from "@/app/(pages)/property/[id]/components/Toast";
import ConfirmDialog from "@/app/(pages)/property/[id]/components/ConfirmDialog";
import OwnerReviewForm from "./OwnerReviewForm";
import LoadingSpinner from "../../properties/components/LoadingSpinner";
import { useTranslation } from "@/TranslationContext";

function OwnerReviewList({
  ownerId,
  refreshKey,
  showReviewForm = true,
  reviewForm,
  setReviewForm,
  submittingReview,
  reviewError,
  onSubmit,
}) {
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
  const { t } = useTranslation();

  const fetchReviews = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      const headers = token ? { Authorization: `Bearer ${token}` } : undefined;
      const res = await axios.get(
        `http://127.0.0.1:8000/api/owners/${ownerId}/reviews`,
        headers ? { headers } : undefined
      );
      setReviews(res.data.data || []);
    } catch (err) {
      setError(t("failedToLoadReviews"));
      setReviews([]);
    } finally {
      setLoading(false);
    }
  }, [ownerId, t]);

  useEffect(() => {
    if (ownerId) fetchReviews();
  }, [ownerId, refreshKey, fetchReviews]);

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
      const res = await axios.get(
        `http://127.0.0.1:8000/api/owners/${ownerId}/reviews`,
        { headers }
      );
      setReviews(res.data.data || []);
    } catch (err) {
      setError(t("failedToUpdateReview"));
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
      const res = await axios.get(
        `http://127.0.0.1:8000/api/owners/${ownerId}/reviews`,
        { headers }
      );
      setReviews(res.data.data || []);
      setToast({ message: t("reviewDeleted"), type: "success", visible: true });
    } catch (err) {
      setError(t("reviewDeletedError"));
      setToast({
        message: t("reviewDeletedError"),
        type: "error",
        visible: true,
      });
    } finally {
      setDeletingId(null);
    }
  };

  const userHasReview =
    currentUser && reviews.some((r) => r.user && r.user.id === currentUser.id);

  const isOwnProfile = currentUser && currentUser.id === Number(ownerId);
  const isAdmin = currentUser?.role === "admin";

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error && (!reviews || reviews.length === 0)) {
    return <div className="text-red-500">{error}</div>;
  }

  const showForm = showReviewForm && currentUser && !userHasReview;

  if (!reviews.length) {
    return (
      <>
        <div className="text-[#888] text-lg bg-[#f7f7f7] rounded p-6 border border-[#ececec] mb-4">
          {t("noReviewsYet")}
        </div>
        {showForm && !isOwnProfile && (
          <OwnerReviewForm
            reviewForm={reviewForm}
            setReviewForm={setReviewForm}
            submittingReview={submittingReview}
            reviewError={reviewError}
            onSubmit={onSubmit}
          />
        )}
      </>
    );
  }

  return (
    <>
      {toast.visible && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ ...toast, visible: false })}
        />
      )}
      <ConfirmDialog
        open={confirm.open}
        message={t("confirmDeleteReview")}
        onConfirm={handleConfirmDelete}
        onCancel={() => setConfirm({ open: false, reviewId: null })}
      />
      {showForm && (
        <div className="mb-4">
          <OwnerReviewForm
            reviewForm={reviewForm}
            setReviewForm={setReviewForm}
            submittingReview={submittingReview}
            reviewError={reviewError}
            onSubmit={onSubmit}
          />
        </div>
      )}

      <div className="space-y-6">
        {reviews.map((review) => {
          const isReviewAuthor =
            currentUser && review.user && review.user.id === currentUser.id;

          return (
            <div
              key={review.id}
              className="p-6 border border-[#ececec] rounded bg-[#f7f7f7] shadow-sm"
            >
              <div className="font-semibold text-[#222] text-lg mb-1 flex items-center justify-between">
                <span>{review.user?.name || t("anonymous")}</span>
                {(isReviewAuthor || isAdmin) && editingId !== review.id && (
                  <div className="flex gap-2 ml-2">
                    {isReviewAuthor && (
                      <button
                        className="text-xs text-blue-600 hover:underline"
                        onClick={() => handleEdit(review)}
                        disabled={editLoading || deletingId === review.id}
                      >
                        {t("reviewEdit")}
                      </button>
                    )}
                    <button
                      className="text-xs text-red-600 hover:underline"
                      onClick={() => handleDelete(review.id)}
                      disabled={deletingId === review.id}
                    >
                      {deletingId === review.id
                        ? t("reviewDeleting")
                        : t("reviewDelete")}
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
                      className="px-3 py-1 bg-black text-white rounded hover:bg-green-700 text-sm"
                      onClick={() => handleSave(review.id)}
                      disabled={editLoading || !editContent.trim()}
                    >
                      {editLoading ? t("reviewSaving") : t("reviewSave")}
                    </button>
                    <button
                      className="px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 text-sm"
                      onClick={handleCancel}
                      disabled={editLoading}
                    >
                      {t("reviewCancel")}
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
    </>
  );
}

export default OwnerReviewList;
