import { ADMIN_NAV_ROUTES, NURSE_NAV_ROUTES, PARENT_NAV_ROUTES, STUDENT_NAV_ROUTES, UserRole } from "../../Constant";

export const userouteForLabel = (label: string, userType: UserRole): string => {
  let ROUTES_SELECTED: {
    label: string;
    path: string;
  }[]
  ROUTES_SELECTED = getRouteCategory(userType);
  const match = ROUTES_SELECTED.find((r) => r.label === label);
  return match?.path ?? '/'; //Go back to GuestHomePage
}

export const getActiveItemFromPath = (pathname: string, userType: UserRole): string => {
  let ROUTES_SELECTED: {
    label: string;
    path: string;
  }[]
  ROUTES_SELECTED = getRouteCategory(userType);
  const sorted = [...ROUTES_SELECTED].sort((a, b) => b.path.length - a.path.length);
  const match = sorted.find((r) => pathname.startsWith(r.path));
  return match?.label ?? 'Home';
}

export const getRouteCategory = (userType: UserRole): any => {
  switch (userType) {
    case UserRole.Parent: return PARENT_NAV_ROUTES;
    case UserRole.Nurse: return NURSE_NAV_ROUTES;
    case UserRole.Student: return STUDENT_NAV_ROUTES;
    case UserRole.Admin: return ADMIN_NAV_ROUTES;
  }
}