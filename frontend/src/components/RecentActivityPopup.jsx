import React from "react";
import { useEffect, useState } from "react";
import { demoActivities } from "../data/demoActivities";

const activityIcons = {
  new_account: "+",
  purchase: "OK",
  new_listing: "!",
  popular: "*",
};

const RecentActivityPopup = () => {
  const [activity, setActivity] = useState(null);
  const [lastIndex, setLastIndex] = useState(-1);
  const [leaving, setLeaving] = useState(false);

  const dismiss = () => setLeaving(true);

  useEffect(() => {
    let hideTimer;
    let showTimer;

    if (activity && !leaving) {
      hideTimer = window.setTimeout(dismiss, 5000);
    } else if (activity && leaving) {
      hideTimer = window.setTimeout(() => {
        setActivity(null);
        setLeaving(false);
      }, 280);
    } else {
      showTimer = window.setTimeout(
        () => {
          let nextIndex = Math.floor(Math.random() * demoActivities.length);
          if (demoActivities.length > 1 && nextIndex === lastIndex) {
            nextIndex = (nextIndex + 1) % demoActivities.length;
          }
          setLastIndex(nextIndex);
          setActivity(demoActivities[nextIndex]);
        },
        lastIndex === -1 ? 1500 : 14000,
      );
    }

    return () => {
      window.clearTimeout(hideTimer);
      window.clearTimeout(showTimer);
    };
  }, [activity, lastIndex, leaving]);

  if (!activity) return null;

  return (
    <aside
      className={`activity-popup${leaving ? " leaving" : ""}`}
      role="status"
      aria-live="polite"
    >
      <div className="activity-icon" aria-hidden="true">
        {activityIcons[activity.type] || "+"}
      </div>
      <div className="activity-copy">
        <strong>{activity.title}</strong>
        <span>{activity.description}</span>
        <small>{activity.location}</small>
      </div>
      <button
        className="activity-close"
        type="button"
        aria-label="Close recent activity"
        onClick={dismiss}
      >
        x
      </button>
    </aside>
  );
};

export default RecentActivityPopup;
