import { useEffect, useRef } from "react";
import { useInterval } from "usehooks-ts";

export function useDelayedInterval(callback: () => Promise<any>, delay: number = 1000) {
  const intervalReadyRef = useRef(true);
  useEffect(() => {
    let timeout;
    const interval = setInterval(() => {
      if (intervalReadyRef.current) {
        intervalReadyRef.current = false;
        callback().then(() => {
          clearTimeout(timeout);
          timeout = setTimeout(() => {
            intervalReadyRef.current = true;
          }, delay);
        }, () => {
          clearTimeout(timeout);
          timeout = setTimeout(() => {
            intervalReadyRef.current = true;
          }, delay);
        });
      }
    }, delay);
    return () => {
      clearTimeout(timeout);
      clearInterval(interval);
    };
  }, []);
}