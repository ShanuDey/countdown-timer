const assert = require('assert');

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
const vscode = require('vscode');
const extension = require('../../extension.js');

suite('Countdown Timer Test Suite: validationTime function', () => {
  vscode.window.showInformationMessage('Start all tests.');

  test('test the input input following "xx:xx:xx" pattern', () => {
    // when the user input is not following this pattern
    assert.strictEqual(
      extension.validationTime('a:a:a'),
      'Invalid format!! Please enter time in HH:MM:SS format'
    );
    assert.strictEqual(
      extension.validationTime('aa:a:a'),
      'Invalid format!! Please enter time in HH:MM:SS format'
    );
    assert.strictEqual(
      extension.validationTime('aa:aa:a'),
      'Invalid format!! Please enter time in HH:MM:SS format'
    );
    assert.strictEqual(
      extension.validationTime('aa:aa;aa'),
      'Invalid format!! Please enter time in HH:MM:SS format'
    );
    // when the user input is following this pattern
    assert.strictEqual(extension.validationTime('11:11:11'), null);
  });

  test('test the user inputs are digit', () => {
    // when the user inputs are not digits
    assert.strictEqual(
      extension.validationTime('aa:aa:aa'),
      'Invalid format!! Please enter time in HH:MM:SS format'
    );
    // when the user inputs are digits
    assert.strictEqual(extension.validationTime('11:11:11'), null);
  });
});
