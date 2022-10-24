import React from 'react';

export default class ErrorBoundary extends React.Component<any, any> {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // 这里可以上报错误日志
    // console.log('ERROR:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <h1 style={{ textAlign: 'center', paddingTop: 100 }}>哦！糟糕，出了点问题，刷新试一下呢？</h1>;
    }
    return this.props.children;
  }
}
