import { useCallback, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const ADMIN_PATH = '/admin';
const TAP_COUNT = 5;
const TAP_WINDOW_MS = 3000;
const LONG_PRESS_MS = 2000;
const MOVE_TOLERANCE_PX = 10;

// Kept outside React: the first click navigates home, and every page renders its own
// navbar, so a per-component ref would reset mid-sequence when starting from /loads or /drivers.
let clickTimes = [];

// After a long-press navigates away, the finger is still down. Releasing it fires a click on
// whatever is now under it (e.g. the dashboard's own home link), so swallow that one click.
// The guard is dropped shortly after the finger lifts in case the browser sends no click.
function swallowReleaseClick() {
  const swallow = (e) => {
    e.preventDefault();
    e.stopPropagation();
    cleanup();
  };
  const onRelease = () => setTimeout(cleanup, 500);
  const cleanup = () => {
    window.removeEventListener('click', swallow, true);
    window.removeEventListener('pointerup', onRelease, true);
    window.removeEventListener('pointercancel', onRelease, true);
  };
  window.addEventListener('click', swallow, true);
  window.addEventListener('pointerup', onRelease, true);
  window.addEventListener('pointercancel', onRelease, true);
}

/**
 * Hidden entrance to the admin dashboard, attached to the navbar logo:
 *  - 5 clicks within 3 seconds, or
 *  - a ~2 second long-press on touch screens.
 * Ordinary clicks keep their normal behaviour (the logo links home).
 * Returns props to spread onto the logo link.
 */
export default function useAdminShortcut() {
  const navigate = useNavigate();
  const press = useRef(null); // { timer, x, y }

  const cancelPress = useCallback(() => {
    if (press.current) clearTimeout(press.current.timer);
    press.current = null;
  }, []);

  useEffect(() => cancelPress, [cancelPress]);

  const goAdmin = useCallback(() => {
    clickTimes = [];
    navigate(ADMIN_PATH);
  }, [navigate]);

  const onClick = (e) => {
    const now = Date.now();
    clickTimes = [...clickTimes.filter((t) => now - t < TAP_WINDOW_MS), now];
    if (clickTimes.length >= TAP_COUNT) {
      e.preventDefault();
      goAdmin();
    }
  };

  const onPointerDown = (e) => {
    if (e.pointerType === 'mouse') return;
    cancelPress();
    press.current = {
      x: e.clientX,
      y: e.clientY,
      timer: setTimeout(() => {
        press.current = null;
        swallowReleaseClick();
        goAdmin();
      }, LONG_PRESS_MS),
    };
  };

  const onPointerMove = (e) => {
    const p = press.current;
    if (p && Math.hypot(e.clientX - p.x, e.clientY - p.y) > MOVE_TOLERANCE_PX) cancelPress(); // user is scrolling
  };

  return {
    onClick,
    onPointerDown,
    onPointerMove,
    onPointerUp: cancelPress,
    onPointerCancel: cancelPress,
    // Stop the browser's long-press link menu / preview from interrupting the gesture.
    onContextMenu: (e) => press.current && e.preventDefault(),
    style: { WebkitTouchCallout: 'none' },
  };
}
