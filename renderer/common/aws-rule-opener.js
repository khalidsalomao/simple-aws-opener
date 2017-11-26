import axios from 'axios';
import runner from './runner';

async function getMyIp() {
  const r = await axios.get('http://ipinfo.io/ip');
  return r ? r.data : null;
}

async function listRegions() {
  const args = ['ec2', 'describe-regions'];

  const result = await runner.runCmd('aws', args);
  return JSON.parse(result || '{}');
}

async function listGroups(group, region) {
  if (!group || !group.trim()) {
    return null;
  }
  const args = ['ec2', 'describe-security-groups'];

  args.push('--region');
  args.push(region || 'sa-east-1');

  const groupName = group.trim();
  if (groupName.indexOf('sg-') === 0 && groupName.length === 11) {
    args.push('--group-id');
    args.push(groupName);
  } else {
    args.push('--group-name');
    args.push(groupName);
  }

  const result = await runner.runCmd('aws', args);
  return JSON.parse(result || '{}');
}

async function addRule(rule) {
  if (!rule || !rule.ipList || !rule.description) {
    throw new Error('Invalid rule');
  }
  const args = ['ec2', 'authorize-security-group-ingress'];

  args.push('--region');
  args.push(rule.region || 'sa-east-1');

  if (rule.groupId) {
    args.push('--group-id');
    args.push(rule.groupId);
  } else if (rule.groupName) {
    args.push('--group-name');
    args.push(rule.groupName);
  } else {
    throw new Error('Invalid group name or Id');
  }

  const permissions = [{
    IpProtocol: rule.ipProtocol || 'tcp',
    FromPort: parseInt(rule.fromPort, 10),
    ToPort: parseInt(rule.toPort, 10),
    IpRanges: rule.ipList.map(i => ({
      CidrIp: i,
      Description: rule.description
    }).o)
  }];

  args.push('--ip-permissions');
  args.push(JSON.stringify(permissions));

  const r = await runner.runCmd('aws', args);
  return {
    result: !r,
    message: r
  };
}

async function revokeRule(rule) {
  if (!rule || !rule.ipList || !rule.description) {
    throw new Error('Invalid rule');
  }
  const args = ['ec2', 'revoke-security-group-ingress'];

  args.push('--region');
  args.push(rule.region || 'sa-east-1');

  if (rule.groupId) {
    args.push('--group-id');
    args.push(rule.groupId);
  } else if (rule.groupName) {
    args.push('--group-name');
    args.push(rule.groupName);
  } else {
    throw new Error('Invalid group name or Id');
  }

  const permissions = [{
    IpProtocol: rule.IpProtocol || 'tcp',
    FromPort: rule.FromPort,
    ToPort: rule.ToPort,
    IpRanges: rule.ipList.map(i => ({
      CidrIp: i,
    }))
  }];

  args.push('--ip-permissions');
  args.push(JSON.stringify(permissions));

  const r = await runner.runCmd('aws', args);
  return {
    result: !r,
    message: r
  };
}

// try {
//   const r = await listGroups('sg-d27a79b6', 'sa-east-1');
//   AppStore.printEvent(r.SecurityGroups[0].IpPermissions.find(i => i.FromPort === 1433));
//   const ips = r.SecurityGroups[0].IpPermissions.find(i => i.FromPort === 1433).IpRanges;
//   AppStore.printEvent(ips.find(i => i.Description === 'khalid.salomao'));
//   AppStore.printEvent(ips.find(i => i.CidrIp === '186.242.106.205/32'));

//   return r;
// } catch (e) {
//   if (e.message.indexOf('ENOENT') >= 0) {
//     AppStore.sendAwsCliNotFound();
//   } else {
//     throw e;
//   }
// }
// return {};

export default {
  getMyIp,
  listRegions,
  listGroups,
  addRule,
  revokeRule,
};