import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import Swal from "sweetalert2";

function Login() {
  const navigate = useNavigate();
  const location = useLocation();
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
    email: location.state?.email || "",
    password: location.state?.password || "",
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch("http://localhost:8080/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      if (response.ok) {
        const token = await response.text();
        localStorage.setItem("jwtToken", token);

        Toast.fire({
          icon: "success",
          title: "Logged in successfully",
        });
        navigate("/");
      } else {
        
        Toast.fire({
          icon: "error",
          title: response.status +": "+ await response.text(),
        });
      }
    } catch (error) {
      console.error("Error during login:", error);
    }
  };

  return (
    <>
      <div
        className="container d-flex justify-content-center align-items-center"
        style={{ height: "100vh" }}
      >
        <form
          className="col-6 bg-body-secondary p-3 rounded-3"
          onSubmit={handleSubmit}
        >
          <h1 className="mb-3 fw-bolder">Sign in</h1>

          <div className="form-floating mb-3">
            <input
              type="email"
              className="form-control"
              id="floatingInput"
              placeholder="name@example.com"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
            />
            <label htmlFor="floatingInput">Email address</label>
          </div>
          <div className="form-floating mb-3">
            <input
              type="password"
              className="form-control"
              id="floatingPassword"
              placeholder="Password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
            />
            <label htmlFor="floatingPassword">Password</label>
          </div>

          <div className="form-check text-start my-3">
            <input
              className="form-check-input"
              type="checkbox"
              value="remember-me"
              id="flexCheckDefault"
            />
            <label className="form-check-label" htmlFor="flexCheckDefault">
              Remember me
            </label>
          </div>
          <button className="btn btn-primary w-100 py-2" type="submit">
            Sign in
          </button>
          <div className="mt-3 d-flex justify-content-center gap-2">
            <p>Don't have an account?</p>
            <Link to="/register" className="text-decoration-none">
              Register
            </Link>
          </div>
        </form>
      </div>
    </>
  );
}

export default Login;
