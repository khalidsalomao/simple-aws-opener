import React from 'react';
import PropTypes from 'prop-types';

import { observer } from 'mobx-react';

@observer
class Terminal extends React.Component {
  render() {
    return (
      <div className="terminal">
        <pre>
          { this.props.content }
        </pre>

        <style jsx>{`
          pre {
            flex:1;
            min-height: 60px;
          }

          .terminal {
            display: flex;
          }
        `}
        </style>
      </div>
    );
  }
}

Terminal.propTypes = {
  content: PropTypes.string
};

Terminal.defaultProps = {
  content: ''
};

export default Terminal;
