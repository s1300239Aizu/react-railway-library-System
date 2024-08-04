import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useCookies } from "react-cookie";
import { useNavigate, Link } from "react-router-dom";

const validationSchema = Yup.object({
  title: Yup.string().required("タイトルは必須です。"),
  url: Yup.string().required("URLは必須です。"),
  detail: Yup.string().required("詳細は必須です。"),
  review: Yup.string().required("レビューは必須です。"),
});

export const NewReview = () => {
  const navigate = useNavigate();
  const [cookies] = useCookies(["token"]);

  const formik = useFormik({
    initialValues: {
      title: "",
      url: "",
      detail: "",
      review: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        const response = await fetch(
          "https://railway.bookreview.techtrain.dev/books",
          {
            method: "POST",
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

        if (!response.ok) {
          const errorData = await response.json();
          const errorMessage =
            errorData.ErrorMessageJP || "登録に失敗しました。";
          throw new Error(errorMessage);
        }

        navigate("/reviews");
      } catch (error) {
        console.error("Error:", error);
        formik.setErrors({ submit: `登録に失敗しました。 ${error.message}` });
      }
    },
  });

  return (
    <div>
      <main className="newReview">
        <h2>新規作成</h2>
        {formik.errors.submit && (
          <p className="error-message">{formik.errors.submit}</p>
        )}
        <form onSubmit={formik.handleSubmit} className="review-form">
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
          <button type="submit" className="newReview-button">
            作成
          </button>
        </form>
        <Link to="/reviews">書籍レビュー一覧画面へ</Link>
      </main>
    </div>
  );
};

export default NewReview;
