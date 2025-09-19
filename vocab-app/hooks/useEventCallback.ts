import { useCallback, useRef } from "react";
import useIsomorphicLayoutEffect from "./useIsomorphicLayoutEffect";
/**
 * Hook to create a stable event callback that does not change on every render.
 * This is useful for performance optimization in event handlers.
 *
 * @param fn - The function to be called on event.
 * @returns A stable callback function that can be used as an event handler.
 */
export function useEventCallback<Args extends unknown[], Return>(
  fn: (...args: Args) => Return
): (...args: Args) => Return {
  const ref = useRef(fn);
  useIsomorphicLayoutEffect(() => {
    ref.current = fn;
  });
  return useCallback(
    (...args: Args) =>
      // @ts-expect-error hide `this`
      // tslint:disable-next-line:ban-comma-operator
      (0, ref.current!)(...args),
    []
  );
}
