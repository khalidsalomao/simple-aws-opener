import React from 'react';
import Button from 'material-ui/Button';

import Layout from '../components/layout';
import Terminal from '../components/terminal';
import runner from '../common/runner';
import FavoriteRules from '../components/favorite-rules';
import logger from '../common/logger';

import AppStore from '../store/app-store';

class Start extends React.Component {
  state = {
    content: '',
  };

  print(t, append) {
    logger.info(t);
    const text = (t && typeof t !== 'string') ? JSON.stringify(t) : (t || '');
    let content = this.state.content || '';
    content = append ?
      `${content.substr(0, 5000)}\n${new Date().toLocaleString()}\n${text}` :
      `${new Date().toLocaleString()}\n${text}`;
    this.setState({ content });
  }

  onClick = (e) => {
    runner.runCmd('aws', 'ec2 describe-security-groups --region sa-east-1 --group-id sg-d27a79b6', (t) => {
      this.print(t);
      const r = JSON.parse(t);
      this.print(r.SecurityGroups[0].IpPermissions.find(i => i.FromPort === 1433), true);
      const ips = r.SecurityGroups[0].IpPermissions.find(i => i.FromPort === 1433).IpRanges;
      this.print(ips.find(i => i.Description === 'khalid.salomao'), true);
      this.print(ips.find(i => i.CidrIp === '186.242.106.205/32'), true);
    });
  };

  onClick2 = (e) => {
    // logger.debug('click');
    AppStore.addFavorite({ id: `sg-${new Date().getTime()}`, name: 'db-production2' });
  };

  render() {
    return (
      <Layout>
        <div>
          <h3>Favorite rules</h3>
          <FavoriteRules />
          <Button raised onClick={this.onClick2}>click me!</Button>
          <hr />
          <div>Hello World.</div>
          <Button raised color="primary" onClick={this.onClick}>click me!</Button>
          <div className="terminal">
            <Terminal content={this.state.content} />
          </div>
          <style jsx>{`
            .terminal {
              position:fixed;
              left:0px;
              bottom:26px;
              height:50%;
              width:100%;
            }
          `}
          </style>
        </div>
      </Layout>
    );
  }
}

export default Start;
