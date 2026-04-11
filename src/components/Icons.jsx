// SVG Icon Library — Lucide/Feather style, stroke-based, 24x24 viewBox

const I = ({ children, size = 24, color = "currentColor", style = {}, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
    style={{ flexShrink: 0, ...style }} {...props}>
    {children}
  </svg>
);

export function IconHome(p) {
  return <I {...p}><path d="M3 9.5L12 3l9 6.5V20a2 2 0 01-2 2H5a2 2 0 01-2-2V9.5z" /><polyline points="9,22 9,12 15,12 15,22" /></I>;
}

export function IconList(p) {
  return <I {...p}><line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" /><circle cx="3.5" cy="6" r="1" fill="currentColor" stroke="none" /><circle cx="3.5" cy="12" r="1" fill="currentColor" stroke="none" /><circle cx="3.5" cy="18" r="1" fill="currentColor" stroke="none" /></I>;
}

export function IconChart(p) {
  return <I {...p}><rect x="3" y="12" width="4" height="9" rx="1" /><rect x="10" y="8" width="4" height="13" rx="1" /><rect x="17" y="3" width="4" height="18" rx="1" /></I>;
}

export function IconSettings(p) {
  return <I {...p}><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 01-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" /></I>;
}

export function IconPlus(p) {
  return <I {...p}><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></I>;
}

export function IconX(p) {
  return <I {...p}><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></I>;
}

export function IconEdit(p) {
  return <I {...p}><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" /></I>;
}

export function IconTrash(p) {
  return <I {...p}><polyline points="3,6 5,6 21,6" /><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" /><line x1="10" y1="11" x2="10" y2="17" /><line x1="14" y1="11" x2="14" y2="17" /></I>;
}

export function IconWallet(p) {
  return <I {...p}><rect x="2" y="6" width="20" height="14" rx="2" /><path d="M2 10h20" /><circle cx="17" cy="14" r="1.5" fill="currentColor" stroke="none" /></I>;
}

export function IconBell(p) {
  return <I {...p}><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 01-3.46 0" /></I>;
}

export function IconChevronLeft(p) {
  return <I {...p}><polyline points="15,18 9,12 15,6" /></I>;
}

export function IconChevronRight(p) {
  return <I {...p}><polyline points="9,6 15,12 9,18" /></I>;
}

export function IconCalendar(p) {
  return <I {...p}><rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></I>;
}

export function IconGlobe(p) {
  return <I {...p}><circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" /></I>;
}

export function IconMoon(p) {
  return <I {...p}><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" /></I>;
}

export function IconSun(p) {
  return <I {...p}><circle cx="12" cy="12" r="5" /><line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" /><line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" /><line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" /><line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" /></I>;
}

export function IconArrowUp(p) {
  return <I {...p}><line x1="12" y1="19" x2="12" y2="5" /><polyline points="5,12 12,5 19,12" /></I>;
}

export function IconArrowDown(p) {
  return <I {...p}><line x1="12" y1="5" x2="12" y2="19" /><polyline points="19,12 12,19 5,12" /></I>;
}

export function IconBook(p) {
  return <I {...p}><path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2V3z" /><path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7V3z" /></I>;
}

export function IconCoin(p) {
  return <I {...p}><circle cx="12" cy="12" r="9" /><path d="M14.5 9.5c-.5-1-1.5-1.5-2.5-1.5-1.66 0-3 1-3 2.5S10.34 13 12 13c1.66 0 3 1 3 2.5S13.66 18 12 18c-1 0-2-.5-2.5-1.5" /><line x1="12" y1="6" x2="12" y2="8" /><line x1="12" y1="16" x2="12" y2="18" /></I>;
}

export function IconLock(p) {
  return <I {...p}><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0110 0v4" /></I>;
}

export function IconShield(p) {
  return <I {...p}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></I>;
}

export function IconDownload(p) {
  return <I {...p}><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" /><polyline points="7,10 12,15 17,10" /><line x1="12" y1="15" x2="12" y2="3" /></I>;
}

export function IconUpload(p) {
  return <I {...p}><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" /><polyline points="17,8 12,3 7,8" /><line x1="12" y1="3" x2="12" y2="15" /></I>;
}
