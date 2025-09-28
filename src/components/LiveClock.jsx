"use client";
import { useState, useEffect } from 'react';

export default function LiveClock() {
  const [time, setTime] = useState(new Date());
  // --- THIS IS THE FIX ---
  // We add a new state to track if the component has "mounted" on the client.
  const [isClient, setIsClient] = useState(false);
  // --- END OF FIX ---

  useEffect(() => {
    // This effect runs only once, right after the component mounts in the browser.
    // It sets our new state to true.
    setIsClient(true);

    const timerId = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => {
      clearInterval(timerId);
    };
  }, []);

  // If the component has not yet mounted on the client, we render null.
  // This guarantees that the server and the initial client render are identical (both are null).
  if (!isClient) {
    return null;
  }

  // Once mounted, we render the clock.
  const formattedTime = time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

  return (
    <div className="text-sm font-semibold text-gray-800 hidden md:block w-24 text-center">
      {formattedTime}
    </div>
  );
}