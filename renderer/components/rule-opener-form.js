import React from 'react';
// import PropTypes from 'prop-types';
import * as mobx from 'mobx';
import { observer } from 'mobx-react';

import SelectField from 'react-md/lib/SelectFields';
import Button from 'react-md/lib/Buttons';
import TextField from 'react-md/lib/TextFields';

import AppStore from '../store/app-store';
import AwsOpener from '../common/aws-rule-opener';

@observer
class RuleOpenerForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      updatingIp: false
    };

    setTimeout(() => {
      this.onGetMyIp();
    }, 100);
  }

  onInputChange = (value, event) => { AppStore.ruleForm[event.target.name] = value; }
  onSelectChange = (value, index, event, item) => { AppStore.ruleForm[item.name] = value; }

  onAddRule = async () => {
    const rule = this.getCurrentRule();

    try {
      const r = await AwsOpener.addRule(rule);
      if (r.result) {
        AppStore.addFavorite(rule);
        AppStore.printEvent(`Success - rule added to security group. ${JSON.stringify(rule)}`);
      } else {
        AppStore.printEvent(`Error - failed to add rule. ${r.message}`);
      }
    } catch (err) {
      AppStore.printEvent(`Error - failed to add rule. ${err.message}`);
    }
  };

  onRevokeRule = async () => {
    const rule = this.getCurrentRule();
    try {
      const r = await AwsOpener.revokeRule(rule);
      if (r.result) {
        AppStore.printEvent(`Success - rule revoked. ${JSON.stringify(rule)}`);
      } else {
        AppStore.printEvent(`Error - failed to revoke rule. ${r.message}`);
      }
    } catch (err) {
      AppStore.printEvent(`Error - failed to revoke rule. ${err.message}`);
    }
  };

  onGetMyIp = async () => {
    this.setState({ updatingIp: true });
    try {
      const dic = { };
      for (let i = 0; i < 6; i += 1) {
        const r = await AwsOpener.getMyIp();
        if (!dic[r]) {
          dic[r] = 1;
          AppStore.ruleForm.ipList = Object.keys(dic).join(', ');
        }
      }
      AppStore.printEvent(`Ip detected. ${Object.keys(dic).join(', ')}`);
    } catch (err) {
      AppStore.printEvent(`Error getting my ip. Check you internet connection. ${err.message}`);
    }
    this.setState({ updatingIp: false });
  }

  getCurrentRule() {
    const rule = mobx.toJS(AppStore.ruleForm);
    const ipList = (rule.ipList || '')
      .split(/[\s,;-]+/)
      .map(i => i.trim())
      .filter(i => i)
      .map(i => (i.indexOf('/') > 0 ? i : `${i}/32`))
      .sort();
    const portList = (rule.port || '')
      .split(/[\s,;-]+/)
      .map(i => parseInt(i.trim(), 10))
      .filter(i => i)
      .sort();
    const groupName = (rule.groupId || '').trim();
    const groupId = groupName.indexOf('sg-') === 0 && groupName.length === 11 ?
      groupName :
      null;
    const r = {
      description: (rule.description || '').trim(),
      groupId,
      groupName,
      fromPort: portList[0],
      toPort: portList[1] || portList[0],
      ipList,
      region: (rule.region || '').trim() || 'sa-east-1',
      ipProtocol: 'tcp',
    };
    return r;
  }

  render() {
    return (
      <div>
        <div className="md-grid">
          <div className="md-cell--2 input">
            <TextField
              type="text"
              value={AppStore.ruleForm.description}
              label="Description"
              name="description"
              id="input-description"
              onChange={this.onInputChange}
              required
            />
          </div>
          <div className="md-cell--2 input">
            <TextField
              type="text"
              value={AppStore.ruleForm.groupId}
              label="Security Group"
              name="groupId"
              id="input-groupId"
              onChange={this.onInputChange}
              required
            />
          </div>
          <div className="md-cell--2 input">
            <TextField
              type="text"
              value={AppStore.ruleForm.port}
              label="Port range"
              name="port"
              id="input-port"
              onChange={this.onInputChange}
              required
            />
          </div>
          <div className="md-cell--2 input">
            <TextField
              type="text"
              value={AppStore.ruleForm.ipList}
              label="Ip List"
              name="ipList"
              id="input-ipList"
              onChange={this.onInputChange}
              required
              disabled={this.state.updatingIp}
            />
          </div>
          <div className="md-cell--2 input">
            <SelectField
              value={AppStore.ruleForm.region}
              label="AWS Region"
              name="region"
              id="input-region"
              onChange={this.onSelectChange}
              menuItems={AppStore.regions.slice()}
              simplifiedMenu
              block
            />
          </div>

        </div>
        <div className="md-grid">
          <div className="md-cell--6">
            <Button raised onClick={this.onAddRule} primary>Add</Button>&nbsp;
            <Button raised onClick={this.onRevokeRule} secondary>Revoke</Button>&nbsp;
            <Button raised onClick={this.onGetMyIp}>Use my ip</Button>&nbsp;
          </div>
        </div>

        <style jsx>{`
          .input {
            margin: 0 5px;
          }

          .buttons {
            margin: 50px;
          }
        `}
        </style>
      </div>
    );
  }
}

// RuleOpenerForm.propTypes = {
//   content: PropTypes.string
// };

// RuleOpenerForm.defaultProps = {
//   content: ''
// };

export default RuleOpenerForm;
