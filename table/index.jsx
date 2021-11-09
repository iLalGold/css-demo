import React, { Component } from "react";
import { Table } from "antd";
import PropTypes from "prop-types";

class Index extends Component {
  constructor() {
    super();
    this.state = {
      crowedScrollTop: 0,
    };
    this.divRef = React.createRef();
  }

  componentDidMount() {
    this.init();
    this.addScrollEvent();
  }

  componentWillUnmount() {
    this.clear();
  }

  init = () => {
    const that = this;
    this.timeInterval = setInterval(() => {
      const dom = that.divRef.current.getElementsByClassName("ant-table-body")[0];
      const { crowedScrollTop } = that.state;
      that.setState(
        {
          crowedScrollTop: crowedScrollTop + 1,
        },
        () => {
          const { crowedScrollTop: newTop } = that.state;
          dom.scrollTop = newTop;
        }
      );
      if (Math.ceil(dom.scrollTop) >= dom.scrollHeight - dom.clientHeight) {
        dom.scrollTop = 0;
        that.setState({
          crowedScrollTop: 0,
        });
      }
    }, 100);
  };

  addScrollEvent = () => {
    const that = this;
    const dom = this.divRef.current.getElementsByClassName("ant-table-body")[0];
    dom.onmouseover = () => {
      that.clear();
    };
    dom.onmouseout = () => {
      that.init();
    };
    dom.onscroll = () => {
      if (dom) {
        that.setState({
          crowedScrollTop: dom.scrollTop,
        });
      }
    };
  };

  clear = () => {
    // eslint-disable-next-line no-unused-expressions
    this.timeInterval && clearInterval(this.timeInterval);
  };

  render() {
    const { divStyle } = this.props;
    return (
      <div style={divStyle} ref={this.divRef}>
        <Table {...this.props} />
      </div>
    );
  }
}

Index.propTypes = {
  dataSource: PropTypes.array,
  columns: PropTypes.array,
  scroll: PropTypes.object,
  divStyle: PropTypes.object,
  pagination: PropTypes.oneOfType([PropTypes.object, PropTypes.boolean]),
};

Index.defaultProps = {
  dataSource: [],
  columns: [],
  pagination: false,
  scroll: {},
  divStyle: {},
};

export default Index;
