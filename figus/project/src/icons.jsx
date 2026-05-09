// Icons — single-stroke 24x24, currentColor.
const Icon = {
  home:   (p) => <svg viewBox="0 0 24 24" fill="none" {...p}><path d="M4 11l8-7 8 7v9a1 1 0 01-1 1h-4v-6h-6v6H5a1 1 0 01-1-1z" stroke="currentColor" strokeWidth="2.2" strokeLinejoin="round"/></svg>,
  album:  (p) => <svg viewBox="0 0 24 24" fill="none" {...p}><rect x="3.5" y="4" width="17" height="16" rx="1.5" stroke="currentColor" strokeWidth="2.2"/><path d="M3.5 9h17M9 4v16" stroke="currentColor" strokeWidth="2.2"/></svg>,
  swap:   (p) => <svg viewBox="0 0 24 24" fill="none" {...p}><path d="M5 9h14l-3-3M19 15H5l3 3" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  group:  (p) => <svg viewBox="0 0 24 24" fill="none" {...p}><circle cx="9" cy="8" r="3.2" stroke="currentColor" strokeWidth="2.2"/><circle cx="17" cy="10" r="2.4" stroke="currentColor" strokeWidth="2.2"/><path d="M3 19c.8-2.6 3-4.5 6-4.5s5.2 1.9 6 4.5M15 19c.5-1.8 1.8-3 4-3s3.5 1.2 4 3" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"/></svg>,
  bell:   (p) => <svg viewBox="0 0 24 24" fill="none" {...p}><path d="M6 17h12l-1.5-2v-4a4.5 4.5 0 10-9 0v4z" stroke="currentColor" strokeWidth="2.2" strokeLinejoin="round"/><path d="M10 20h4" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"/></svg>,
  plus:   (p) => <svg viewBox="0 0 24 24" fill="none" {...p}><path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round"/></svg>,
  close:  (p) => <svg viewBox="0 0 24 24" fill="none" {...p}><path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"/></svg>,
  check:  (p) => <svg viewBox="0 0 24 24" fill="none" {...p}><path d="M5 12.5l4.5 4.5L19 7" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  back:   (p) => <svg viewBox="0 0 24 24" fill="none" {...p}><path d="M15 6l-7 6 7 6" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  filter: (p) => <svg viewBox="0 0 24 24" fill="none" {...p}><path d="M3 6h18M6 12h12M10 18h4" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"/></svg>,
  spark:  (p) => <svg viewBox="0 0 24 24" fill="currentColor" {...p}><path d="M12 2l1.6 5.4L19 9l-5.4 1.6L12 16l-1.6-5.4L5 9l5.4-1.6z"/></svg>,
  flame:  (p) => <svg viewBox="0 0 24 24" fill="currentColor" {...p}><path d="M12 2c1 4 5 5 5 10a5 5 0 11-10 0c0-2 1-3 2-4-.2 2 .8 3 2 3 .5-3-1-4 1-9z"/></svg>,
  bolt:   (p) => <svg viewBox="0 0 24 24" fill="currentColor" {...p}><path d="M13 2L4 14h6l-1 8 9-12h-6z"/></svg>,
  search: (p) => <svg viewBox="0 0 24 24" fill="none" {...p}><circle cx="11" cy="11" r="6" stroke="currentColor" strokeWidth="2.2"/><path d="M16 16l4 4" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"/></svg>,
  minus:  (p) => <svg viewBox="0 0 24 24" fill="none" {...p}><path d="M5 12h14" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round"/></svg>,
  target: (p) => <svg viewBox="0 0 24 24" fill="none" {...p}><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2.2"/><circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="2.2"/><circle cx="12" cy="12" r="1.6" fill="currentColor"/></svg>,
  trophy: (p) => <svg viewBox="0 0 24 24" fill="none" {...p}><path d="M7 4h10v5a5 5 0 01-10 0z" stroke="currentColor" strokeWidth="2.2" strokeLinejoin="round"/><path d="M7 6H4v2a3 3 0 003 3M17 6h3v2a3 3 0 01-3 3M9 18h6v3H9z" stroke="currentColor" strokeWidth="2.2" strokeLinejoin="round"/><path d="M10 13v5h4v-5" stroke="currentColor" strokeWidth="2.2" strokeLinejoin="round"/></svg>,
};
window.Icon = Icon;
