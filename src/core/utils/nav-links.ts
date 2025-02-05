import { AuthState, NavLink } from "../types/auth-state.inteface";

export const getNavLinks = (authState: AuthState): NavLink[] => {
  if (authState.isAdmin) {
    return [{ href: "/dashboard", label: "Dashboard" }];
  }

  if (authState.isAmbulance) {
    return [
      { href: "/driver", label: "Driver" },
      { href: "/ambulance-profile", label: "Profile" },
    ];
  }

  if (authState.isUser) {
    return [
      { href: "/ambulance", label: "Ambulance" },
      { href: "/profile", label: "Profile" },
    ];
  }

  return [{ href: "/ambulance", label: "Ambulance" }];
};
