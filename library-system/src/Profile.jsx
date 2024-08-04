import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useCookies } from "react-cookie";
import { useNavigate, Link } from "react-router-dom";

const validationSchema = Yup.object({
  name: Yup.string().required("名前は必須です。"),
});

export const Profile = () => {
  const [userName, setUserName] = useState("");
  const navigate = useNavigate();
  const [cookies, setCookie] = useCookies(["token"]);

  useEffect(() => {
    fetchUser();
  }, []);

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

  const formik = useFormik({
    initialValues: {
      name: userName,
    },
    validationSchema: validationSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      try {
        const response = await fetch(
          "https://railway.bookreview.techtrain.dev/users",
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${cookies.token}`,
              accept: "application/json",
            },
            body: JSON.stringify({
              name: values.name,
            }),
          },
        );

        if (!response.ok) {
          const errorData = await response.json();
          const errorMessage =
            errorData.ErrorMessageJP || "変更に失敗しました。";
          throw new Error(errorMessage);
        }

        console.log("changing successful:", values.name);
        navigate("/reviews");
      } catch (error) {
        console.error("Error:", error);
        formik.setErrors({ submit: `登録に失敗しました。 ${error.message}` });
      }
    },
  });

  return (
    <div>
      <main className="signin">
        <h2></h2>
        {formik.errors.submit && (
          <p className="error-message">{formik.errors.submit}</p>
        )}
        <form onSubmit={formik.handleSubmit} className="signin-form">
          <label className="name-label" htmlFor="name">
            名前
          </label>
          <br />
          <input
            id="name"
            type="text"
            className="name-input"
            {...formik.getFieldProps("name")}
          />
          {formik.touched.name && formik.errors.name ? (
            <div className="error-message">{formik.errors.name}</div>
          ) : null}
          <br />
          <button type="submit" className="signin-button">
            変更
          </button>
        </form>
        <Link to="/review">書籍レビュー画面へ戻る</Link>
      </main>
    </div>
  );
};

export default Profile;
