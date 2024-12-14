import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/login";
import Register from "./pages/register";
import Home from "./pages/home";
import CustomerProfile from "./pages/profile";
import EditProfile from "./pages/edit-profile";
import AdminDashboard from "./pages/adminDashboard";
import AddProduct from "./pages/addProducts";
import MenPage from "./pages/MenPage";
import WomenProduct from "./pages/womenProducts"
import { CartProvider } from "./context/CartContext";
import KidsProduct from "./pages/kidsProduct";
import BabyProducts from "./pages/babyProducts";
import ProductDetails from "./pages/productDetails";
import PaymentPage from "./pages/paymentPage";
import Order from "./pages/order";

function App() {
  return (
    <CartProvider>
      <Router>
        <Routes>
          <Route path="Clothify-Store-Front-End/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<CustomerProfile />} />
          <Route path="/edit-profile" element={<EditProfile />} />
          <Route path="/dashboard" element={<AdminDashboard />} />
          <Route path="/add-product" element={<AddProduct />} />
          <Route path="/men-product" element={<MenPage />} />
          <Route path="/women-product" element={<WomenProduct />} />
          <Route path="/kids-product" element={<KidsProduct />} />
          <Route path="/baby-product" element={<BabyProducts />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/payment" element={<PaymentPage/>}/>
          <Route path="/order" element={<Order/>}/>
        </Routes>
      </Router>
    </CartProvider>
  );
}

export default App;
