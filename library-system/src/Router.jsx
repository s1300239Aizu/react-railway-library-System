import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { CookiesProvider } from "react-cookie";
import { Provider } from "react-redux";
import store from "./store/store";
import Login from "./Login.jsx";
import SignUp from "./SignUp.jsx";
import Reviews from "./Reviews.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <CookiesProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signUp" element={<SignUp />} />
            <Route path="/reviews" element={<Reviews />} />
            <Route path="*" element={<Navigate to="/Login" />} />
          </Routes>
        </CookiesProvider>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>,
);
