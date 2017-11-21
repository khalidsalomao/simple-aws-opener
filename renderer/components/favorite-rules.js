import React from 'react';
// import PropTypes from 'prop-types';
import { observer } from 'mobx-react';

import AppStore from '../store/app-store';

@observer
class FavoriteRules extends React.Component {
  render() {
    return (
      <div className="terminal">
        <pre>
          { JSON.stringify(AppStore.favorites) }
        </pre>

        <style jsx>{`
          pre {
            flex:1;
          }

          .terminal {
            display: flex;
            height: 100%;
          }
        `}
        </style>
      </div>
    );
  }
}

// FavoriteRules.propTypes = {
//   content: PropTypes.string
// };

// FavoriteRules.defaultProps = {
//   content: ''
// };

export default FavoriteRules;
