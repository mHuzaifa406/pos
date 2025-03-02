import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import AddUser from "./components/add_user";
import Login from "./components/login";
import Home from "./components/home";
import NewOrder from "./components/newOrder";

const PrivateRoute = ({ children }) => {
  const authData = JSON.parse(localStorage.getItem("authData") || "{}");
  // If user is authenticated (isAuth is true), render the children, otherwise redirect to login
  return authData?.isAuth ? children : <Navigate to="/login" />;
};

const PublicRoute = ({ children }) => {
  const authData = JSON.parse(localStorage.getItem("authData") || "{}");
  // If user is already authenticated, redirect to home; otherwise, render the children
  return authData?.isAuth ? <Navigate to="/" /> : children;
};

function App() {
  const authData = JSON.parse(localStorage.getItem("authData") || "{}");

  return (
    <div className="App">
      <Routes>
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Home />
            </PrivateRoute>
          }
        />
        <Route
          path="/new-order"
          element={
            <PrivateRoute>
              <NewOrder />
            </PrivateRoute>
          }
        />
        <Route
          path="/register"
          element={
            authData?.role === "A" ? (
              <PrivateRoute>
                <AddUser />
              </PrivateRoute>
            ) : (
              <Navigate to="/" />
            )
          }
        />
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
      </Routes>
    </div>
  );
}

export default App;