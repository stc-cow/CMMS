import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

// Handle GitHub Pages SPA routing redirect from 404.html
if (sessionStorage.redirect) {
  const redirect = sessionStorage.redirect;
  delete sessionStorage.redirect;
  window.location.href = redirect;
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
