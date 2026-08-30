import React from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import AccountCard from "../components/AccountCard";
import EmptyState from "../components/EmptyState";
import FormMessage from "../components/FormMessage";
import SkeletonCard from "../components/SkeletonCard";
import { useToast } from "../context/ToastContext";
import api, { errorMessage, isCanceledRequest } from "../services/api";

const routeGame = (value) => {
  if (value === "bgmi") return "BGMI";
  if (value === "free-fire") return "FREE_FIRE";
  return "";
};

const Marketplace = () => {
  const { game } = useParams();
  const navigate = useNavigate();
  const { addToast } = useToast();
  const selectedGame = routeGame(game);
  const [accounts, setAccounts] = useState([]);
  const [sort, setSort] = useState("newest");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [requestState, setRequestState] = useState("loading");
  const [error, setError] = useState("");
  const [loadedQueryKey, setLoadedQueryKey] = useState("");
  const [retryCount, setRetryCount] = useState(0);
  const accountsRef = useRef([]);

  const pageTitle = useMemo(() => {
    if (selectedGame === "BGMI") return "BGMI Accounts";
    if (selectedGame === "FREE_FIRE") return "Free Fire Accounts";
    return "Gaming Marketplace";
  }, [selectedGame]);

  const accountQuery = useMemo(() => {
    const params = new URLSearchParams();
    if (selectedGame) params.set("game", selectedGame);
    if (sort !== "newest") params.set("sort", sort);
    if (minPrice) params.set("minPrice", minPrice);
    if (maxPrice) params.set("maxPrice", maxPrice);
    return params.toString();
  }, [selectedGame, sort, minPrice, maxPrice]);

  const queryKey = accountQuery || "all";
  const hasAccounts = accounts.length > 0;
  const isInitialLoading = requestState === "loading" && !hasAccounts;
  const isRefreshing = requestState === "refreshing";
  const isError = requestState === "error";
  const isShowingStaleResults =
    hasAccounts && loadedQueryKey !== queryKey && (isRefreshing || isError);

  useEffect(() => {
    accountsRef.current = accounts;
  }, [accounts]);

  useEffect(() => {
    const controller = new AbortController();
    const hasVisibleAccounts = accountsRef.current.length > 0;

    setRequestState(hasVisibleAccounts ? "refreshing" : "loading");
    setError("");

    const loadAccounts = async () => {
      try {
        const endpoint = accountQuery ? `/accounts?${accountQuery}` : "/accounts";
        const { data } = await api.get(endpoint, {
          signal: controller.signal,
        });

        if (!Array.isArray(data)) {
          throw new Error("Marketplace response was not a list");
        }

        setAccounts(data);
        setLoadedQueryKey(queryKey);
        setRequestState("success");
      } catch (err) {
        if (isCanceledRequest(err)) return;

        const msg = errorMessage(err, "Could not load marketplace");
        setError(msg);
        setRequestState("error");
        addToast(msg, "error");
      }
    };

    loadAccounts();

    return () => controller.abort();
  }, [accountQuery, queryKey, retryCount, addToast]);

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

      {error && (
        <div className="marketplace-status error">
          <FormMessage>{error}</FormMessage>
          <button
            className="button small ghost"
            type="button"
            onClick={() => setRetryCount((count) => count + 1)}
            disabled={isRefreshing || isInitialLoading}
          >
            Retry
          </button>
        </div>
      )}

      {isRefreshing && (
        <div className="marketplace-status">
          Updating marketplace results...
        </div>
      )}

      {isShowingStaleResults && (
        <div className="marketplace-status warning">
          Showing last loaded accounts until this filter loads.
        </div>
      )}

      {isInitialLoading ? (
        <div className="account-grid">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : accounts.length ? (
        <div className="account-grid">
          {accounts.map((account) => (
            <AccountCard key={account._id} account={account} />
          ))}
        </div>
      ) : isError ? (
        <EmptyState
          title="Could not load marketplace"
          text="Please retry. Existing accounts are not treated as empty when the API fails."
        >
          <button
            className="button small"
            type="button"
            onClick={() => setRetryCount((count) => count + 1)}
          >
            Retry
          </button>
        </EmptyState>
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
