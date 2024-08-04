import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import "./Header.css";

const Header = ({ userName, token }) => {
  const navigate = useNavigate();
  const [, , removeCookie] = useCookies(["token"]);

  const handleLogout = () => {
    removeCookie("token");
    navigate("/login");
  };

  return (
    <header className="header">
      {token ? (
        <h2 className="header-title">
          書籍レビュー
          <span>
            <Link to="/profile">（ユーザー名: {userName}）</Link>
          </span>
        </h2>
      ) : (
        <h2 className="header-title">
          書籍レビュー
          <Link to="/login" className="login-button">
            ログイン
          </Link>
        </h2>
      )}
      <div className="logout">
        <Link to="/login" className="login-button" onClick={handleLogout}>
          ログアウト
        </Link>
      </div>
    </header>
  );
};

export default Header;
