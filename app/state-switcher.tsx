"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { mapRegions, states, type StateId } from "./lib/map-regions";

/**
 * A single dropdown trigger instead of one pill per state. A flat row of
 * state links (tried first) is bounded by how many states exist times how
 * many pills each one's region-tab row already needs — it already overflowed
 * the mobile header at two states and four California regions. A dropdown
 * costs exactly one pill's width no matter how many states get added later;
 * the growing part (regions) stays in the tab row this replaces nothing of.
 */
export default function StateSwitcher({ activeState }: { activeState?: StateId }) {
  const [open, setOpen] = useState(false);
  // Fixed positioning, computed from the trigger's own rect, rather than a
  // CSS-absolute menu anchored inside <nav>: the mobile header makes <nav>
  // a horizontally scrollable, overflow-clipped strip (see globals.css), and
  // an absolutely positioned child of an overflow:auto ancestor gets clipped
  // by it in every browser tested here. Fixed positioning escapes that
  // entirely, so the menu is never silently invisible on a phone.
  const [menuPos, setMenuPos] = useState<{ top: number; right: number } | null>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onPointerDown(event: PointerEvent) {
      const target = event.target as Node;
      if (triggerRef.current?.contains(target) || menuRef.current?.contains(target)) return;
      setOpen(false);
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  function toggle() {
    if (!open && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setMenuPos({ top: rect.bottom + 8, right: Math.max(8, window.innerWidth - rect.right) });
    }
    setOpen(value => !value);
  }

  const stateEntries = Object.entries(states) as [StateId, typeof states[StateId]][];
  const current = activeState ? states[activeState].name : "States";

  return (
    <div className="state-switcher">
      <button ref={triggerRef} type="button" className="region state-switcher-trigger" aria-haspopup="true" aria-expanded={open}
              onClick={toggle}>
        {current} <span aria-hidden="true">⌄</span>
      </button>
      {open && menuPos && (
        <div className="state-switcher-menu" role="menu" ref={menuRef} style={{ top: menuPos.top, right: menuPos.right }}>
          {stateEntries.map(([id, state]) => (
            <Link key={id} href={mapRegions[state.defaultRegion].href} role="menuitem" onClick={() => setOpen(false)}
                  aria-current={activeState === id ? "page" : undefined}>{state.name}</Link>
          ))}
        </div>
      )}
    </div>
  );
}
