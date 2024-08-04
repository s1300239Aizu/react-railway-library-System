import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useCookies } from "react-cookie";

const ReviewDetail = () => {
  const { id } = useParams();
  const [review, setReview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cookies] = useCookies(["token"]);

  useEffect(() => {
    fetchReview();
  }, []);

  const fetchReview = async () => {
    try {
      const response = await fetch(
        `https://railway.bookreview.techtrain.dev/books/${id}`,
        {
          headers: {
            Authorization: `Bearer ${cookies.token}`,
            accept: "application/json",
          },
        },
      );

      if (!response.ok) {
        throw new Error("レビューの取得に失敗しました。");
      }

      console.log("");
      const data = await response.json();
      setReview(data);
      setLoading(false);

      await fetch("https://railway.bookreview.techtrain.dev/logs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${cookies.token}`,
          accept: "application/json",
        },
        body: JSON.stringify({
          selectBookId: id,
        }),
      });
    } catch (error) {
      console.error("Error fetching review:", error);
      setLoading(false);
    }
  };

  return (
    <div>
      <main className="review-detail">
        {loading ? (
          <p>読み込み中...</p>
        ) : review ? (
          <div className="review-card">
            <h2>レビュー詳細</h2>
            <h2 className="review-title">タイトル: {review.title}</h2>
            <p className="review-url">URL: {review.url}</p>
            <p className="review-detail">詳細: {review.detail}</p>
            <p className="review-review">レビュー: {review.review}</p>
            <p className="review-reviewer">レビュアー: {review.reviewer}</p>
          </div>
        ) : (
          <p>レビューが見つかりません。</p>
        )}
      </main>
    </div>
  );
};

export default ReviewDetail;
