import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { CookiesProvider } from "react-cookie";
import { Provider } from "react-redux";
import store from "./store/store";
import Login from "./Login.jsx";
import SignUp from "./SignUp.jsx";
import Reviews from "./Reviews.jsx";
import Profile from "./Profile.jsx";
import NewReview from "./NewReview.jsx";
import ReviewDetail from "./ReviewDetail.jsx";
import ReviewEdit from "./ReviewEdit.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <CookiesProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signUp" element={<SignUp />} />
            <Route path="/reviews" element={<Reviews />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/new" element={<NewReview />} />
            <Route path="/detail/:id" element={<ReviewDetail />} />
            <Route path="/edit/:id" element={<ReviewEdit />} />
            <Route path="*" element={<Navigate to="/reviews" />} />
          </Routes>
        </CookiesProvider>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>,
);
