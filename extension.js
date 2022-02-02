// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const { clearInterval } = require('timers');
const vscode = require('vscode');

let statusBar;
let timerIntervalId;
const commandId = 'countdown-timer.activate';
const setTimerCommandId = 'countdown-timer.settimer';
const hideStatusBarOnIdleCommandId = 'countdown-timer.hidestatusonidle';
const showStatusBarOnIdleCommandId = 'countdown-timer.showstatusonidle';
const startPomodoroTimerCommandId = 'countdown-timer.startpomodoro';
const stopPomodoroTimerCommandId = 'countdown-timer.stoppomodoro';
// const COUNTDOWN_TIMER_KEY = 'shanu-dey-countdown-timer';
let isPomodoroTimerActive = false;
let isBreak = false;
let pomodoroTimerIntervalId;

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
  context.subscriptions.push(startPomodoroTimerCommand);
  context.subscriptions.push(stopPomodoroTimerCommand);

  //on active
  createStatusBar();
}

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

const startPomodoroTimerCommand = vscode.commands.registerCommand(
  startPomodoroTimerCommandId,
  function () {
    isPomodoroTimerActive = true;
    pomodoroTimerIntervalId = setInterval(() => {
      // stop pomodoro when user stops it
      // if (isPomodoroTimerActive === false) clearInterval(intervalId);

      // toggle between break and focus mode
      manageTimer(isBreak ? '00:00:25' : '00:00:05');
      isBreak = !isBreak;
    }, 30000);
  }
);

const stopPomodoroTimerCommand = vscode.commands.registerCommand(
  stopPomodoroTimerCommandId,
  function () {
    isPomodoroTimerActive = false;
    clearInterval(pomodoroTimerIntervalId);
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
  const [hh, mm, ss] = targetTime.split(':').map((str) => parseInt(str));
  let targetDate = new Date();
  targetDate.setHours(targetDate.getHours() + hh);
  targetDate.setMinutes(targetDate.getMinutes() + mm);
  targetDate.setSeconds(targetDate.getSeconds() + ss);
  timerIntervalId = setInterval(() => {
    const currentDate = new Date();
    const timeDifference = targetDate - currentDate;
    const hours = Math.floor(
      (timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutes = Math.floor(
      (timeDifference % (1000 * 60 * 60)) / (1000 * 60)
    );
    const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);
    // console.log('manager Timer:', timeDifference, hours, minutes, seconds);
    if (timeDifference < 0) {
      clearInterval(timerIntervalId);
      vscode.window.showInformationMessage(
        'Countdown Timer: Expired \n 🎉🎉 Congratulation 🎉🎉'
      );
      statusbarVisibility ? statusBar.show() : statusBar.hide();
      updateStatusBar('Not set');
    } else {
      updateStatusBar(`${hours}h ${minutes}m ${seconds}s`);
    }
  }, 1000);
}

// this method is called when your extension is deactivated
function deactivate() {}

// const pomodoro = () => {
//   // stop pomodoro when user stops it
//   if (isPomodoroTimerActive === false) return;

//   // toggle between break and focus mode
//   manageTimer(isBreak ? '00:00:25' : '00:00:05');
//   isBreak = !isBreak;
//   pomodoro();
// };

module.exports = {
  activate,
  deactivate,
  validateTime,
};
