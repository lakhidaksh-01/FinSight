/*
 * useAuth
 * -------
 * The single way pages and components reach the session.
 *
 *   const { user, loading, login, logout } = useAuth();
 *
 * It returns the value published by context/AuthProvider and fails loudly
 * instead of silently returning undefined when a component is rendered
 * outside of the provider.
 */

import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside <AuthProvider>");
  }

  return context;
}

export default useAuth;