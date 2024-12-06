import React from "react";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";

const CartPopup = ({ show, onClose }) => {
  const { cart,cartCount, updateCartQty, removeFromCart } = useCart();
  const navigate = useNavigate();
  if (!show) return null;

  const handleUpdateQty = (id, newQty, availableQty) => {
    if (newQty <= 0) {
      removeFromCart(id);
    } else if (newQty > availableQty) {
      alert(`Only ${availableQty} items are available.`);
    } else {
      updateCartQty(id, newQty);
    }
  };
  const handleProceedToPay = () => {
    navigate("/payment",{ state: { cart, cartCount } });
  };

  return (
    <div className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50 d-flex justify-content-center align-items-center">
      <div
        className="bg-white p-4 rounded"
        style={{ width: "500px", maxHeight: "80vh", overflowY: "auto" }}
      >
        <h4>Cart</h4>
        {cart.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          <>
            <ul className="list-group mb-3">
              {cart.map((item) => (
                <li
                  key={item.id}
                  className="list-group-item d-flex justify-content-between align-items-center"
                >
                  <div>
                    <h5>{item.name}</h5>
                    <p>Rs {(item.sQty * item.price).toFixed(2)}</p>
                    <div className="d-flex align-items-center">
                      <button
                        className="btn btn-sm btn-outline-secondary me-2"
                        onClick={() =>
                          handleUpdateQty(item.id, item.sQty - 1, item.qty)
                        }
                      >
                        -
                      </button>
                      <span>{item.sQty}</span>
                      <button
                        className="btn btn-sm btn-outline-secondary ms-2"
                        onClick={() =>
                          handleUpdateQty(item.id, item.sQty + 1, item.qty)
                        }
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <div>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => removeFromCart(item.id)}
                    >
                      Remove
                    </button>
                  </div>
                </li>
              ))}
            </ul>
            <div className="text-end">
              <button className="btn btn-success" onClick={handleProceedToPay}>Proceed to Pay</button>
            </div>
          </>
        )}
        <button className="btn btn-secondary mt-3" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
};

export default CartPopup;
