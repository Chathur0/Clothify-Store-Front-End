import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import NavigationBar from "../component/navigationBar";
import Swal from "sweetalert2";
import styles from "./alertStyles.module.css";

function AddProduct() {
  const API_URL = import.meta.env.VITE_API_URL
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    price: "",
    qty: "",
    image: null,
  });
  const [userRole, setUserRole] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [profileImage, setProfileImage] = useState("");
  const navigate = useNavigate();

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

  useEffect(() => {
    const token = localStorage.getItem("jwtToken");

    if (!token) {
      setIsLoggedIn(false);
      navigate(`/login`);
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
          if (responseData.role !== "admin") {
            navigate(`/`);
            return;
          }
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
                navigate(`/login`);
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.size > 5 * 1024 * 1024) {
      Swal.fire({
        text: "File size should not exceed 5MB!",
        icon: "warning",
        customClass: {
          popup: styles.dangerBackground,
        },
      });
      e.target.value = "";
      return;
    }
    setFormData((prevData) => ({ ...prevData, image: file }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataToSend = new FormData();
    formDataToSend.append(
      "product",
      JSON.stringify({
        name: formData.name,
        description: formData.description,
        category: formData.category,
        price: formData.price,
        qty: formData.qty,
      })
    );
    formDataToSend.append("image", formData.image);

    try {
      const response = await fetch(`${API_URL}/add-product`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
        },
        body: formDataToSend,
      });

      if (response.ok) {
        Toast.fire({
          icon: "success",
          title: "Product added successfully!",
        });
        location.reload();
      } else {
        Toast.fire({
          icon: "error",
          title: `${(await response.json()).error}`,
        });
      }
    } catch (error) {
      Swal.fire({
        text: "An error occurred while submitting the product.",
        icon: "error",
        timer: 1500,
      });
    }
  };

  return (
    <>
      <NavigationBar
        userRole={userRole}
        isLoggedIn={isLoggedIn}
        profileImage={profileImage}
      ></NavigationBar>
      <div className="container mt-5">
        <h2 className="text-center mb-4">Add Product</h2>
        <div className="card shadow-sm p-4">
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="name" className="form-label">
                Product Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                className="form-control"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="description" className="form-label">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                className="form-control"
                rows="3"
                value={formData.description}
                onChange={handleChange}
                required
              ></textarea>
            </div>

            <div className="mb-3">
              <label htmlFor="category" className="form-label">
                Category
              </label>
              <select
                id="category"
                name="category"
                className="form-select"
                value={formData.category}
                onChange={handleChange}
                required
              >
                <option value="" disabled>
                  Select Category
                </option>
                <option value="1">Men</option>
                <option value="2">Women</option>
                <option value="3">Kids</option>
                <option value="4">Baby</option>
              </select>
            </div>

            <div className="mb-3">
              <label htmlFor="price" className="form-label">
                Price
              </label>
              <input
                type="number"
                id="price"
                name="price"
                className="form-control"
                value={formData.price}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="qty" className="form-label">
                Quantity
              </label>
              <input
                type="number"
                id="qty"
                name="qty"
                className="form-control"
                value={formData.qty}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="image" className="form-label">
                Upload Image
              </label>
              <input
                type="file"
                id="image"
                name="image"
                className="form-control"
                onChange={handleFileChange}
                required
              />
            </div>

            <button type="submit" className="btn btn-primary">
              Add Product
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export default AddProduct;
