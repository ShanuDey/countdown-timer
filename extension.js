// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');

let statusBar;
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log('"countdown-timer" extension is now active!');

  const commandId = 'countdown-timer.activate';
  // The command has been defined in the package.json file
  // Now provide the implementation of the command with  registerCommand
  // The commandId parameter must match the command field in package.json
  let disposable = vscode.commands.registerCommand(commandId, function () {
    // The code you place here will be executed every time your command is executed

    // Display a message box to the user
    vscode.window.showInformationMessage(
      'Count Down timer extension is active now!'
    );
  });
  context.subscriptions.push(disposable);

  // create a new status bar item that we can now manage
  statusBar = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Right
  );
  statusBar.command = commandId;
  context.subscriptions.push(statusBar);

  // update status bar once start
  updateStatusBar();
}

function updateStatusBar() {
  let date = new Date();
  console.log('Current Date Time : ' + date.toLocaleTimeString());
  statusBar.text = date.toLocaleTimeString();
  statusBar.show();
}

// this method is called when your extension is deactivated
function deactivate() {}

module.exports = {
  activate,
  deactivate,
};
