import React from 'react';
import { observer } from 'mobx-react';

import Layout from '../components/layout';
import Terminal from '../components/terminal';
import FavoriteRules from '../components/favorite-rules';
import RuleOpenerForm from '../components/rule-opener-form';
import AwsOpener from '../common/aws-rule-opener';

import AppStore from '../store/app-store';

async function loadAWSRegions() {
  try {
    const r = await AwsOpener.listRegions();
    if (r && r.Regions) {
      AppStore.setAwsRegions(r.Regions.map(i => i.RegionName));
    }
  } catch (e) {
    if (e.message.indexOf('ENOENT') >= 0) {
      AppStore.sendAwsCliNotFound();
    } else {
      throw e;
    }
  }
}

@observer
class Start extends React.Component {
  componentDidMount() {
    loadAWSRegions();
  }

  render() {
    return (
      <Layout>
        <div className="main-container">
          <div className="half-containers">
            <RuleOpenerForm />
            <h3>Favorite rules</h3>
            <FavoriteRules />
            <hr />
          </div>
          <div className="half-containers max-size-300">
            <Terminal content={AppStore.events} />
          </div>
          <style jsx>{`
            .main-container {
              height: 100%;
              display: flex;
              flex-direction: column;
              overflow: auto;
            }
            .half-containers {
              flex: 1;
              overflow: auto;
            }
          `}
          </style>
        </div>
      </Layout>
    );
  }
}

export default Start;
