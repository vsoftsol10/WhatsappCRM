import React from "react";

// Catches JavaScript errors thrown while rendering, in lifecycle
// methods, and in constructors of the component tree below it.
// Without this, any uncaught render error takes the entire app down
// to a blank white screen with nothing but a console error.
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Uncaught error in component tree:", error, errorInfo);
  }

  handleReload = () => {
    window.location.href = "/dashboard";
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen gap-4 bg-gray-50 px-4 text-center">
          <h1 className="text-xl font-semibold text-gray-800">
            Something went wrong.
          </h1>
          <p className="text-gray-500 max-w-md">
            An unexpected error occurred. Try reloading the page — if it
            keeps happening, please contact support.
          </p>
          <button
            onClick={this.handleReload}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Back to Dashboard
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;