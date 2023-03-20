import mixpanel from 'mixpanel-browser';
import React from 'react';
import { MIXPANEL_EVENT } from 'types/utils';

class ErrorBoundary extends React.Component {
  constructor(props: any) {
    super(props);

    // Define a state variable to track whether is an error or not
    this.state = { hasError: false, error: undefined };
  }
  static getDerivedStateFromError(error: any) {
    // Update state so the next render will show the fallback UI

    return { hasError: true, error };
  }
  componentDidCatch(error: any, errorInfo: any) {
    // You can use your own error logging service here
    console.log({ error, errorInfo });
    mixpanel.track(MIXPANEL_EVENT.CRASH);
  }
  render() {
    if ((this.state as any).hasError) {
      return (
        <div>
          <h2>{'Oops, there is an error, and it should not happened, we will looking into it!'}</h2>
          <code>{(this.state as any).error.message}</code>
        </div>
      );
    }

    // no error

    return (this.props as any).children;
  }
}

export default ErrorBoundary;
