import React, { useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useCookies } from "react-cookie";
import { useNavigate, Link } from "react-router-dom";

const validationSchema = Yup.object({
  name: Yup.string().required("名前は必須です。"),
  email: Yup.string()
    .email("無効なメールアドレスです。")
    .required("メールアドレスは必須です。"),
  password: Yup.string()
    .min(6, "パスワードは6文字以上でなければなりません。")
    .required("パスワードは必須です。"),
  image: Yup.mixed().nullable(),
});

export const SignUp = () => {
  const navigate = useNavigate();
  const [cookies, setCookie] = useCookies(["token"]);

  useEffect(() => {
    if (cookies.token) {
      navigate("/reviews");
    }
  }, [cookies, navigate]);

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
      image: null,
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        const userResponse = await fetch(
          "https://railway.bookreview.techtrain.dev/users",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              accept: "application/json",
            },
            body: JSON.stringify({
              name: values.name,
              email: values.email,
              password: values.password,
            }),
          },
        );

        if (!userResponse.ok) {
          const errorData = await userResponse.json();
          const errorMessage =
            errorData.ErrorMessageJP || "登録に失敗しました。";
          throw new Error(errorMessage);
        }

        const userData = await userResponse.json();
        console.log("Registration successful:", userData);
        setCookie("token", userData.token);

        if (values.image) {
          const formData = new FormData();
          formData.append("icon", values.image);

          const iconResponse = await fetch(
            "https://railway.bookreview.techtrain.dev/uploads",
            {
              method: "POST",
              headers: {
                accept: "application/json",
                Authorization: `Bearer ${userData.token}`,
              },
              body: formData,
            },
          );

          if (!iconResponse.ok) {
            const errorData = await iconResponse.json();
            const errorMessage =
              errorData.ErrorMessageJP ||
              "アイコンのアップロードに失敗しました。";
            throw new Error(errorMessage);
          }

          const iconData = await iconResponse.json();
          console.log("Icon upload successful:", iconData);
        }

        navigate("/login");
      } catch (error) {
        console.error("Error:", error);
        formik.setErrors({ submit: `登録に失敗しました。 ${error.message}` });
      }
    },
  });

  return (
    <div>
      <main className="signin">
        <h2>サインイン</h2>
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
          <label className="email-label" htmlFor="email">
            メールアドレス
          </label>
          <br />
          <input
            id="email"
            type="email"
            className="email-input"
            {...formik.getFieldProps("email")}
          />
          {formik.touched.email && formik.errors.email ? (
            <div className="error-message">{formik.errors.email}</div>
          ) : null}
          <br />
          <label className="password-label" htmlFor="password">
            パスワード
          </label>
          <br />
          <input
            id="password"
            type="password"
            className="password-input"
            {...formik.getFieldProps("password")}
          />
          {formik.touched.password && formik.errors.password ? (
            <div className="error-message">{formik.errors.password}</div>
          ) : null}
          <br />
          <label className="image-label" htmlFor="image">
            プロフィール画像
          </label>
          <br />
          <input
            id="image"
            type="file"
            accept="image/jpeg, image/png"
            className="image-input"
            onChange={(event) =>
              formik.setFieldValue("image", event.currentTarget.files[0])
            }
          />
          <br />
          <button type="submit" className="signin-button">
            登録
          </button>
        </form>
        <Link to="/login">ログイン画面へ</Link>
      </main>
    </div>
  );
};

export default SignUp;
