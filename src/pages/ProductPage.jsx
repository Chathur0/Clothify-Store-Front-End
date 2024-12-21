import React, { useEffect, useState } from "react";
import { useCart } from "../context/CartContext";
import { BsCart } from "react-icons/bs";
import CartPopup from "../component/cart";
import NavigationBar from "../component/navigationBar";
import { FaEdit } from "react-icons/fa";
import { Link } from "react-router-dom";
import baby from "/banner_images/baby.jpg";
import kids from "/banner_images/kids.jpg";
import men from "/banner_images/men.jpg";
import women from "/banner_images/women.jpg";
import Swal from "sweetalert2";
import Footer from "../component/footer";
import style from "./product.module.css";
import { useParams } from "react-router-dom";
import Loading from "../component/Loading";
const categoryDetails = {
  label: ["Men's", "Women's", "Kids", "Baby's"],
  image: [men, women, kids, baby],
  Description: [
    "Discover a collection crafted for the modern man. From sleek formal wear to comfortable casuals, we offer timeless pieces designed for every occasion. Pair your outfit with our premium accessories, including stylish watches, belts, and wallets, to complete your look. Whether you're dressing for work, a party, or a weekend outing, we've got you covered.",
    "Celebrate your style with our exquisite collection of women's wear. Explore elegant dresses, trendy tops, and versatile ethnic wear tailored to suit every taste. Complement your outfits with our exclusive accessories, including handbags, jewelry, and scarves. Our range combines sophistication and comfort to empower you every day.",
    "Let your kids shine with our vibrant collection designed for fun and adventure. From playful casuals to party-ready outfits, we ensure your little ones stay stylish and comfortable. Add a touch of charm with our range of hats, backpacks, and other accessories perfect for school, sports, or special occasions.",
    "Wrap your little bundle of joy in the softest fabrics and adorable designs. Our baby collection features everything from cozy onesies to festive outfits, all made with love and care. Don't forget to check out our accessories, including bibs, blankets, and booties, designed to keep your baby happy and comfy.",
  ],
};
function ProductPage() {
  const API_URL = import.meta.env.VITE_API_URL;
  const { category } = useParams();
  const [products, setProducts] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const { cartCount, addToCart } = useCart();
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [userRole, setUserRole] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [profileImage, setProfileImage] = useState("");
  useEffect(() => {
    const token = localStorage.getItem("jwtToken");

    if (!token) {
      setIsLoggedIn(false);
      return;
    }

    const fetchUserRole = async () => {
      try {
        const response = await fetch(`${API_URL}/get-user-role`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const responseData = await response.json();
          setUserRole(responseData.role);
          setProfileImage(responseData.profileImage);
          setIsLoggedIn(true);
        } else if (response.status === 401) {
          const errorData = await response.json();
          if (errorData.error === "Token has expired") {
            Swal.fire({
              icon: "error",
              title: "Session expired",
              text: "Logging out...",
              timer: 2000,
              didOpen: () => {
                Swal.showLoading();
              },
              willClose: () => {
                localStorage.removeItem("jwtToken");
                setIsLoggedIn(false);
                location.reload();
              },
            });
          } else {
            console.error("Authorization error:", errorData.error);
            setIsLoggedIn(false);
          }
        } else {
          console.error("Error fetching user data:", response.status);
          setIsLoggedIn(false);
        }
      } catch (error) {
        console.error("Error during fetch:", error);
        setIsLoggedIn(false);
      }
    };

    fetchUserRole();
  }, []);
  const fetchProducts = async (page) => {
    try {
      setLoading(true);
      setCurrentPage(page);
      const response = await fetch(
        `${API_URL}/get-products/${category}?page=${page}`
      );
      const data = await response.json();
      setProducts(data.content);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    setProducts([]);
    fetchProducts(0);
  }, [category]);
  const renderPagination = () => {
    return (
      <nav>
        <ul className="pagination justify-content-center">
          <li className={`page-item ${currentPage === 0 ? "disabled" : ""}`}>
            <button
              className="page-link fw-bolder"
              onClick={() => fetchProducts(currentPage - 1)}
              disabled={currentPage === 0}
            >
              {"<"}
            </button>
          </li>
          {Array.from({ length: totalPages }).map((_, index) => (
            <li
              key={index}
              className={`page-item ${index === currentPage ? "active" : ""}`}
            >
              <button
                className="page-link fw-bolder"
                onClick={() => fetchProducts(index)}
              >
                {index + 1}
              </button>
            </li>
          ))}
          <li
            className={`page-item ${
              currentPage === totalPages - 1 ? "disabled" : ""
            }`}
          >
            <button
              className="page-link fw-bolder"
              onClick={() => fetchProducts(currentPage + 1)}
              disabled={currentPage === totalPages - 1}
            >
              {">"}
            </button>
          </li>
        </ul>
      </nav>
    );
  };
  return (
    <>
      <NavigationBar
        userRole={userRole}
        isLoggedIn={isLoggedIn}
        profileImage={profileImage}
      ></NavigationBar>
      <div className="w-100">
        <img
          src={categoryDetails.image[category - 1]}
          alt="Main Banner"
          className="w-100"
          loading="lazy"
        />
      </div>
      <div className="container mt-5">
        <h2 className="text-center">{`${
          categoryDetails.label[category - 1]
        } Clothing & Accessories`}</h2>
        <p className="text-center">
          {categoryDetails.Description[category - 1]}
        </p>
        <div className="row">
          {loading ? (
            <Loading/>
          ) : (
            products.map((product) => (
              <div
                className="col-12 col-sm-6 col-md-4 col-lg-3 my-4"
                key={product.id}
              >
                <div
                  className={`card h-100 position-relative ${style.productContainer}`}
                >
                  <Link
                    to={`/product/${product.id}`}
                    className="text-decoration-none"
                  >
                    <img
                      src={product.image}
                      className="card-img-top"
                      alt={product.name}
                      style={{ height: "300px", objectFit: "cover" }}
                      loading="lazy"
                    />
                  </Link>
                  <div className="card-body">
                    <div className="position-relative">
                      <div>
                        <Link
                          to={`/product/${product.id}`}
                          className="text-decoration-none"
                        >
                          <h5 className="card-title">{product.name}</h5>
                        </Link>
                        <p className="card-text">
                          LKR {product.price.toFixed(2)}
                        </p>
                      </div>
                      {userRole === "admin" && (
                        <Link
                          to={`/product/${product.id}`}
                          className="position-absolute text-success"
                          style={{ right: "0", bottom: "0" }}
                          state={{ edit: true }}
                        >
                          <FaEdit size={30} />
                        </Link>
                      )}
                    </div>
                  </div>
                  {product.qty > 0 ? (
                    <span className="badge bg-success position-absolute top-0 end-0 m-2">
                      Available
                    </span>
                  ) : (
                    <span className="badge bg-danger position-absolute top-0 end-0 m-2">
                      Sold Out
                    </span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
        {!loading && products.length != 0 && renderPagination()}
        <div
          className="position-fixed bottom-0 end-0 m-3"
          style={{ zIndex: 1050 }}
          onClick={() => setShowCart(true)}
        >
          <div
            className="bg-success text-white rounded-circle d-flex justify-content-center align-items-center"
            style={{ width: "60px", height: "60px", cursor: "pointer" }}
          >
            <BsCart size={30} />
            {cartCount > 0 && (
              <span
                className="position-absolute top-0 start-75 translate-middle badge rounded-pill bg-danger"
                style={{ fontSize: "0.8rem" }}
              >
                {cartCount}
              </span>
            )}
          </div>
        </div>

        <CartPopup show={showCart} onClose={() => setShowCart(false)} />
      </div>
      <Footer />
    </>
  );
}
export default ProductPage;
