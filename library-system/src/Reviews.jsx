import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setReviews } from "./store/reviewsSlice";
import Pagination from "./Pagination";
import { useCookies } from "react-cookie";
import { Link, useNavigate } from "react-router-dom";
import Header from "./Header.jsx";
import "./Reviews.css";

const Reviews = () => {
  const [userName, setUserName] = useState("");
  const dispatch = useDispatch();
  const [cookies] = useCookies(["token"]);
  const navigate = useNavigate();
  const { items, offset } = useSelector((state) => state.reviews);

  useEffect(() => {
    fetchReviews();
  }, [offset]);

  useEffect(() => {
    if (cookies.token) {
      fetchUser();
    }
  }, [cookies.token]);

  const fetchReviews = async () => {
    const url = cookies.token
      ? `https://railway.bookreview.techtrain.dev/books?offset=${offset}`
      : `https://railway.bookreview.techtrain.dev/public/books?offset=${offset}`;
    try {
      const response = await fetch(url, {
        method: "GET",
        headers: cookies.token
          ? {
              Authorization: `Bearer ${cookies.token}`,
              accept: "application/json",
            }
          : {
              accept: "application/json",
            },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch reviews");
      }
      const data = await response.json();
      dispatch(setReviews(data));
    } catch (error) {
      console.error("Error fetching reviews:", error);
    }
  };

  const fetchUser = async () => {
    try {
      const response = await fetch(
        "https://railway.bookreview.techtrain.dev/users",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${cookies.token}`,
            accept: "application/json",
          },
        },
      );

      if (!response.ok) {
        const errorData = await response.json();
        const errorMessage =
          errorData.ErrorMessageJP || "ユーザー情報の取得に失敗しました。";
        throw new Error(errorMessage);
      }

      const userData = await response.json();
      console.log("User data fetched:", userData);
      setUserName(userData.name);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div>
      <main className="reviews">
        <Header userName={userName} token={cookies.token} />
        <h2>
          <Link to="/new">新規作成</Link>
        </h2>
        <div className="reviews-list">
          {items.length > 0 ? (
            items.map((review) => (
              <div className="review-card" key={review.id}>
                <h3 className="review-title">
                  タイトル:{" "}
                  <Link to={`/detail/${review.id}`}>{review.title}</Link>
                </h3>
                <p className="review-review">レビュー: {review.review}</p>
                <p className="review-reviewer">レビュアー: {review.reviewer}</p>
                {review.isMine ? (
                  <button
                    className="review-editButton"
                    onClick={() => navigate(`/edit/${review.id}`)}
                  >
                    編集
                  </button>
                ) : null}
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
