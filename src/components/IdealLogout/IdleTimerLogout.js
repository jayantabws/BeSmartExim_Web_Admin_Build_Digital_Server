import { useEffect, useRef } from "react";

const IdleTimerLogout = ({ onLogout }) => {
  const logoutTimer = useRef(null);

  const resetTimer = () => {
    if (logoutTimer.current) {
      clearTimeout(logoutTimer.current);
    }

    logoutTimer.current = setTimeout(() => {
      onLogout(); // 🔥 call parent logout
    }, 10 * 60 * 1000); // 10 minutes
  };

  useEffect(() => {
    const events = ["mousemove", "keydown", "click", "scroll"];

    // Start timer
    resetTimer();

    // Add listeners
    events.forEach(event =>
      window.addEventListener(event, resetTimer)
    );

    // Cleanup
    return () => {
      if (logoutTimer.current) {
        clearTimeout(logoutTimer.current);
      }

      events.forEach(event =>
        window.removeEventListener(event, resetTimer)
      );
    };
  }, []);

  return null; // no UI
};

export default IdleTimerLogout;