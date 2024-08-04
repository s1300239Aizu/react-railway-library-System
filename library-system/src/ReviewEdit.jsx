import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useCookies } from "react-cookie";

const validationSchema = Yup.object({
  title: Yup.string().required("タイトルは必須です"),
  url: Yup.string().required("URLは必須です"),
  detail: Yup.string().required("詳細は必須です"),
  review: Yup.string().required("レビューは必須です"),
});

const ReviewEdit = () => {
  const { id } = useParams();
  const [review, setReview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cookies] = useCookies(["token"]);
  const navigate = useNavigate();

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

      const data = await response.json();
      setReview(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching review:", error);
      setLoading(false);
    }
  };

  const formik = useFormik({
    initialValues: {
      title: review ? review.title : "",
      url: review ? review.url : "",
      detail: review ? review.detail : "",
      review: review ? review.review : "",
    },
    enableReinitialize: true,
    validationSchema,
    onSubmit: async (values) => {
      try {
        const response = await fetch(
          `https://railway.bookreview.techtrain.dev/books/${id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${cookies.token}`,
              accept: "application/json",
            },
            body: JSON.stringify({
              title: values.title,
              url: values.url,
              detail: values.detail,
              review: values.review,
            }),
          },
        );
        console.log(response);

        if (!response.ok) {
          const errorData = await response.json();
          const errorMessage =
            errorData.ErrorMessageJP || "レビューの更新に失敗しました。";
          throw new Error(errorMessage);
        }

        navigate(`/reviews`);
      } catch (error) {
        setErrors({ submit: error.message });
        console.error("Error updating review:", error);
      }
    },
  });

  const onClick = async () => {
    try {
      const response = await fetch(
        `https://railway.bookreview.techtrain.dev/books/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${cookies.token}`,
            accept: "application/json",
          },
        },
      );

      navigate(`/reviews`);
    } catch (error) {
      console.error("Error updating review:", error);
    }
  };

  return (
    <div>
      <main className="newReview">
        <h2>編集</h2>
        {loading ? (
          <p>読み込み中...</p>
        ) : (
          <form onSubmit={formik.handleSubmit} className="review-form">
            {formik.errors.submit && (
              <p className="error-message">{formik.errors.submit}</p>
            )}
            <label className="title-label" htmlFor="title">
              タイトル
            </label>
            <br />
            <input
              id="title"
              type="text"
              className="title-input"
              {...formik.getFieldProps("title")}
            />
            {formik.touched.title && formik.errors.title ? (
              <div className="error-message">{formik.errors.title}</div>
            ) : null}
            <br />
            <label className="url-label" htmlFor="url">
              URL
            </label>
            <br />
            <input
              id="url"
              type="text"
              className="url-input"
              {...formik.getFieldProps("url")}
            />
            {formik.touched.url && formik.errors.url ? (
              <div className="error-message">{formik.errors.url}</div>
            ) : null}
            <br />
            <label className="detail-label" htmlFor="detail">
              詳細
            </label>
            <br />
            <input
              id="detail"
              type="text"
              className="detail-input"
              {...formik.getFieldProps("detail")}
            />
            {formik.touched.detail && formik.errors.detail ? (
              <div className="error-message">{formik.errors.detail}</div>
            ) : null}
            <br />
            <label className="review-label" htmlFor="review">
              レビュー
            </label>
            <br />
            <input
              id="review"
              type="text"
              className="review-input"
              {...formik.getFieldProps("review")}
            />
            {formik.touched.review && formik.errors.review ? (
              <div className="error-message">{formik.errors.review}</div>
            ) : null}
            <br />
            <button
              type="submit"
              className="newReview-button"
              disabled={formik.isSubmitting}
            >
              更新
            </button>
          </form>
        )}
        <button onClick={onClick}>削除</button>
        <br />
        <Link to="/reviews">書籍レビュー一覧画面へ</Link>
      </main>
    </div>
  );
};

export default ReviewEdit;
