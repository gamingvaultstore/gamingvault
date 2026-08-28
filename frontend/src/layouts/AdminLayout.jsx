import React from "react";
import { NavLink, Outlet, Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const AdminLayout = () => {
  const { logout } = useAuth();

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <Link to="/admin" className="brand">
          GameVault Admin
        </Link>
        <NavLink end to="/admin">
          Dashboard
        </NavLink>
        <NavLink to="/admin/accounts">Accounts</NavLink>
        <NavLink to="/admin/orders">Orders</NavLink>
        <NavLink to="/admin/settings">Settings</NavLink>
        <NavLink to="/admin/customer-proofs">Customer Proofs</NavLink>
        <NavLink to="/admin/faqs">FAQs</NavLink>
        <button className="button small" onClick={logout}>
          Logout
        </button>
      </aside>
      <section className="admin-content">
        <Outlet />
      </section>
    </div>
  );
};

export default AdminLayout;
