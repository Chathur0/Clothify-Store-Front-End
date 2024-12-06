import { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import styles from "./alertStyles.module.css"
function Register() {
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
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    address: "",
    mobileNumber: "",
    email: "",
    password: "",
    profileImage: null,
  });
  const [error, setError] = useState("");
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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
    if (file) {
      setFormData((prev) => ({ ...prev, profileImage: file }));
    }
  };

  const handleImageClick = () => {
    document.getElementById("imageInput").click();
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (
      !formData.firstName ||
      !formData.mobileNumber ||
      !formData.email ||
      !formData.password
    ) {
      setError("First Name, Mobile Number, Email, and Password are required!");
      return;
    }
    setError("");
    const userData = {
      fName: formData.firstName,
      lName: formData.lastName,
      number: formData.mobileNumber,
      address: formData.address,
      email: formData.email,
      password: formData.password,
    };

    const formDataToSend = new FormData();
    formDataToSend.append("customer", JSON.stringify(userData));
    if (formData.profileImage) {
      formDataToSend.append("profileImage", formData.profileImage);
    }

    try {
      const response = await fetch("http://localhost:8080/add-customer", {
        method: "POST",
        body: formDataToSend,
      });

      if (response.ok) {
        Toast.fire({
          icon: "success",
          title: "User added successfully!",
        });
        navigate("/login", {
          state: { email: formData.email, password: formData.password },
        });
      } else {     
        Swal.fire({
          text: await response.text(),
          icon: "error",
        });
      }
    } catch (error) {
      console.error("Error while sending request", error);
    }
  };

  return (
    <div
      className="container d-flex justify-content-center align-items-center"
      style={{ height: "100vh" }}
    >
      <form
        className="col-8 bg-body-secondary p-3 rounded-3"
        onSubmit={handleSubmit}
      >
        <h1 className="mb-3 fw-bolder text-center">Register</h1>
        {error && <div className="alert alert-danger text-center">{error}</div>}
        <div className="container col-4 col-lg-3 my-5 position-relative">
          <img
            src={
              formData.profileImage
                ? URL.createObjectURL(formData.profileImage)
                : "https://cdn-icons-png.flaticon.com/512/1999/1999625.png"
            }
            alt="Upload"
            className="w-100"
            id="imageTrigger"
            style={{
              cursor: "pointer",
              borderRadius: "50%",
              aspectRatio: "1",
              objectFit: "cover",
            }}
            onClick={handleImageClick}
          />
          <input
            type="file"
            name="profileImage"
            id="imageInput"
            accept="image/*"
            style={{ display: "none" }}
            onChange={handleImageChange}
          />
        </div>
        <div className="d-flex">
          <div className="col-6 pe-2">
            <div className="form-floating mb-3">
              <input
                type="text"
                className="form-control"
                name="firstName"
                placeholder="Your First Name"
                value={formData.firstName}
                onChange={handleInputChange}
              />
              <label>First Name</label>
            </div>
            <div className="form-floating mb-3">
              <input
                type="text"
                className="form-control"
                name="lastName"
                placeholder="Your Last Name"
                value={formData.lastName}
                onChange={handleInputChange}
              />
              <label>Last Name</label>
            </div>
            <div className="form-floating mb-3">
              <input
                type="text"
                className="form-control"
                name="address"
                placeholder="Your Address"
                value={formData.address}
                onChange={handleInputChange}
              />
              <label>Address</label>
            </div>
          </div>
          <div className="col-6 ps-2">
            <div className="form-floating mb-3">
              <input
                type="text"
                className="form-control"
                name="mobileNumber"
                placeholder="Your Number"
                value={formData.mobileNumber}
                onChange={handleInputChange}
              />
              <label>Mobile Number</label>
            </div>
            <div className="form-floating mb-3">
              <input
                type="email"
                className="form-control"
                name="email"
                placeholder="name@example.com"
                value={formData.email}
                onChange={handleInputChange}
              />
              <label>Email</label>
            </div>
            <div className="form-floating mb-3">
              <input
                type="password"
                className="form-control"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleInputChange}
              />
              <label>Password</label>
            </div>
          </div>
        </div>

        <button className="btn btn-primary w-100 py-2" type="submit">
          Register
        </button>
        <div className="mt-3 d-flex gap-3 justify-content-center">
          <p>Already have an account?</p>
          <Link to="/login" className="text-decoration-none">
            Login
          </Link>
        </div>
      </form>
    </div>
  );
}

export default Register;
