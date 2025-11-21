import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import TableProvider from "./context/table.context.tsx";

createRoot(document.getElementById("root")!).render(
  <TableProvider>
    <App />
  </TableProvider>
);
