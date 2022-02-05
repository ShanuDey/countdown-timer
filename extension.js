// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');

let statusBar;
const commandId = 'countdown-timer.activate';
const setTimerCommandId = 'countdown-timer.settimer';
const hideStatusBarOnIdleCommandId = 'countdown-timer.hidestatusonidle';
const showStatusBarOnIdleCommandId = 'countdown-timer.showstatusonidle';

const unitSeconds = 1000; // 1 sec = 1000 milliseconds
let timeLeft = 0;
let timerIntervalId;

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
  // The command has been defined in the package.json file
  // Now provide the implementation of the command with  registerCommand
  // The commandId parameter must match the command field in package.json
  context.subscriptions.push(disposable);
  context.subscriptions.push(setTimerRegisterCommand);
  // create a new status bar item that we can now manage
  context.subscriptions.push(statusBar);
  context.subscriptions.push(hideStatusBarItemOnIdleCommand);
  context.subscriptions.push(showStatusBarItemOnIdleCommand);

  //on active
  createStatusBar();
}

// this method is called when your extension is deactivated
function deactivate() {}

let disposable = vscode.commands.registerCommand(commandId, function () {
  // Display a message box to the user
  vscode.window.showInformationMessage(
    'Count Down timer extension is active now!'
  );
});

const setTimerRegisterCommand = vscode.commands.registerCommand(
  setTimerCommandId,
  async function () {
    const userInput = await getUserInput(
      'HH:MM:SS in 24 hours format. Example: 00:30:00',
      validateTime
    );
    manageTimer(userInput);
  }
);

const hideStatusBarItemOnIdleCommand = vscode.commands.registerCommand(
  hideStatusBarOnIdleCommandId,
  async function () {
    statusBar.hide();
  }
);

const showStatusBarItemOnIdleCommand = vscode.commands.registerCommand(
  showStatusBarOnIdleCommandId,
  function () {
    statusBar.show();
  }
);

function createStatusBar() {
  statusBar = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Right
  );
  updateStatusBar('Not set');
  statusBar.show();
  statusBar.command = setTimerCommandId;
}

function updateStatusBar(text) {
  statusBar.text = `$(watch) ${text}`;
  // console.log(statusBar.text);
}

const validateTime = (inputTime) => {
  // checking the pattern is `dd:dd:dd` where d is digit
  const pattern = /\d\d:\d\d:\d\d/g;
  if (!pattern.test(inputTime))
    return 'Invalid format!! Please enter time in HH:MM:SS format';

  // checking part wise
  const [hh, mm, ss] = inputTime.split(':').map((str) => parseInt(str));
  if (ss > 59) return 'Seconds are more than 59!! Add Minutes instead';
  if (mm > 59) return 'Minutes are more than 59!! Add Hours instead';
  if (hh > 24)
    return 'Hours are more than 24!! More than a day is not supported yet.';
  if (hh === 24 && mm >= 0 && ss > 0)
    return 'Hours are more than 24!! More than a day is not supported yet.';
  if (hh === 24 && mm > 0 && ss >= 0)
    return 'Hours are more than 24!! More than a day is not supported yet.';
  if (hh === 0 && mm === 0 && ss === 0)
    return 'OMG!! All zeros. It is already expired';

  // if all test passed then return null
  return null;
};

/**
 * Shows an input box to take user input
 */
async function getUserInput(placeHolderText, validateInputFunction) {
  const result = await vscode.window.showInputBox({
    // value: 'abcdef',
    // valueSelection: [2, 4],
    placeHolder: placeHolderText,
    validateInput: (text) => {
      return validateInputFunction(text);
    },
  });
  vscode.window.showInformationMessage(
    `Countdown timer is set for ${result}  ⬇️`
  );
  return result;
}

function manageTimer(targetTime) {
  const statusbarVisibility = statusBar._visible;
  if (statusbarVisibility === false) statusBar.show();
  let currentTimeLeft;
  timeLeft = getTimeLeftInSeconds(targetTime);
  timerIntervalId = setInterval(() => {
    if (timeLeft < 0) {
      clearInterval(timerIntervalId);
      updateStatusBar('Not Set');
      vscode.window.showInformationMessage(
        'Countdown Timer: Expired \n 🎉🎉 Congratulation 🎉🎉'
      );
      statusbarVisibility ? statusBar.show() : statusBar.hide();
    } else {
      currentTimeLeft = getCurrentTimeLeft();
      updateStatusBar(currentTimeLeft);
      timeLeft--;
    }
  }, 1000);
}

const getCurrentTimeLeft = () => {
  const hh = Math.floor(timeLeft / 3600);
  const mm = Math.floor(timeLeft / 60);
  const ss = Math.floor(timeLeft % 60);
  return `${hh}h ${mm}m ${ss}s`;
};

const getTimeLeftInSeconds = (targetTime) => {
  const [hh, mm, ss] = targetTime.split(':').map((str) => parseInt(str));
  return hh * 60 + mm * 60 + ss;
};

module.exports = {
  activate,
  deactivate,
  validateTime,
};
