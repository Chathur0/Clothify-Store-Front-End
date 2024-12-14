import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import { LoginSocialFacebook } from "reactjs-social-login";
import { FaFacebook, FaGoogle } from "react-icons/fa6";
import { useGoogleLogin } from "@react-oauth/google";

function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const basePath = "";
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
        navigate(`${basePath}/`);
      } else {
        Toast.fire({
          icon: "error",
          title: response.status + ": " + (await response.text()),
        });
      }
    } catch (error) {
      console.error("Error during login:", error);
    }
  };
  async function loginViaSocialMedia(dataForSend) {
    try {
      const result = await fetch(
        "http://localhost:8080/login-via-social-media",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(dataForSend),
        }
      );
      if (result.ok) {
        const token = await result.text();
        localStorage.setItem("jwtToken", token);

        Toast.fire({
          icon: "success",
          title: "Logged in successfully",
        });
        navigate(`${basePath}`);
      } else {
        Toast.fire({
          icon: "error",
          title: response.status + ": " + (await response.text()),
        });
      }
    } catch (error) {
      console.error("Error during request:", error);
    }
  }
  const login = useGoogleLogin({
    onSuccess: async (response) => {     
      try {
        const res = await fetch(
          "https://www.googleapis.com/oauth2/v3/userinfo",
          {
            headers: {
              Authorization: `Bearer ${response.access_token}`,
            },
          }
        );

        if (res.ok) {
          const user = await res.json();
          loginViaSocialMedia({
            fName: user.given_name,
            lName: user.family_name,
            email: user.email,
            image: user.picture,
          });
        } else {
          console.error("Failed to fetch user info");
          Toast.fire({
            icon: "error",
            title: "Failed to fetch user info",
          });
        }
      } catch (error) {
        console.error("Error fetching user info:", error);
        Toast.fire({
          icon: "error",
          title: "Error during login",
        });
      }
    },
    onError: () => {
      console.error("Login Failed");
      Toast.fire({
        icon: "error",
        title: "Google login failed",
      });
    },
  });
  return (
    <>
      <div
        className="container d-flex justify-content-center align-items-center"
        style={{ height: "100vh" }}
      >
        <form className="col-7 bg-body-secondary p-3 rounded-3">
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
          <button className="btn btn-primary w-100 py-2" onClick={handleSubmit}>
            Sign in
          </button>
          <div className="mt-3 row">
            <div className="col-12 col-sm-6">
              <a className="btn btn-light w-100" onClick={() => login()}>
                <FaGoogle /> Google
              </a>
            </div>
            <div className="col-12 mt-3 mt-sm-0 col-sm-6">
              <LoginSocialFacebook
                appId="548864748112120"
                onResolve={(response) => {
                  loginViaSocialMedia({
                    fName: response.data.first_name,
                    lName: response.data.last_name,
                    email: response.data.email,
                    image: response.data.picture.data.url,
                  });
                }}
                onReject={(error) => {
                  console.log(error);
                }}
              >
                <a className="btn btn-light w-100">
                  <FaFacebook /> Facebook
                </a>
              </LoginSocialFacebook>
            </div>
          </div>

          <div className="mt-3 d-flex justify-content-center gap-2">
            <p>Don't have an account?</p>
            <Link to={`${basePath}/register`} className="text-decoration-none">
              Register
            </Link>
          </div>
        </form>
      </div>
    </>
  );
}

export default Login;
