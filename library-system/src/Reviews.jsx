import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setReviews } from "./store/reviewsSlice";
import Pagination from "./Pagination";
import "./Reviews.css";

const Reviews = () => {
  const dispatch = useDispatch();
  const { items, offset, limit } = useSelector((state) => state.reviews);

  useEffect(() => {
    fetchReviews();
  }, [offset]);

  const fetchReviews = async () => {
    try {
      const response = await fetch(
        `https://railway.bookreview.techtrain.dev/public/books?offset=${offset}&limit=${limit}`,
      );
      const data = await response.json();
      dispatch(setReviews(data));
    } catch (error) {
      console.error("Error fetching reviews:", error);
    }
  };

  return (
    <div>
      <main className="reviews">
        <h2 className="reviews-title">書籍レビュー</h2>
        <div className="reviews-list">
          {items.length > 0 ? (
            items.map((review) => (
              <div className="review-card" key={review.id}>
                <h3 className="review-title">タイトル: {review.title}</h3>
                <p className="review-detail">詳細: {review.detail}</p>
                <p className="review-review">レビュー: {review.review}</p>
                <p className="review-reviewer">レビュアー: {review.reviewer}</p>
              </div>
            ))
          ) : (
            <p>レビューがありません。</p>
          )}
        </div>
        <Pagination />
      </main>
    </div>
  );
};

export default Reviews;
