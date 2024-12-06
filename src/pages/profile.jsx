import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaEdit, FaTrashAlt, FaClipboardList } from "react-icons/fa";
import NavigationBar from "../component/navigationBar";
import Swal from "sweetalert2";

function CustomerProfile() {
  const navigate = useNavigate();
  const [customer, setCustomer] = useState(null);
  const [userRole, setUserRole] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [profileImage, setProfileImage] = useState("");
  const [orderHistory, setOrderHistory] = useState(null);
  const [showOrderModal, setShowOrderModal] = useState(false);
  useEffect(() => {
    const token = localStorage.getItem("jwtToken");

    if (!token) {
      navigate("/");
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
          } else {
            console.error("Authorization error:", errorData.error);
            setIsLoggedIn(false);
          }
        }
      } catch (error) {
        console.error("Error during fetch:", error);
        setIsLoggedIn(false);
      }
    };

    fetchUserRole();
  }, []);
  useEffect(() => {
    const fetchCustomerDetails = async () => {
      const token = localStorage.getItem("jwtToken");
      if (token) {
        try {
          const response = await fetch("http://localhost:8080/current-user", {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          if (response.ok) {
            const customerData = await response.json();
            setCustomer(customerData);
          } else {
            console.error("Error fetching customer details");
          }
        } catch (error) {
          console.error("Error during fetch:", error);
        }
      }
    };
    fetchCustomerDetails();
  }, []);

  const handleDeleteAccount = async () => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Are you sure you want to delete your account? This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "OK",
      confirmButtonColor:"#dc3545",
      cancelButtonText: "Cancel",
    });
    if (result.isConfirmed) {
      try {
        const response = await fetch(
          `http://localhost:8080/delete-user/${customer.id}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
            },
          }
        );
        if (response.ok) {
          Swal.fire({
            title: "Deleted!",
            text: "Account deleted successfully.",
            icon: "success"
          });
          localStorage.removeItem("jwtToken");
          navigate("/");
        } else {
          console.error("Failed to delete account.");
          Swal.fire({
            title: "Error!",
            text: "There was an issue deleting your account. Please try again.",
            icon: "error"
          });
        }
      } catch (error) {
        console.error("Error during delete request:", error);
        Swal.fire({
          title: "Error!",
          text: "An error occurred while deleting your account.",
          icon: "error"
        });
      }
    }
  };

  const handleEditProfile = () => {
    navigate("/edit-profile", { state: { customer } });
  };

  useEffect(() => {
    async function getOrderHistory() {
      const token = localStorage.getItem("jwtToken");

      if (!token) {
        navigate("/");
        return;
      }
      if (customer) {
        try {
          const response = await fetch(
            `http://localhost:8080/order-history/${customer.id}`,
            {
              method: "GET",
              headers: {
                Authorization: token,
              },
            }
          );
          if (response.ok) {
            const orderData = await response.json();
            setOrderHistory(orderData);
          } else {
            console.error("Error fetching customer details");
          }
        } catch (error) {
          console.error("Error during fetch:", error);
        }
      }
    }

    getOrderHistory();
  }, [customer]);

  const toggleOrderModal = () => {
    setShowOrderModal(!showOrderModal);
  };
  if (!customer) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <NavigationBar
        userRole={userRole}
        isLoggedIn={isLoggedIn}
        profileImage={profileImage}
      ></NavigationBar>
      <div className="container my-5">
        <h2 className="text-center mb-4">Customer Profile</h2>

        <div className="card shadow-sm p-4">
          <div className="row">
            <div className="col-md-4 d-flex justify-content-center">
              <img
                src={
                  customer.image ||
                  "https://cdn-icons-png.flaticon.com/512/1999/1999625.png"
                }
                alt="Profile"
                className="rounded-circle"
                width="150"
                height="150"
              />
            </div>

            <div className="col-md-8 mt-5 mt-md-0">
              <div className="mb-3">
                <strong>Name:</strong> {customer.fname + " " + customer.lname}
              </div>
              <div className="mb-3">
                <strong>Email:</strong> {customer.email}
              </div>
              <div className="mb-3">
                <strong>Phone:</strong> {customer.number}
              </div>
              <div className="mb-3">
                <strong>Address:</strong> {customer.address}
              </div>

              <div className="d-flex justify-content-start mt-4 row">
                <button
                  onClick={handleEditProfile}
                  className="btn btn-primary me-3 col mt-3 mt-sm-0"
                >
                  <FaEdit /> Edit Profile
                </button>
                {orderHistory && orderHistory.length != 0 && (
                  <button
                    className="btn btn-secondary me-3 col mt-3 mt-sm-0"
                    onClick={toggleOrderModal}
                  >
                    <FaClipboardList /> Order History
                  </button>
                )}
                {userRole !== "admin" &&(
                  <button
                  onClick={handleDeleteAccount}
                  className="btn btn-danger col mt-3 mt-sm-0"
                >
                  <FaTrashAlt /> Delete Account
                </button>
                )}  
              </div>
            </div>
          </div>
        </div>
      </div>
      {showOrderModal && (
        <div className="modal show" style={{ display: "block" }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Order History</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={toggleOrderModal}
                ></button>
              </div>
              <div
                className="modal-body table-responsive"
                style={{ maxHeight: "400px", overflowY: "auto" }}
              >
                <table className="table">
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Date</th>
                      <th>Status</th>
                      <th>View Full Details</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orderHistory.map((order, index) => (
                      <tr key={index}>
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
                        <td>
                          <button
                            className="btn btn-outline-primary rounded-5"
                            onClick={() => {
                              navigate("/order", { state: order.orderId });
                            }}
                          >
                            Details
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={toggleOrderModal}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default CustomerProfile;
