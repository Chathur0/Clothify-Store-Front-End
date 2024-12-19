import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import NavigationBar from "../component/navigationBar";
import Swal from "sweetalert2";
import Footer from "../component/footer";

function Order() {
  const API_URL = import.meta.env.VITE_API_URL
  const id = useLocation().state;
  const navigate = useNavigate();
  const [orderDetails, setOrderDetails] = useState(null);
  const [userRole, setUserRole] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [profileImage, setProfileImage] = useState("");
  const [status, setStatus] = useState(null);
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
          }
        } else {
          setIsLoggedIn(false);
        }
      } catch (error) {
        console.error(error);
        setIsLoggedIn(false);
      }
    };

    fetchUserRole();
  }, [navigate]);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      const token = localStorage.getItem("jwtToken");
      if (!token) {
        navigate(`/login`);
        return;
      }
      try {
        const response = await fetch(`${API_URL}/get-order/${id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setOrderDetails(data);
          setStatus(data.status);
        } else if (response.status === 401) {
          localStorage.clear();
          navigate(`/login`);
        }
      } catch (err) {
        console.error(err);
      }
    };

    if (id) {
      fetchOrderDetails();
    }
  }, [id, navigate]);

  const handleStatusChange = async (newStatus) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: `you want to change the order status to ${
        newStatus === "1"
          ? "Pending"
          : newStatus === "2"
          ? "On Board"
          : "Completed"
      }?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes",
      confirmButtonColor: "#dc3545",
      cancelButtonText: "Cancel",
    });

    if (!result.isConfirmed) {
      return;
    }

    const token = localStorage.getItem("jwtToken");
    try {
      const response = await fetch(
        `${API_URL}/update-order-status/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: newStatus,
        }
      );

      if (response.ok) {
        setStatus(newStatus);
        Toast.fire({
          icon: "success",
          title: "Order status updated successfully",
        });
      } else {
        Swal.fire({
          icon: "error",
          text: "Failed to update status",
          title: "Error!",
        });
      }
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  if (!orderDetails) return <p>Loading...</p>;

  return (
    <>
      <NavigationBar
        userRole={userRole}
        isLoggedIn={isLoggedIn}
        profileImage={profileImage}
      />
      <div className="container mt-5">
        <div className="text-center mb-4">
          <h1 className="display-6">Order ID: {orderDetails.orderId}</h1>
        </div>
        {userRole == "admin" && (
          <div className="card mb-4">
            <div className="card-header">
              <h4>User Details</h4>
            </div>
            <div className="card-body">
              <p>
                <strong>Name:</strong>{" "}
                {`${orderDetails.userDetails.fname} ${orderDetails.userDetails.lname}`}
              </p>
              <p>
                <strong>Email:</strong> {orderDetails.userDetails.email}
              </p>
              <p>
                <strong>Address:</strong> {orderDetails.userDetails.address}
              </p>
              <p>
                <strong>Contact:</strong> {orderDetails.userDetails.number}
              </p>
            </div>
          </div>
        )}

        <div className="card mb-4">
          <div className="card-header">
            <h4>Product Details</h4>
          </div>
          <div className="card-body table-responsive">
            <table className="table table-striped">
              <thead className="table-dark">
                <tr>
                  <th scope="col">Image</th>
                  <th scope="col">Name</th>
                  <th scope="col">Category</th>
                  <th scope="col">Quantity</th>
                  <th scope="col">Price</th>
                </tr>
              </thead>
              <tbody>
                {orderDetails.productDetails.map((product, index) => (
                  <tr key={index}>
                    <td>
                      <img
                        src={product.image}
                        alt={product.name}
                        className="img-thumbnail"
                        style={{ width: "100px" }}
                      />
                    </td>
                    <td>{product.name}</td>
                    <td>{product.category}</td>
                    <td>{product.numberOfItems}</td>
                    <td>{product.price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h4>Order Summary</h4>
          </div>
          <div className="card-body">
            <p>
              <strong>Total Cost:</strong> ${orderDetails.cost}
            </p>
            <p>
              <strong>Date:</strong> {orderDetails.date}
            </p>
            <label>
              <strong>Status:</strong>
              <select
                className="form-select mt-2"
                value={status}
                onChange={(e) => handleStatusChange(e.target.value)}
                disabled={userRole !== "admin" || status === 3}
              >
                <option value="1">Pending</option>
                <option value="2">On Board</option>
                <option value="3">Completed</option>
              </select>
            </label>
          </div>
        </div>
      </div>
      <Footer/>
    </>
  );
}

export default Order;
