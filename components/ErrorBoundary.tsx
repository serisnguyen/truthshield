
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertOctagon, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
          <div className="max-w-md bg-white p-8 rounded-3xl shadow-xl text-center border border-slate-200">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertOctagon size={40} className="text-red-600" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 mb-2">
              Có lỗi xảy ra
            </h1>
            <p className="text-slate-500 mb-6">
              Ứng dụng gặp sự cố không mong muốn. Vui lòng thử lại.
            </p>
            {this.state.error && (
              <details className="text-left bg-slate-50 p-4 rounded-xl mb-6 text-xs text-slate-600 border border-slate-200">
                <summary className="cursor-pointer font-bold mb-2 text-slate-800">Chi tiết kỹ thuật</summary>
                <pre className="overflow-auto whitespace-pre-wrap font-mono">{this.state.error.toString()}</pre>
              </details>
            )}
            <button
              onClick={this.handleReset}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all active:scale-95"
            >
              <RefreshCw size={20} /> Tải lại ứng dụng
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
