import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import styles from "./alertStyles.module.css";

function EditProfile() {
  const API_URL = import.meta.env.VITE_API_URL
  const location = useLocation();
  const navigate = useNavigate();
  const customer = location.state?.customer;

  const [newImage, setNewImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(
    customer?.image || "https://cdn-icons-png.flaticon.com/512/1999/1999625.png"
  );
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
  const [formData, setFormData] = useState({
    id: customer.id,
    fname: customer.fname,
    lname: customer.lname,
    image: customer.image,
    number: customer.number,
    address: customer.address,
    email: customer.email,
  });

  const [initialData, setInitialData] = useState({ ...formData });

  useEffect(() => {
    if (!localStorage.getItem("jwtToken")) {
      navigate(`/`);
    }
  }, [navigate]);

  if (!customer) {
    navigate(`/profile`);
    return null;
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const hasChanges = () => {
    return JSON.stringify(formData) !== JSON.stringify(initialData) || newImage;
  };

  const handleImageChange = (e) => {
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
    setNewImage(file);
    setPreviewImage(URL.createObjectURL(file));
  };

  const handleImageClick = () => {
    document.getElementById("imageInput").click();
  };

  const handleSave = async () => {
    if (!hasChanges()) {
      Swal.fire({
        text: "No changes made to the profile.",
        showCancelButton: true,
        confirmButtonText: "Back to profile",
      }).then((result) => {
        if (result.isConfirmed) {
          navigate(`/profile`);
        }
      });
      return;
    }
    const result = await Swal.fire({
      title: "Are you sure?",
      text:
        initialData.email === formData.email
          ? "Do you want to change your profile details?"
          : "It seems you are about to change your email. If you click OK, you will be logged out of the system. You can log in again using your new email.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "OK",
      cancelButtonText: "Cancel",
    });
    if (!result.isConfirmed) {
      return;
    }
    const formDataToSend = new FormData();
    formDataToSend.append("customer", JSON.stringify(formData));
    if (newImage) {
      formDataToSend.append("newImage", newImage);
    }

    try {
      const response = await fetch(`${API_URL}/update-user`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
        },
        body: formDataToSend,
      });

      if (response.ok) {
        Toast.fire({
          icon: "success",
          text: "Profile updated successfully."
        });
        if (initialData.email === formData.email) {
          navigate(`/profile`);
        } else {
          localStorage.clear();
          navigate(`/login`, {
            state: { email: formData.email, password: "" },
          });
        }
      } else {
        Swal.fire({
          title: "Error!",
          text: (await response.json()).error,
          icon: "error",
        });
      }
    } catch (error) {
      console.error("Error during update:", error);
      Swal.fire({
        title: "Error!",
        text: "An error occurred while updating your profile. Please try again later.",
        icon: "error",
      });
    }
  };

  return (
    <div className="container my-5">
      <h2 className="text-center mb-4">Edit Profile</h2>
      <div className="card shadow-sm p-4">
        <div className="col-md-4 d-flex justify-content-center">
          <img
            src={previewImage}
            alt="Profile"
            className="rounded-circle border-5"
            width="150"
            height="150"
            style={{ cursor: "pointer" }}
            onClick={handleImageClick}
          />
          <input
            type="file"
            className="d-none"
            id="imageInput"
            accept="image/*"
            onChange={handleImageChange}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">First Name</label>
          <input
            type="text"
            className="form-control"
            name="fname"
            value={formData.fname}
            onChange={handleInputChange}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Last Name</label>
          <input
            type="text"
            className="form-control"
            name="lname"
            value={formData.lname}
            onChange={handleInputChange}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Email</label>
          <input
            type="email"
            className="form-control"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Phone</label>
          <input
            type="text"
            className="form-control"
            name="number"
            value={formData.number}
            onChange={handleInputChange}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Address</label>
          <textarea
            className="form-control"
            name="address"
            value={formData.address}
            onChange={handleInputChange}
          ></textarea>
        </div>

        <button onClick={handleSave} className="btn btn-success">
          Save Changes
        </button>
      </div>
    </div>
  );
}

export default EditProfile;
