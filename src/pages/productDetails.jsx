import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { BsCart, BsCash } from "react-icons/bs";
import CartPopup from "../component/cart";
import NavigationBar from "../component/navigationBar";
import { FaEdit, FaSync, FaTrash } from "react-icons/fa";
import Modal from "react-modal";
import { useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import styles from "./alertStyles.module.css";
import Footer from "../component/footer";
import logo from "/logo.png";
import { BiBook } from "react-icons/bi";
import { TbTruckDelivery } from "react-icons/tb";
import Loading from "../component/Loading";
Modal.setAppElement("#root");

const ProductDetails = () => {
  const [sampleProduct, setSampleProduct] = useState([logo, logo, logo]);

  const API_URL = import.meta.env.VITE_API_URL;
  const [userRole, setUserRole] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [profileImage, setProfileImage] = useState("");
  const location = useLocation();
  const [edit, setEdit] = useState(location.state?.edit || false);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const navigate = useNavigate();
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [showCart, setShowCart] = useState(false);
  const { cartCount, addToCart } = useCart();
  const [selectedSize, setSelectedSize] = useState("");
  const [mainImage, setMainImage] = useState(sampleProduct[0]);

  const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.onmouseenter = Swal.stopTimer;
      toast.onmouseleave = Swal.resumeTimer;
    },
  });
  const handleImageView = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const handleImageClick = () => {
    document.getElementById("imageInput").click();
  };

  const handleImagesClick = (image) => {
    setMainImage(image);
  };

  const handleSaveChanges = async () => {
    const formDataToSend = new FormData();
    formDataToSend.append(
      "product",
      JSON.stringify({
        id: product.id,
        name: product.name,
        description: product.description,
        category: product.category,
        price: product.price,
        qty: product.qty,
        image: product.image,
      })
    );
    formDataToSend.append("image", selectedImage || null);
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "you want to update the Product?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes",
      confirmButtonColor: "#dc3545",
      cancelButtonText: "Cancel",
    });
    if (result.isConfirmed) {
      try {
        const response = await fetch(`${API_URL}/change-product`, {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
          },
          body: formDataToSend,
        });

        if (response.ok) {
          Toast.fire({
            icon: "success",
            title: "Product updated successfully!",
          });
          setEdit(false);
        } else {
          console.error("Error updating product:", response.status);
        }
      } catch (error) {
        console.error("Error saving product:", error);
      }
    }
  };

  const handleQuantityChange = async (e) => {
    if (e.key === "Enter") {
      handleSaveChanges();
    }
  };
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        Swal.fire({
          text: "File size should not exceed 5MB!",
          icon: "warning",
          customClass: {
            popup: styles.dangerBackground,
          },
        });
        setSelectedImage(null);
      } else {
        setSelectedImage(file);
      }
    }
  };
  const handleAddToCart = () => {
    if (!selectedSize) {
      Toast.fire({
        icon: "warning",
        title: "Please select a size before adding to the cart.",
      });
      return;
    }
    addToCart(product, 1);
  };
  useEffect(() => {
    const token = localStorage.getItem("jwtToken");

    if (!token) {
      setIsLoggedIn(false);
      setEdit(false);
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
                setEdit(false);
                location.reload();
              },
            });
          } else {
            console.error("Authorization error:", errorData.error);
            setIsLoggedIn(false);
            setEdit(false);
          }
        } else {
          console.error("Error fetching user data:", response.status);
          setIsLoggedIn(false);
          setEdit(false);
        }
      } catch (error) {
        console.error("Error during fetch:", error);
        setIsLoggedIn(false);
        setEdit(false);
      }
    };

    fetchUserRole();
  }, []);

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await fetch(`${API_URL}/product/${id}`);
        const data = await response.json();
        setProduct(data);
        setMainImage(data.image);
        setSampleProduct([data.image, logo, logo]);
      } catch (error) {
        console.error("Error fetching product details:", error);
      }
    };

    fetchProductDetails();
  }, [id]);

  const handleDelete = async () => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "you want to delete the Product?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes",
      confirmButtonColor: "#dc3545",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      try {
        const response = await fetch(`${API_URL}/delete-product/${id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
          },
        });
        if (response.ok) {
          Swal.fire({
            icon: "success",
            title: "Successfully!",
            text: `${await response.text()}`,
          });
          navigate(-1);
        } else {
          console.error("Error deleting item:", response.status);
          Swal.fire({
            icon: "error",
            title: "Failed",
            text: "Failed to delete the item.",
          });
        }
      } catch (error) {
        console.error("Error during delete request:", error);
        Swal.fire({
          icon: "error",
          title: "Failed",
          text: "An error occurred while deleting the item.",
        });
      }
    }
  };

  return (
    <>
      <NavigationBar
        userRole={userRole}
        isLoggedIn={isLoggedIn}
        profileImage={profileImage}
      ></NavigationBar>
      {!product ? (
        <p className="text-center"><Loading/></p>
      ) : (
        <div className="container my-5 card">
          <div className="row">
            {edit ? (
              <>
                <div className="col-md-6 my-3">
                  <img
                    src={
                      selectedImage
                        ? URL.createObjectURL(selectedImage)
                        : product.image
                    }
                    alt={product.name}
                    className="img-fluid w-100"
                    style={{
                      maxHeight: "500px",
                      objectFit: "cover",
                      cursor: "pointer",
                    }}
                    onClick={handleImageClick}
                  />
                  <input
                    type="file"
                    className="d-none"
                    id="imageInput"
                    onChange={handleImageChange}
                  />
                </div>
                <div className="col-md-6 mt-md-3">
                  <label htmlFor="name" className="form-label">
                    Product Name :
                  </label>
                  <input
                    type="text"
                    name="name"
                    className="form-control"
                    value={product.name}
                    onChange={(e) =>
                      setProduct({ ...product, name: e.target.value })
                    }
                  />
                  <label htmlFor="name" className="form-label">
                    Product Description :
                  </label>
                  <input
                    type="text"
                    name="description"
                    className="form-control"
                    value={product.description}
                    onChange={(e) =>
                      setProduct({ ...product, description: e.target.value })
                    }
                  />
                  <label htmlFor="name" className="form-label mt-1">
                    Product Price :
                  </label>
                  <input
                    type="number"
                    name="price"
                    className="form-control"
                    value={product.price}
                    onChange={(e) =>
                      setProduct({
                        ...product,
                        price: parseInt(e.target.value),
                      })
                    }
                  />
                  <label htmlFor="name" className="form-label mt-1">
                    Product QTY :
                  </label>
                  <input
                    type="number"
                    name="qty"
                    className="form-control"
                    value={product.qty}
                    onChange={(e) =>
                      setProduct({ ...product, qty: parseInt(e.target.value) })
                    }
                    onKeyDown={handleQuantityChange}
                  />
                  <div className="d-flex justify-content-between">
                    <button
                      className="btn btn-danger my-3 fw-bold"
                      onClick={handleSaveChanges}
                    >
                      Save Changes
                    </button>
                    <button
                      className="btn"
                      onClick={() => {
                        handleDelete();
                      }}
                    >
                      <FaTrash size={30} color="red" />
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="col-md-6 my-3">
                  <img
                    src={mainImage}
                    alt={product.name}
                    className="img-fluid w-100"
                    style={{ maxHeight: "600px", objectFit: "cover" }}
                    onClick={handleImageView}
                  />
                </div>
                <div className="col-md-3" id="image-section">
                  <div className="row">
                    {sampleProduct.map((image, index) => (
                      <div className="col-4 col-md-12 card my-md-2 my-0 overflow-hidden">
                        <img
                          key={index}
                          src={image}
                          alt={`Thumbnail ${index + 1}`}
                          className={styles.productImage}
                          onClick={() => handleImagesClick(image)}
                        />
                      </div>
                    ))}
                  </div>
                </div>
                <div className="col-md-3 mt-md-3">
                  <h1 className="fw-bolder">{product.name}</h1>
                  <p className="fw-semibold">{product.description}</p>
                  <div className="mb-3">
                    <BsCash size={20} /> Cash on Delivery <br />
                    <FaSync /> Easy Exchange & Refund Policy <br />
                    <TbTruckDelivery size={20} /> Island Wide Delivery
                  </div>
                  <h4 className="text-primary">
                    LKR {product.price.toFixed(2)}
                  </h4>
                  <select
                    value={selectedSize}
                    onChange={(e) => setSelectedSize(e.target.value)}
                    className="form-select mb-3"
                    style={{ width: "80px" }}
                  >
                    <option value="" disabled>
                      Size
                    </option>
                    <option value="xs">XS</option>
                    <option value="s">S</option>
                    <option value="m">M</option>
                    <option value="l">L</option>
                    <option value="xl">XL</option>
                    <option value="2xl">2XL</option>
                    <option value="3xl">3XL</option>
                  </select>
                  <Link className={styles.hoverText}>
                    <BiBook /> Size Guide
                  </Link>

                  {userRole === "admin" && (
                    <div className="d-flex gap-2 gap-md-5">
                      <h5 className="">Available Quantity:</h5>
                      <div className="col-2">
                        <input
                          type="number "
                          className="form-control"
                          value={product.qty || 0}
                          onChange={(e) =>
                            setProduct({
                              ...product,
                              qty: parseInt(e.target.value),
                            })
                          }
                          onKeyDown={handleQuantityChange}
                        />
                      </div>
                    </div>
                  )}
                  <div className="d-flex justify-content-between my-3">
                    <button
                      className="btn btn-primary"
                      disabled={product.qty === 0}
                      onClick={() => handleAddToCart()}
                    >
                      {product.qty === 0 ? "Sold Out" : "Add to Cart"}
                    </button>
                    {userRole === "admin" && (
                      <div className="button-group">
                        <button
                          className="btn"
                          onClick={() => {
                            handleDelete();
                          }}
                        >
                          <FaTrash size={30} color="red" />
                        </button>
                        <button
                          className="btn"
                          onClick={() => {
                            setEdit(true);
                          }}
                        >
                          <FaEdit size={30} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}

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
      <Modal isOpen={modalIsOpen} onRequestClose={closeModal}>
        <button
          onClick={closeModal}
          className="btn btn-close position-absolute"
        ></button>
        <img
          src={mainImage}
          alt="Selected Product"
          className="img-fluid w-100"
          style={{ maxWidth: "100%" }}
        />
      </Modal>
      <Footer />
    </>
  );
};

export default ProductDetails;
