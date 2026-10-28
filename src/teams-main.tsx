import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import Teams from "./pages/Teams";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Teams />
  </StrictMode>
);
