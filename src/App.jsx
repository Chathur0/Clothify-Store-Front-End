import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/login";
import Register from "./pages/register";
import Home from "./pages/home";
import CustomerProfile from "./pages/profile";
import EditProfile from "./pages/edit-profile";
import AdminDashboard from "./pages/adminDashboard";
import AddProduct from "./pages/addProducts";
import { CartProvider } from "./context/CartContext";
import ProductPage from "./pages/ProductPage";
import ProductDetails from "./pages/productDetails";
import PaymentPage from "./pages/paymentPage";
import Order from "./pages/order";
import CheckConnection from "./component/CheckConnection";

function App() {
  return (
    <CheckConnection>
      <CartProvider>
        <Router basename="/Clothify-Store-Front-End">
          <Routes>
            <Route path={`/`} element={<Home />} />
            <Route path={`/login`} element={<Login />} />
            <Route path={`/register`} element={<Register />} />
            <Route path={`/profile`} element={<CustomerProfile />} />
            <Route path={`/edit-profile`} element={<EditProfile />} />
            <Route path={`/dashboard`} element={<AdminDashboard />} />
            <Route path={`/add-product`} element={<AddProduct />} />
            <Route path={`/products/:category`} element={<ProductPage />} />
            <Route path={`/product/:id`} element={<ProductDetails />} />
            <Route path={`/payment`} element={<PaymentPage />} />
            <Route path={`/order`} element={<Order />} />
          </Routes>
        </Router>
      </CartProvider>
    </CheckConnection>
  );
}

export default App;
