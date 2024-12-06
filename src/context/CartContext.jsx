import React, { createContext, useState, useContext } from "react";

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [cartCount, setCartCount] = useState(0);

  const calculateCartCount = (cart) => {
    return cart.reduce((total, item) => total + item.sQty, 0);
  };

  const addToCart = (product, qty) => {
    setCart((prev) => {
      const existingProduct = prev.find((item) => item.id === product.id);
      
      if (existingProduct) {
        if (existingProduct.sQty + qty > product.qty) {
          alert(`Only ${product.qty} items are available.`);
          return prev;
        }
        const updatedCart = prev.map((item) =>
          item.id === product.id ? { ...item, sQty: item.sQty + qty } : item
        );
        const newCartCount = calculateCartCount(updatedCart);
        setCartCount(newCartCount);  
        return updatedCart;
      }

      if (qty > product.qty) {
        alert(`Only ${product.qty} items are available.`);
        return prev;
      }

      const newCart = [...prev, { ...product, sQty: qty }];
      const newCartCount = calculateCartCount(newCart);
      setCartCount(newCartCount);  
      return newCart;
    });
  };

  const updateCartQty = (id, newQty) => {
    setCart((prev) => {
      const updatedCart = prev.map((item) =>
        item.id === id ? { ...item, sQty: newQty } : item
      );
      const newCartCount = calculateCartCount(updatedCart);
      setCartCount(newCartCount);  
      return updatedCart;
    });
  };

  const removeFromCart = (id) => {
    setCart((prev) => {
      const updatedCart = prev.filter((item) => item.id !== id);
      const newCartCount = calculateCartCount(updatedCart);
      setCartCount(newCartCount);  
      return updatedCart;
    });
  };
  const clearCart = () => {
    setCart([]);
    setCartCount(0);
  };
  return (
    <CartContext.Provider value={{ cart, cartCount, addToCart, updateCartQty, removeFromCart,clearCart  }}>
      {children}
    </CartContext.Provider>
  );
};
