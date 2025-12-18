import { Component, type ErrorInfo, type ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  componentName?: string;
}

interface State {
  hasError: boolean;
}

export class VirtualErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error(
      `VirtualErrorBoundary (${this.props.componentName}):`,
      error,
      errorInfo,
    );
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="bg-red-50 border border-red-200 p-4 m-4">
          <p className="font-mono text-sm text-red-600">
            {this.props.componentName
              ? `${this.props.componentName} failed to render`
              : "Component failed to render"}
          </p>
          <button
            onClick={() => this.setState({ hasError: false })}
            className="mt-2 bg-brand-orange text-brand-black border border-brand-black px-3 py-2 font-mono text-xs font-bold uppercase cursor-pointer"
          >
            Retry
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
