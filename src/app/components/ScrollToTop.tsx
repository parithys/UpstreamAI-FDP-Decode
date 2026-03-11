import { useEffect } from 'react';
import { useLocation } from 'react-router';

/**
 * ScrollToTop Component
 * 
 * Automatically scrolls to the top of the page (scrollY = 0) whenever the route changes.
 * This ensures all navigation actions (clicks, keyboard navigation, programmatic routing)
 * render the destination page at the top.
 * 
 * Exclusions (will NOT scroll to top):
 * - Hash navigation within the same page (#anchor)
 * - Modals, drawers, tooltips (not route changes)
 * - Tab switches within the same route
 */
export function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    // Only scroll to top if there's no hash anchor
    // Hash anchors should navigate to specific sections
    if (!hash) {
      window.scrollTo(0, 0);
    }
  }, [pathname, hash]);

  return null;
}