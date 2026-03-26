// Module-level Lenis store so any component can trigger smooth scroll
// without needing React context threading.

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let _lenis: any = null;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function setLenis(l: any) {
  _lenis = l;
}

export function scrollTo(
  target: HTMLElement | string,
  options?: { offset?: number }
) {
  if (_lenis) {
    _lenis.scrollTo(target, options);
  }
}
