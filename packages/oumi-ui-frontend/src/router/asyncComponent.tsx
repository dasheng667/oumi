import React from 'react';

function asyncComponent(getComponent: any) {
  return class AsyncComponent extends React.Component {
    static Component = null;

    state = { Component: AsyncComponent.Component };

    componentDidMount() {
      if (!this.state.Component) {
        getComponent().then(({ default: Component }: any) => {
          AsyncComponent.Component = Component;
          this.setState({ Component });
        });
      }
    }

    render() {
      const { Component }: any = this.state;
      if (Component) {
        return <Component {...this.props} />;
      }
      return <div style={{ padding: 20 }}>页面加载中...</div>;
    }
  };
}

export default asyncComponent;
