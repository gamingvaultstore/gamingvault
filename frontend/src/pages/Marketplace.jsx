import React from "react";
import { useEffect, useMemo, useState } from "react";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import AccountCard from "../components/AccountCard";
import EmptyState from "../components/EmptyState";
import FormMessage from "../components/FormMessage";
import api, { errorMessage } from "../services/api";

const routeGame = (value) => {
  if (value === "bgmi") return "BGMI";
  if (value === "free-fire") return "FREE_FIRE";
  return "";
};

const Marketplace = () => {
  const { game } = useParams();
  const navigate = useNavigate();
  const selectedGame = routeGame(game);
  const [accounts, setAccounts] = useState([]);
  const [sort, setSort] = useState("newest");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const pageTitle = useMemo(() => {
    if (selectedGame === "BGMI") return "BGMI Accounts";
    if (selectedGame === "FREE_FIRE") return "Free Fire Accounts";
    return "Gaming Marketplace";
  }, [selectedGame]);

  useEffect(() => {
    const loadAccounts = async () => {
      setLoading(true);
      setError("");
      try {
        const params = new URLSearchParams();
        if (selectedGame) params.set("game", selectedGame);
        if (sort !== "newest") params.set("sort", sort);
        if (minPrice) params.set("minPrice", minPrice);
        if (maxPrice) params.set("maxPrice", maxPrice);
        const { data } = await api.get(`/accounts?${params.toString()}`);
        setAccounts(data);
      } catch (err) {
        setError(errorMessage(err, "Could not load marketplace"));
      } finally {
        setLoading(false);
      }
    };

    loadAccounts();
  }, [selectedGame, sort, minPrice, maxPrice]);

  const onGameFilter = (value) => {
    if (!value) navigate("/marketplace");
    if (value === "BGMI") navigate("/marketplace/bgmi");
    if (value === "FREE_FIRE") navigate("/marketplace/free-fire");
  };

  return (
    <section className="section page-section">
      <div className="section-heading">
        <span className="eyebrow">Browse accounts</span>
        <h1>{pageTitle}</h1>
      </div>

      <div className="tabs">
        <NavLink end to="/marketplace">
          ALL
        </NavLink>
        <NavLink to="/marketplace/bgmi">BGMI</NavLink>
        <NavLink to="/marketplace/free-fire">FREE FIRE</NavLink>
      </div>

      <div className="filters">
        <label>
          Game
          <select
            value={selectedGame}
            onChange={(event) => onGameFilter(event.target.value)}
          >
            <option value="">All</option>
            <option value="BGMI">BGMI</option>
            <option value="FREE_FIRE">Free Fire</option>
          </select>
        </label>
        <label>
          Sort
          <select
            value={sort}
            onChange={(event) => setSort(event.target.value)}
          >
            <option value="newest">Newest</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
          </select>
        </label>
        <label>
          Min price
          <input
            type="number"
            min="0"
            value={minPrice}
            onChange={(event) => setMinPrice(event.target.value)}
            placeholder="0"
          />
        </label>
        <label>
          Max price
          <input
            type="number"
            min="0"
            value={maxPrice}
            onChange={(event) => setMaxPrice(event.target.value)}
            placeholder="5000"
          />
        </label>
      </div>

      <FormMessage>{error}</FormMessage>

      {loading ? (
        <div className="loading-line">Loading accounts...</div>
      ) : accounts.length ? (
        <div className="account-grid">
          {accounts.map((account) => (
            <AccountCard key={account._id} account={account} />
          ))}
        </div>
      ) : (
        <EmptyState
          title={
            selectedGame === "BGMI"
              ? "No BGMI accounts available"
              : selectedGame === "FREE_FIRE"
                ? "No Free Fire accounts available"
                : "No accounts available"
          }
          text="New accounts will be added soon."
        />
      )}
    </section>
  );
};

export default Marketplace;
