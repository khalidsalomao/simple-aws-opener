import ChildProcess from 'child_process';

function prepareArgs(args) {
  return typeof args === 'string' ? args.trim().replace(/ {2}/g, '').split(' ') : args;
}

function runCmd(cmd, args, callBack) {
  const child = ChildProcess.spawn(cmd, prepareArgs(args));
  let resp = '';

  child.stdout.on('data', (buffer) => { resp += buffer.toString(); });
  child.stdout.on('end', () => { callBack(resp); });
}

export default {
  runCmd,
};
