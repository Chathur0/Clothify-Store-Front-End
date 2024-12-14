import React, { useEffect, useState } from "react";
import { useCart } from "../context/CartContext";
import { BsCart } from "react-icons/bs";
import CartPopup from "../component/cart";
import NavigationBar from "../component/navigationBar";
import { FaEdit } from "react-icons/fa";
import { Link } from "react-router-dom";
import banner from "/banner_images/kids.jpg";
import Swal from "sweetalert2";

function KidsProduct() {
  const [products, setProducts] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const { cartCount, addToCart } = useCart();
  const basePath = "";
  const [loading, setLoading] = useState(true);

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
        const response = await fetch("http://localhost:8080/get-user-role", {
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
              icon:"error",
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

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("http://localhost:8080/get-kids-product");
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <>
      <NavigationBar
        userRole={userRole}
        isLoggedIn={isLoggedIn}
        profileImage={profileImage}
      ></NavigationBar>
      <div className="w-100">
        <img src={banner} alt="Main Banner" className="w-100" />
      </div>
      <div className="container mt-5">
        <h2 className="text-center">Kids Clothing & Accessories</h2>
        <p className="text-center">
          Let your kids shine with our vibrant collection designed for fun and
          adventure. From playful casuals to party-ready outfits, we ensure your
          little ones stay stylish and comfortable. Add a touch of charm with
          our range of hats, backpacks, and other accessories perfect for
          school, sports, or special occasions.
        </p>
        <div className="row">
          {loading ? (
            <h1 className="text-center">Loading products...</h1>
          ) : (
            products.map((product) => (
              <div
                className="col-12 col-sm-6 col-md-4 col-lg-3 my-4"
                key={product.id}
              >
                <div className="card h-100 position-relative">
                  <img
                    src={product.image}
                    className="card-img-top"
                    alt={product.name}
                    style={{ height: "200px", objectFit: "cover" }}
                  />
                  <div className="card-body">
                    <Link
                      to={`${basePath}/product/${product.id}`}
                      className="text-decoration-none"
                    >
                      <h5 className="card-title">{product.name}</h5>
                    </Link>
                    <p className="card-text">
                      Price: RS {product.price.toFixed(2)}
                    </p>
                    <div className="d-flex justify-content-between">
                      <button
                        className="btn btn-primary fw-bolder"
                        disabled={product.qty === 0}
                        onClick={() => addToCart(product, 1)}
                      >
                        {product.qty === 0 ? "Sold Out" : "Add to Cart"}
                      </button>
                      {userRole === "admin" && (
                        <Link
                          to={`${basePath}/product/${product.id}`}
                          className="btn btn-success"
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
    </>
  );
}
export default KidsProduct;
