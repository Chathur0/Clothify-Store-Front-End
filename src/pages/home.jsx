import NavigationBar from "../component/navigationBar";
import banner from "/banner_images/main.jpg";
import men from "/banner_images/men-cloth.jpg";
import women from "/banner_images/women-cloth.jpg";
import kids from "/banner_images/kids-cloth.jpg";
import baby from "/banner_images/baby-cloth.jpg";
import styles from "./home.module.css";
import { useEffect, useState } from "react";
import Footer from "../component/footer";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

function Home() {
  const API_URL = import.meta.env.VITE_API_URL
  
  const [userRole, setUserRole] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [profileImage, setProfileImage] = useState("");
  const basePath = "";
  const navigate = useNavigate();
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

  return (
    <>
      <NavigationBar
        userRole={userRole}
        isLoggedIn={isLoggedIn}
        profileImage={profileImage}
      ></NavigationBar>
      <div className="w-100">
        <img src={banner} alt="Main Banner" className={styles.bannerImage} />
      </div>
      <div className="container my-5">
        <h1 className="fw-bolder">Shop by Category</h1>
        <div className="row mt-5">
          <div className="col-12 col-sm-6 mt-3 mt-sm-0">
            <img src={men} alt="Men's Clothing" className="w-100" />
          </div>
          <div className="col-12 col-sm-6 mt-3 mt-sm-0">
            <h3 className="fw-bold">Men’s Clothing & Accessories</h3>
            <p className="fw-semibold">
              Upgrade your wardrobe with trendy, comfortable clothing and sleek
              accessories designed for every occasion.
            </p>
            <button
              className="btn btn-success"
              onClick={() => {
                navigate(`${basePath}/men-product`);
              }}
            >
              MORE INFO
            </button>
          </div>
        </div>
        <div className="row mt-5">
          <div className="col-12 col-sm-6 mt-3 mt-sm-0 order-1 order-sm-0">
            <h3 className="fw-bold">Women’s Clothing & Accessories</h3>
            <p className="fw-semibold">
              Discover elegant, chic, and versatile styles that bring out your
              confidence, with accessories to match your every mood.
            </p>
            <button
              className="btn btn-success"
              onClick={() => {
                navigate(`${basePath}/women-product`);
              }}
            >
              MORE INFO
            </button>
          </div>
          <div className="col-12 col-sm-6">
            <img src={women} alt="" className="w-100" height={""} />
          </div>
        </div>
        <div className="row mt-5">
          <div className="col-12 col-sm-6">
            <img src={kids} alt="" className="w-100" height={""} />
          </div>
          <div className="col-12 col-sm-6 mt-5 mt-sm-0">
            <h3 className="fw-bold">Kids Clothing & Accessories</h3>
            <p className="fw-semibold">
              Find fun, durable, and vibrant clothing for kids, along with
              accessories that let them shine in every adventure.
            </p>
            <button
              className="btn btn-success"
              onClick={() => {
                navigate(`${basePath}/kids-product`);
              }}
            >
              MORE INFO
            </button>
          </div>
        </div>
        <div className="row mt-5">
          <div className="col-12 col-sm-6 mt-3 mt-sm-0 order-1 order-sm-0">
            <h3 className="fw-bold">Baby’s Clothing & Accessories</h3>
            <p className="fw-semibold">
              Explore soft, safe, and adorable outfits for your little ones,
              paired with must-have accessories to keep them comfy and stylish.
            </p>
            <button
              className="btn btn-success"
              onClick={() => {
                navigate(`${basePath}/baby-product`);
              }}
            >
              MORE INFO
            </button>
          </div>
          <div className="col-12 col-sm-6">
            <img src={baby} alt="" className="w-100" height={""} />
          </div>
        </div>
      </div>
      <Footer/>
    </>
  );
}
export default Home;
