import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import NavigationBar from "../component/navigationBar";
import Swal from "sweetalert2";
import Footer from "../component/footer";

function AdminDashboard() {
  const API_URL = import.meta.env.VITE_API_URL
  const [userRole, setUserRole] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [profileImage, setProfileImage] = useState("");
  const [orders, setOrders] = useState([]);
  const [filterNumber, setFilterNumber] = useState("");
  const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem("jwtToken");

    if (!token) {
      setIsLoggedIn(false);
      navigate(`/login`);
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

    const fetchOrders = async () => {
      try {
        const response = await fetch(`${API_URL}/get-orders`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          setOrders(await response.json());
        } else {
          console.error("Error fetching orders:", response.status);
        }
      } catch (error) {
        console.error("Error during fetch:", error);
      }
    };

    fetchUserRole();
    fetchOrders();
  }, [navigate]);

  const viewOrderDetails = (id) => {
    navigate(`/order`, { state:  id  });
  };

  const filteredOrders = orders.filter((order) =>
    order.number.toString().includes(filterNumber)
  );

  return (
    <>
      <NavigationBar
        userRole={userRole}
        isLoggedIn={isLoggedIn}
        profileImage={profileImage}
      />
      <div className="container mt-5">
        <h2 className="text-center mb-4">Admin Dashboard</h2>

        <div className="d-flex justify-content-end mb-3">
          <Link to={`/add-product`} className="btn btn-success">
            Add Product
          </Link>
        </div>

        <div className="mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Filter by Number"
            value={filterNumber}
            onChange={(e) => setFilterNumber(e.target.value)}
          />
        </div>

        <div className="card shadow-sm p-4">
          <h4 className="mb-3">Order Details</h4>
          <div className="table-responsive">
            <table className="table table-bordered table-hover">
              <thead className="table-dark">
                <tr>
                  <th>Order ID</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Number</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.length > 0 ? (
                  filteredOrders.map((order) => (
                    <tr key={order.orderId}>
                      <td>{order.orderId}</td>
                      <td>{order.date}</td>
                      <td>
                        <p
                          className={`rounded-4 text-white text-center ${
                            order.status === 1
                              ? "bg-danger"
                              : order.status === 2
                              ? "bg-warning"
                              : "bg-success"
                          }`}
                        >
                          {order.status === 1
                            ? "Pending"
                            : order.status === 2
                            ? "On Board"
                            : "Completed"}
                        </p>
                      </td>
                      <td>{order.number}</td>
                      <td>
                        <button
                          className="btn btn-primary btn-sm"
                          onClick={() => viewOrderDetails(order.orderId)}
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center">
                      No orders available.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <Footer/>
    </>
  );
}

export default AdminDashboard;
