import { Outlet } from "react-router-dom";

export default function AdminTemplate() {
  return (
    <div>
      <h1>Navbar AdminTemplate</h1>
      <Outlet />
    </div>
  );
}
