import ChildProcess from 'child_process';
import logger from '../common/logger';

let printCmd;
function setPrintCmd(callback) {
  printCmd = callback;
}

function prepareArgs(args) {
  return typeof args === 'string' ? args.trim().replace(/ {2}/g, '').split(' ') : args;
}

function runCmd(cmd, args) {
  /* eslint-disable no-use-before-define */
  if (runner) {
    runner.lastCmd = `${cmd} ${prepareArgs(args).join(' ')}`;
  }
  if (typeof (printCmd) === 'function') {
    printCmd(runner.lastCmd);
  }
  /* eslint-enable no-use-before-define */

  logger.debug(cmd, prepareArgs(args).join(' '));

  return new Promise((resolve, reject) => {
    const child = ChildProcess.spawn(cmd, prepareArgs(args));
    let resp = '';
    let done = false;

    child.stdout.on('data', (buffer) => {
      resp += buffer.toString();
    });

    child.stderr.on('data', (buffer) => {
      resp += buffer.toString();
    });

    child.stdout.on('end', () => {
      if (!done) {
        done = true;
        resolve(resp);
      }
    });

    child.on('error', (err) => {
      if (!done) {
        done = true;
        reject(err);
      }
    });

    child.on('close', (code) => {
      if (!done) {
        done = true;
        if (!code) resolve(resp);
        else reject(new Error(`Execution failed with code ${code}`));
      }
    });
  });
}

const runner = {
  lastCmd: '',
  setPrintCmd,
  runCmd,
};

export default runner;
