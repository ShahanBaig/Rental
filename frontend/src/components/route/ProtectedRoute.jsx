import React from "react";
import { useSelector } from "react-redux";
import { Navigate, Route } from "react-router-dom";

const ProtectedRoute = ({ isAdmin, element: Element, ...rest }) => {
  const { loading, isAuthenticated, user } = useSelector((state) => state.user);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Route
      {...rest}
      element={
        isAuthenticated === false ? (
          <Navigate to="/login" />
        ) : isAdmin === true && user.role !== "admin" ? (
          <Navigate to="/login" />
        ) : (
          <Element />
        )
      }
    />
  );
};

export default ProtectedRoute;
