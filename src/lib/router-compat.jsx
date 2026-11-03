// Small adapter so the original pages (written for react-router) run on TanStack Router.
import { useEffect, useMemo, forwardRef } from "react";
import {
  Link as TLink,
  Outlet,
  useNavigate as useTNavigate,
  useLocation as useTLocation,
  useParams as useTParams,
  useRouter,
} from "@tanstack/react-router";

export { Outlet };

function splitTo(to) {
  if (typeof to !== "string") return { to: to?.pathname || "/", search: to?.search, hash: to?.hash };
  const [beforeHash, hash] = to.split("#");
  const [path, qs] = beforeHash.split("?");
  const search = qs ? Object.fromEntries(new URLSearchParams(qs)) : undefined;
  return { to: path || ".", search, hash };
}

export const Link = forwardRef(function Link({ to, replace, state, ...rest }, ref) {
  if (typeof to === "string" && /^(https?:|mailto:|tel:)/.test(to)) {
    return <a ref={ref} href={to} {...rest} />;
  }
  const t = splitTo(to);
  return <TLink ref={ref} to={t.to} search={t.search} hash={t.hash} replace={replace} {...rest} />;
});

export const NavLink = forwardRef(function NavLink({ to, end, className, style, children, ...rest }, ref) {
  const loc = useTLocation();
  const path = typeof to === "string" ? to.split("?")[0] : to?.pathname || "/";
  const isActive = end || path === "/" ? loc.pathname === path || loc.pathname === path + "/" : loc.pathname === path || loc.pathname.startsWith(path + "/");
  const cls = typeof className === "function" ? className({ isActive }) : className;
  const st = typeof style === "function" ? style({ isActive }) : style;
  const kids = typeof children === "function" ? children({ isActive }) : children;
  return (
    <Link ref={ref} to={to} className={cls} style={st} aria-current={isActive ? "page" : undefined} {...rest}>
      {kids}
    </Link>
  );
});

export function useNavigate() {
  const navigate = useTNavigate();
  const router = useRouter();
  return (to, opts = {}) => {
    if (typeof to === "number") {
      router.history.go(to);
      return;
    }
    const t = splitTo(to);
    navigate({ to: t.to, search: t.search, hash: t.hash, replace: !!opts.replace });
  };
}

export function Navigate({ to, replace }) {
  const navigate = useNavigate();
  useEffect(() => {
    navigate(to, { replace });
  }, [to]);
  return null;
}

export function useLocation() {
  const loc = useTLocation();
  return useMemo(
    () => ({
      pathname: loc.pathname,
      search: loc.searchStr || "",
      hash: loc.hash ? `#${loc.hash}` : "",
      state: loc.state,
      key: loc.href,
    }),
    [loc.href, loc.state],
  );
}

export function useParams() {
  return useTParams({ strict: false });
}

export function useSearchParams() {
  const loc = useTLocation();
  const navigate = useTNavigate();
  const params = useMemo(() => new URLSearchParams(loc.searchStr || ""), [loc.searchStr]);
  const set = (next, opts = {}) => {
    const p = typeof next === "function" ? next(params) : next;
    const obj = Object.fromEntries(new URLSearchParams(p));
    navigate({ to: loc.pathname, search: obj, replace: !!opts.replace });
  };
  return [params, set];
}
