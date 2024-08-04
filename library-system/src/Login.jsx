import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useCookies } from "react-cookie";
import { useNavigate, Link } from "react-router-dom";

const validationSchema = Yup.object({
  email: Yup.string()
    .email("無効なメールアドレスです。")
    .required("メールアドレスは必須です。"),
  password: Yup.string()
    .min(6, "パスワードは6文字以上でなければなりません。")
    .required("パスワードは必須です。"),
});

export const Login = () => {
  const navigate = useNavigate();
  const [cookies, setCookie] = useCookies(["token"]);

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        const userResponse = await fetch(
          "https://railway.bookreview.techtrain.dev/signin",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              accept: "application/json",
            },
            body: JSON.stringify({
              email: values.email,
              password: values.password,
            }),
          },
        );

        if (!userResponse.ok) {
          const errorData = await userResponse.json();
          const errorMessage =
            errorData.ErrorMessageJP || "ログインに失敗しました。";
          throw new Error(errorMessage);
        }

        const userData = await userResponse.json();
        console.log("Login successful:", userData);
        setCookie("token", userData.token);
        navigate("/reviews");
      } catch (error) {
        console.error("Error:", error);
        formik.setErrors({
          submit: `ログインに失敗しました。 ${error.message}`,
        });
      }
    },
  });

  return (
    <div>
      <main className="signin">
        <h2>ログイン</h2>
        {formik.errors.submit && (
          <p className="error-message">{formik.errors.submit}</p>
        )}
        <form onSubmit={formik.handleSubmit} className="signin-form">
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
          <button type="submit" className="signin-button">
            ログイン
          </button>
        </form>
        <Link to="/signUp">新規作成</Link>
      </main>
    </div>
  );
};

export default Login;
