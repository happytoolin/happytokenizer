import React, { Component } from "react";
import type { ErrorInfo, ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  componentName?: string;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class VirtualErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error(`VirtualErrorBoundary (${this.props.componentName}):`, error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="bg-red-50 border border-red-200 p-6 m-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-4 h-4 bg-red-500 rounded-full flex-shrink-0" />
            <h3 className="font-mono text-sm font-semibold text-red-800 uppercase tracking-[0.05em]">
              Rendering Error
            </h3>
          </div>
          <p className="font-mono text-xs text-red-600 mb-2">
            {this.props.componentName
              ? `Failed to render ${this.props.componentName}`
              : "Component failed to render"
            }
          </p>
          {process.env.NODE_ENV === "development" && this.state.error && (
            <details className="mt-3">
              <summary className="font-mono text-xs text-red-500 cursor-pointer hover:text-red-700">
                Error Details
              </summary>
              <pre className="mt-2 p-3 bg-red-100 border border-red-200 rounded font-mono text-xs text-red-800 overflow-auto">
                {this.state.error.message}
              </pre>
            </details>
          )}
          <button
            onClick={() => this.setState({ hasError: false, error: undefined })}
            className="mt-4 bg-brand-orange text-brand-black border border-brand-black px-3 py-2 font-mono text-xs font-bold uppercase cursor-pointer transition-all duration-100 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-hard active:translate-x-0 active:translate-y-0 active:shadow-none"
          >
            Retry
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

// Convenience wrapper for specific components
export function withVirtualErrorBoundary<T extends object>(
  Component: React.ComponentType<T>,
  componentName?: string,
) {
  return function WrappedComponent(props: T) {
    return (
      <VirtualErrorBoundary componentName={componentName || Component.name}>
        <Component {...props} />
      </VirtualErrorBoundary>
    );
  };
}