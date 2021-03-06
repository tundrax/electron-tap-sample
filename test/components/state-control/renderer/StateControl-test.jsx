import test from 'tape';
import reporter from 'electron-tap/reporter';
import React from 'react';
import ReactDOM from 'react-dom';
import ReactTestUtils from 'react-addons-test-utils';
import { ipcRenderer } from 'electron';

// React component to test
import StateControl from '../../../../src/components/state-control/renderer/StateControl';

let container;

test('setup', function (t) {
  container = document.createElement('div');
  document.body.appendChild(container);
  t.end();
});

test('StateControl', function (t) {
  const component = ReactDOM.render(<StateControl />, container);
  const node = ReactDOM.findDOMNode(component);

  t.equal(node.offsetHeight, 60, 'control height is 60px');
  t.equal(component.state.switchState, 'OFF', 'initial state is OFF');

  ipcRenderer.on('switch-response', switchCallback);
  const button = component.refs.button;
  ReactTestUtils.Simulate.click(button);
  t.equal(button.disabled, true, 'button disabled');

  function switchCallback(sender, status) {
    t.equal(status, 'ON', 'switched ON');
    t.equal(button.disabled, false, 'button enabled');

    setTimeout(function () {
      ReactTestUtils.Simulate.click(button);
      t.equal(component.state.switchState, 'OFF', 'switched OFF');
      ipcRenderer.removeListener('switch-response', switchCallback);
      t.end();
    }, 4000); // some delay
  }
});

test('teardown', function (t) {
  document.body.removeChild(container);
  container = null;
  t.end();
});
