import { AuthState, NavLink } from "../types/auth-state.inteface";

export const getNavLinks = (authState: AuthState): NavLink[] => {
  if (authState.isAdmin) {
    return [{ href: "/dashboard", label: "Dashboard" }];
  }

  if (authState.isAmbulance) {
    return [
      { href: "/driver", label: "Driver" },
      { href: "/ambulance-profile", label: "Profile" },
      { href: "/ambulance-requests", label: "Requests" },
    ];
  }

  if (authState.isUser) {
    return [
      { href: "/ambulance", label: "Ambulance" },
      { href: "/profile", label: "Profile" },
      { href: "/my-requests", label: "MyRequests" },
    ];
  }

  return [{ href: "/ambulance", label: "Ambulance" }];
};
