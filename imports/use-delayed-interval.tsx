export {}
// import { DependencyList, useEffect, useRef, useState } from "react";
// import { useInterval } from "usehooks-ts";

// export function useDelayedInterval(callback: () => Promise<any>, delay: number = 1000, deps: DependencyList = []) {
//   const intervalReadyRef = useRef(true);
//   const timeoutRef = useRef<any>();
//   useEffect(() => {
//     const interval = setInterval(() => {
//       if (intervalReadyRef.current) {
//         intervalReadyRef.current = false;
//         callback().then(() => {
//           clearTimeout(timeoutRef.current);
//           timeoutRef.current = setTimeout(() => {
//             intervalReadyRef.current = true;
//           }, delay);
//         }, () => {
//           clearTimeout(timeoutRef.current);
//           timeoutRef.current = setTimeout(() => {
//             intervalReadyRef.current = true;
//           }, delay);
//         });
//       }
//     }, delay);
//     return () => {
//       clearTimeout(timeoutRef.current);
//       clearInterval(interval);
//     };
//   }, deps);
// }

// export function useDelayRefetch(query, variables, delay: number = 1000) {
//   const useDelayedIntervalRef = useRef<any>();
//   const qRef = useRef<any>();
//   qRef.current = query;
//   useDelayedIntervalRef.current = variables;
//   const [results, setResults] = useState<any>();
//   useDelayedInterval(() => new Promise((res) => {
//     qRef.current.refetch(useDelayedIntervalRef.current.variables).then((r) => {
//       setResults(r);
//       res(undefined);
//     });
//   }));
//   return results;
// }