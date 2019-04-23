/*
 * @Author: holymoly
 * @Date:   2019-04-23 20:05:43
 * @Last Modified by:   holymoly
 * @Last Modified time: 2019-04-23 21:19:16
 */
const State = require('./state');

var stateModel = [
  'idle',
  'created',
  'running',
  'completed',
  'hold',
  'aborted',
  'error'
];
var transitionModel = {
  'allowedTransitions': {
    'transitions': [{
      'actualState': 'idle',
      'newState': 'created'
    }, {
      'actualState': 'idle',
      'newState': 'aborted'
    }, {
      actualState: 'created',
      'newState': 'running'
    }, {
      'actualState': 'created',
      'newState': 'aborted'
    }, {
      'actualState': 'running',
      'newState': 'completed'
    }, {
      'actualState': 'running',
      'newState': 'hold'
    }, {
      'actualState': 'running',
      'newState': 'aborted'
    }, {
      'actualState': 'hold',
      'newState': 'running'
    }, {
      'actualState': 'error',
      'newState': '*'
    }, {
      'actualState': '*',
      'newState': 'error'
    }]
  }
};

var taskState = new State(stateModel, 'idle', transitionModel);
taskState.on('stateChange', function(data) {
  console.log(data);
})

taskState.on('error', function(data) {
  console.log(data);
})

taskState.setStateValue('created');
console.log(taskState.getStateValue());
taskState.setStateValue('idleasdfasdf');
console.log(taskState.getStateValue());
taskState.setStateValue('idle');
console.log(taskState.getStateValue());

taskState.setStateValue('error');
console.log(taskState.getStateValue());

taskState.setStateValue('running');
console.log(taskState.getStateValue());

taskState.setStateValue('idle');
console.log(taskState.getStateValue());

taskState.setStateValue('aborted');
console.log(taskState.getStateValue());