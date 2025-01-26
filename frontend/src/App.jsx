import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import React from "react"
import { createTheme } from "@mui/material/styles";
import { getLoggedInUserDetails } from "./actions/userAction.js";
import ProtectedRoute from "./components/route/ProtectedRoute";
import { themeSettings } from "./theme.js";
import { useState, useEffect } from "react";
import { CssBaseline, ThemeProvider } from "@mui/material";
import axios from "axios";

import HomePage from "./scenes/homePage";
import ProductDetailsPage from "./scenes/productDetailsPage";
import PostProductPage from "./scenes/postProductPage";
import ProductsPage from "./scenes/productsPage";
import CareersPage from "./scenes/careersPage";
import AboutPage from "./scenes/aboutPage";
import HelpPage from "./scenes/helpPage";
import LoginPage from "./scenes/loginPage";
import ResetPasswordPage from "./scenes/resetPasswordPage";
import MyDashboardPage from "./scenes/myDashboardPage";
import UpdatePasswordPage from "./scenes/updatePasswordPage";

function App() {
  // Variables
  const { isAuthenticated, user } = useSelector((state) => state.persisted.user);
  const theme = createTheme(themeSettings())
  const dispatch = useDispatch();

  // Upon start up retrieve user & stripe api key
  const [stripeApiKey, setStripeApiKey] = useState("");

  async function getStripeApiKey() {
    const { data } = await axios.get("/api/v1//stripe-api-key");
    setStripeApiKey(data.stripeApiKey);
  }

  // useEffect(() => {
  //   dispatch(getLoggedInUserDetails());
  //   getStripeApiKey();
  // }, [dispatch]);

  return (
    <div className="app">
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          {/* removes inconsistencies by applying CSS normalization across browsers */}
          <CssBaseline /> 
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/product/:id" element={<ProductDetailsPage />} />
            <Route path="/product/post" element={<PostProductPage />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/careers" element={<CareersPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/help" element={<HelpPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/password/reset/:token" element={<ResetPasswordPage />} />

            {/* Protected routes */}
            {/* <ProtectedRoute path="/me" element={<MyDashboardPage />} />
            <ProtectedRoute path="/password/update" element={<UpdatePasswordPage />} /> */}
            <Route path="/me" element={<ProtectedRoute element={<MyDashboardPage />} />}/>
            <Route path="/me" element={<ProtectedRoute element={<UpdatePasswordPage />} />}/>

          </Routes>
        </ThemeProvider>
      </BrowserRouter>
    </div>
  );

  // pick routes then fix syntax
  // Maintain page and overlay logic, create extra pages for certain overlays that require search engine access
  // return (
  //   <Router>
  //     <Switch>
  //       <Route exact path="/" element={HomePage} />
  //       <Route exact path="/product/:id" element={ProductDetailsPage} />
  //       <Route path="/product/post" element={postProductPage} />
  //       <Route path="/products" element={ProductsPage} />
  //       <Route exact path="/careers" element={CareersPage} />
  //       <Route exact path="/about" element={AboutPage} />
  //       <Route exact path="/help" element={HelpPage} />
  //       <Route exact path="/login" element={LoginPage} />
  //       <ProtectedRoute exact path="/me" element={Dashboard} />
  //       <ProtectedRoute exact path="/password/update" element={UpdatePasswordPage} />
  //       <Route exact path="/password/reset/:token" element={ResetPasswordPage} />

  //       {/* <ProtectedRoute exact path="/success" element={RentalSuccess} />
  //       <ProtectedRoute exact path="/order/confirm" element={ConfirmOrder} />
  //       <ProtectedRoute exact path="/order/:id" element={OrderDetails} />
  //       <ProtectedRoute isAdmin={true} exact path="/admin/dashboard" element={Dashboard}/>
  //       <ProtectedRoute exact path="/admin/products" isAdmin={true} element={ProductList}/>
  //       <ProtectedRoute exact path="/admin/product" isAdmin={true} element={NewProduct}/>
  //       <ProtectedRoute exact path="/admin/product/:id" isAdmin={true} element={UpdateProduct}/>
  //       <ProtectedRoute exact path="/admin/orders" isAdmin={true} element={OrderList}/>
  //       <ProtectedRoute exact path="/admin/order/:id" isAdmin={true} element={ProcessOrder}/>
  //       <ProtectedRoute exact path="/admin/users" isAdmin={true} element={UsersList}/>
  //       <ProtectedRoute exact path="/admin/user/:id" isAdmin={true} element={UpdateUser}/>
  //       <ProtectedRoute exact path="/admin/reviews" isAdmin={true} element={ProductReviews}/> */}

  //       {/* <Route element={window.location.pathname === "/process/payment" ? null : NotFound}/> */}
  //     </Switch>
  //   </Router>
  // );
}

export default App;
