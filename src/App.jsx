import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/login";
import Register from "./pages/register";
import Home from "./pages/home";
import CustomerProfile from "./pages/profile";
import EditProfile from "./pages/edit-profile";
import AdminDashboard from "./pages/adminDashboard";
import AddProduct from "./pages/addProducts";
import MenPage from "./pages/MenPage";
import WomenProduct from "./pages/womenProducts";
import { CartProvider } from "./context/CartContext";
import KidsProduct from "./pages/kidsProduct";
import BabyProducts from "./pages/babyProducts";
import ProductDetails from "./pages/productDetails";
import PaymentPage from "./pages/paymentPage";
import Order from "./pages/order";

function App() {
  const basePath = "/Clothify-Store-Front-End";

  return (
    <CartProvider>
      <Router>
        <Routes>
          <Route path={`${basePath}/`} element={<Home />} />
          <Route path={`${basePath}/login`} element={<Login />} />
          <Route path={`${basePath}/register`} element={<Register />} />
          <Route path={`${basePath}/profile`} element={<CustomerProfile />} />
          <Route path={`${basePath}/edit-profile`} element={<EditProfile />} />
          <Route path={`${basePath}/dashboard`} element={<AdminDashboard />} />
          <Route path={`${basePath}/add-product`} element={<AddProduct />} />
          <Route path={`${basePath}/men-product`} element={<MenPage />} />
          <Route
            path={`${basePath}/women-product`}
            element={<WomenProduct />}
          />
          <Route path={`${basePath}/kids-product`} element={<KidsProduct />} />
          <Route path={`${basePath}/baby-product`} element={<BabyProducts />} />
          <Route
            path={`${basePath}/product/:id`}
            element={<ProductDetails />}
          />
          <Route path={`${basePath}/payment`} element={<PaymentPage />} />
          <Route path={`${basePath}/order`} element={<Order />} />
        </Routes>
      </Router>
    </CartProvider>
  );
}

export default App;
