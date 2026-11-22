import { Component } from "react";
import { AlertCircle } from "lucide-react";
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
        <main className="flex min-h-screen items-center justify-center px-6">
          <div className="relative mx-auto max-w-md rounded-3xl border border-[var(--border-subtle)] bg-[var(--surface)] p-8 shadow-[var(--shadow-lg)] sm:p-10">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--danger-soft)] text-[var(--danger)] mb-4">
              <AlertCircle size={22} strokeWidth={2} />
            </div>
            <h1 className="text-xl font-semibold tracking-tight text-[var(--text-primary)]">
              This page could not load
            </h1>
            <p className="mt-2 text-sm leading-6 text-[var(--text-muted)]">
              FinSight encountered an unexpected error. Reload the page to try
              again.
            </p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-6 rounded-xl bg-[var(--accent)] px-4 py-2.5 text-sm font-semibold text-[var(--text-inverse)] shadow-[var(--shadow-sm)] transition-all hover:bg-[var(--accent-strong)] hover:shadow-[var(--shadow-md)]"
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
