# state
A simple state model with transition control

## Example
```
const State = require('./state');

// states allowed
var stateModel = [
  'idle',
  'created',
  'running',
  'completed',
  'hold',
  'aborted',
  'error'
];

//transitions allowed
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

// create new instance
var taskState = new State(stateModel, 'idle', transitionModel);

// state change is monitored by stateChange event
taskState.on('stateChange', function(data) {
  console.log(data);
})

// errors are raising error event
taskState.on('error', function(data) {
  console.log(data);
})

//set to create
taskState.setStateValue('created');
console.log(taskState.getStateValue());

// state idleasdfasdf is not defined
taskState.setStateValue('idleasdfasdf');
console.log(taskState.getStateValue());

// create to idl is not allowed
taskState.setStateValue('idle');
console.log(taskState.getStateValue());

// set to error
taskState.setStateValue('error');
console.log(taskState.getStateValue());

// error to running allowed wit wild card
taskState.setStateValue('running');
console.log(taskState.getStateValue());

// set to idle is not allowed
taskState.setStateValue('idle');
console.log(taskState.getStateValue());

// set to aborted
taskState.setStateValue('aborted');
console.log(taskState.getStateValue());
```
