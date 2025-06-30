import { RouterProvider } from "react-router-dom";
import { router } from "./routes";

export function RoutersProvider() {
  return <RouterProvider router={router} />;
}
