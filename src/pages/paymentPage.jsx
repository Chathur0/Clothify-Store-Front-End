import { React, useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import CryptoJS from "crypto-js";
import { useCart } from "../context/CartContext";
import Swal from "sweetalert2";

const PaymentPage = () => {
  const API_URL = import.meta.env.VITE_API_URL
  const location = useLocation();
  const { cart, cartCount } = location.state;
  const [customer, setCustomer] = useState(null);
  const { clearCart } = useCart();
  const totalCost = cart.reduce((acc, item) => acc + item.sQty * item.price, 0);
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
    if (cart.length === 0) {
      navigate(`/`);
      return;
    }
    const fetchCustomerDetails = async () => {
      const token = localStorage.getItem("jwtToken");
      if (token) {
        try {
          const response = await fetch(`${API_URL}/current-user`, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          if (response.ok) {
            const customerData = await response.json();
            setCustomer(customerData);
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
                  navigate(`/login`)
                },
              });
            } else {
              console.error("Authorization error:", errorData.error);
            }
          } else {
            console.error("Error fetching user data:", response.status);
          }
        } catch (error) {
          console.error("Error during fetch:", error);
        }
      } else {
        navigate(`/login`);
      }
    };
    fetchCustomerDetails();
  }, []);

  async function paymentGateWay() {
    payhere.onCompleted = async function onCompleted(orderId) {
      placeOrder()
    };

    payhere.onDismissed = function onDismissed() {
      console.log("Payment dismissed");
    };

    payhere.onError = function onError(error) {
      console.log("Error:" + error);
    };
    const merchantId = "1228902";
    const orderId = "0";
    const amount = totalCost.toFixed(2);
    const currency = "LKR";
    const merchantSecret =
      "Mjc0MDc3ODExMzM2NTg0MTU4OTY0ODgwODEyODMyOTk3Mjc4MzQ2";

    const secretHash = CryptoJS.MD5(merchantSecret)
      .toString(CryptoJS.enc.Hex)
      .toUpperCase();

    const hashInput = `${merchantId}${orderId}${amount}${currency}${secretHash}`;
    const hash = CryptoJS.MD5(hashInput)
      .toString(CryptoJS.enc.Hex)
      .toUpperCase();

    var payment = {
      sandbox: true,
      merchant_id: merchantId,
      return_url: "http://localhost:5173/payment",
      cancel_url: "http://localhost:5173/payment",
      notify_url: "http://sample.com/notify",
      order_id: orderId,
      items: `${cartCount} item${cartCount > 1 ? "s" : ""}`,
      amount: amount,
      currency: currency,
      hash: hash,
      first_name: customer.fname,
      last_name: customer.lname,
      email: customer.email,
      phone: customer.number,
      address: customer.address,
      city: "Colombo",
      country: "Sri Lanka",
      delivery_address: "No.",
      delivery_city: "no",
      delivery_country: "Sri Lanka",
      custom_1: "",
      custom_2: "",
    };
    payhere.startPayment(payment);
  }
  async function placeOrder(){
    const payload = {
      cart: cart.map((item) => ({
        productId: item.id,
        quantity: item.sQty,
        price: item.sQty * item.price,
      })),
      totalCost: totalCost,
      customer: customer,
    };

    try {
      const response = await fetch(`${API_URL}/buy-products`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        Toast.fire({
          icon: "success",
          title: `Payment Successful! ${await response.text()}`,
        });
        clearCart();
        navigate(`/`);
      } else {
        console.error("Error from server:", response.status);
        Swal.fire({
          icon: "warning",
          text:"Contact Us",
          title: "Payment Successful, but there was an issue saving your order.",
          footer: "+94 - 000000000"
        });
      }
    } catch (error) {
      console.error("Error sending data to backend:", error);
      Swal.fire({
        icon: "warning",
        text:"Contact Us",
        title: "Payment Successful, but an error occurred while processing your order.",
        footer: "+94 - 000000000"
      });
    }
  }
  return (
    <div className="container mt-5">
      <h2>Invoice</h2>
      <div class="table-responsive">
        <table className="table table-hover">
          <thead>
            <tr>
              <th>Product Name</th>
              <th>Quantity</th>
              <th>Price per Item</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {cart.map((item) => (
              <tr key={item.id}>
                <td>{item.name}</td>
                <td>{item.sQty}</td>
                <td>LKR {item.price.toFixed(2)}</td>
                <td>LKR {(item.sQty * item.price).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <h4 className="text-end">Total Cost: LKR {totalCost.toFixed(2)}</h4>
      <button className="btn btn-primary mt-3" onClick={paymentGateWay}>
        Pay Now
      </button>
      <button className="btn btn-danger mt-3 ms-3" onClick={placeOrder}>Only for testing</button>
    </div>
  );
};

export default PaymentPage;
