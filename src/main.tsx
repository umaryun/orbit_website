import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import ChromaLanding from "./ChromaLanding";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ChromaLanding />
  </StrictMode>
);
