import React, { useEffect, useRef, useState } from "react";
import axios from "axios";

function Notification() {
  const [notifications, setNotifications] = useState([]);
  const socketRef = useRef(null);
  const reconnectRef = useRef({ attempts: 0, timeoutId: null });

  // Helper to build the correct ws/wss URL depending on the page protocol/host
  const buildSocketUrl = () => {
    // Use same host as front-end, but default to localhost:8000 for dev
    const host = window.location.hostname || "localhost";
    const port = 8000;
    const protocol = window.location.protocol === "https:" ? "wss" : "ws";
    return `${protocol}://${host}:${port}/ws/notifications/`;
  };

  useEffect(() => {
    // Load initial notifications via REST
    let ignored = false;
    axios
      .get("http://127.0.0.1:8000/api/notifications/")
      .then((res) => {
        if (!ignored) setNotifications(res.data);
      })
      .catch((err) => console.error("Failed to fetch notifications", err));
    return () => {
      ignored = true;
    };
  }, []);

  useEffect(() => {
    // Create socket and handlers (single effect)
    const connect = () => {
      const url = buildSocketUrl();
      console.log("Attempting WS connect to", url);
      const ws = new WebSocket(url);
      socketRef.current = ws;

      ws.onopen = () => {
        console.log("WebSocket Connected ✅");
        // reset reconnect attempts on successful connect
        reconnectRef.current.attempts = 0;
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log("Realtime Data:", data);
          setNotifications((prev) => [data, ...prev]);
        } catch (e) {
          console.error("Invalid JSON from socket", e, event.data);
        }
      };

      ws.onerror = (err) => {
        console.error("WebSocket Error ❌", err);
      };

      ws.onclose = (event) => {
        console.warn("WebSocket closed", event);
        // Attempt simple reconnect with exponential backoff (cap at 30s)
        if (!event.wasClean) {
          const attempts = ++reconnectRef.current.attempts;
          const backoff = Math.min(30000, 1000 * 2 ** (attempts - 1));
          console.log(`Reconnecting in ${backoff}ms (attempt ${attempts})`);
          reconnectRef.current.timeoutId = window.setTimeout(() => {
            connect();
          }, backoff);
        }
      };
    };

    connect();

    // Cleanup on unmount: close socket and clear reconnect timers
    return () => {
      if (reconnectRef.current.timeoutId) {
        clearTimeout(reconnectRef.current.timeoutId);
      }
      const s = socketRef.current;
      if (s && (s.readyState === WebSocket.OPEN || s.readyState === WebSocket.CONNECTING)) {
        try {
          s.close();
        } catch (e) {
          /* ignore */
        }
      }
      socketRef.current = null;
    };
  }, []); // run once on mount

  return (
    <div>
      <h2>Notifications</h2>
      {notifications.map((n, i) => (
        <div key={i}>
          <strong>{n.title}</strong>
          <p>{n.message}</p>
        </div>
      ))}
    </div>
  );
}

export default Notification;