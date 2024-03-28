import React, { ErrorInfo, PropsWithChildren } from "react";

type AuthErrorBoundaryProps = PropsWithChildren<{
  onError?: (error: Error) => void;
}>;

type ErrorBoundaryState = { hasError: boolean };

const initialState: ErrorBoundaryState = {
  hasError: false,
};

class AuthErrorBoundary extends React.Component<
  AuthErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: AuthErrorBoundaryProps) {
    super(props);
    this.state = initialState;
  }

  static getDerivedStateFromError(error: Error) {
    console.error("getDerivedStateFromError", error);
    // Update state so the next render will show the fallback UI.
    return { hasError: false };
  }

  componentDidCatch(error: Error, _info: ErrorInfo) {
    this.props.onError?.(error);
  }

  render() {
    return this.props.children;
  }
}

export default AuthErrorBoundary;
