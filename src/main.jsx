import { createRoot } from "react-dom/client";
import "bootstrap/dist/css/bootstrap.min.css";
import App from "./App.jsx";
import "bootstrap/dist/js/bootstrap.min.js";
import "bootstrap-icons/font/bootstrap-icons.css";
import { GoogleOAuthProvider } from "@react-oauth/google";
createRoot(document.getElementById("root")).render(
  <GoogleOAuthProvider clientId="621923653733-g8kjr5drl90li66sb9ukktdg20fr53lu.apps.googleusercontent.com">
      <App />
  </GoogleOAuthProvider>
);
