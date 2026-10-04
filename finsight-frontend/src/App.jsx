import { Component } from "react";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "sonner";
import { AuthProvider } from "./context/AuthContext";
import AppRoutes from "./routes/AppRoutes";

class AppErrorBoundary extends Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <main className="flex min-h-screen items-center justify-center bg-[#0c1210] px-6 text-[#f1f5f2]">
          <div className="max-w-md text-center">
            <h1 className="text-2xl font-semibold">This page could not load</h1>
            <p className="mt-3 text-sm leading-6 text-[#a6b2aa]">
              FinSight encountered an unexpected error. Reload the page to try again.
            </p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-6 rounded-lg bg-[#9bd3a9] px-4 py-2.5 text-sm font-semibold text-[#132119]"
            >
              Reload page
            </button>
          </div>
        </main>
      );
    }

    return this.props.children;
  }
}

export default function App() {
  return <AuthProvider>
    <BrowserRouter>
      <AppErrorBoundary>
        <AppRoutes />
      </AppErrorBoundary>
      <Toaster position="top-right" theme="dark" richColors closeButton />
    </BrowserRouter>
  </AuthProvider>;
}
