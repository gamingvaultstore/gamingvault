import React from "react";
import { NavLink, Outlet, Link } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../hooks/useAuth";

const PublicLayout = () => {
  const [open, setOpen] = useState(false);
  const { isLoggedIn, logout } = useAuth();

  const close = () => setOpen(false);

  return (
    <>
      <header className="site-header">
        <nav className="navbar">
          <Link to="/" className="brand" onClick={close}>
            GameVault
          </Link>
          <button className="menu-button" onClick={() => setOpen((v) => !v)}>
            Menu
          </button>
          <div className={`nav-links ${open ? "open" : ""}`}>
            <NavLink to="/" onClick={close}>
              Home
            </NavLink>
            <NavLink to="/marketplace" onClick={close}>
              Marketplace
            </NavLink>
            <NavLink to="/marketplace/bgmi" onClick={close}>
              BGMI
            </NavLink>
            <NavLink to="/marketplace/free-fire" onClick={close}>
              Free Fire
            </NavLink>
            <NavLink to="/refer-earn" onClick={close}>
              Refer & Earn
            </NavLink>
            <NavLink to="/happy-customers" onClick={close}>
              Happy Customers
            </NavLink>
            <NavLink to="/faq" onClick={close}>
              FAQ
            </NavLink>
          </div>
          <div className="nav-actions">
            {isLoggedIn ? (
              <>
                <Link className="button ghost small" to="/dashboard">
                  Dashboard
                </Link>
                <button className="button small" onClick={logout}>
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link className="button ghost small" to="/login">
                  Login
                </Link>
                <Link className="button small" to="/register">
                  Register
                </Link>
              </>
            )}
          </div>
        </nav>
      </header>
      <main>
        <Outlet />
      </main>
      <footer className="footer">
        <div>
          <h3>GameVault</h3>
          <p>
            Admin-listed BGMI and Free Fire accounts with manual UPI
            verification.
          </p>
        </div>
        <div>
          <h4>Marketplace</h4>
          <Link to="/marketplace">All Accounts</Link>
          <Link to="/marketplace/bgmi">BGMI</Link>
          <Link to="/marketplace/free-fire">Free Fire</Link>
        </div>
        <div>
          <h4>Support</h4>
          <Link to="/faq">FAQ</Link>
          <Link to="/refer-earn">Refer & Earn</Link>
          <a href="https://wa.me/919999999999">WhatsApp: +91 99999 99999</a>
        </div>
        <div>
          <h4>Policies</h4>
          <a href="#">Terms</a>
          <a href="#">Privacy</a>
          <a href="#">Refund policy</a>
        </div>
      </footer>
    </>
  );
};

export default PublicLayout;
