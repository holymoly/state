const EventEmitter = require('events');
/**
 * @class
 * @classdesc Defining a state model which also can handle state transitions
 * @extends EventEmitter
 */
class State extends EventEmitter {

  /**
   * Create a instance of the state model.
   * @param {Object} state - contains state definition i.e.
   * [
   *  'idle',
   *  'created',
   *  'running',
   *  'completed',
   *  'hold',
   *  'aborted',
   *  'error'
   * ]
   * @param {string} stateValue - initial value of state i.e.
   * 'idle'
   * @param {Object} options - defining the behavior of the state
   * @param {Object} options.allowedTransitions - key activates transition check
   * @param {Array} options.allowedTransitions.transitions - array of allowed state transitions
   *   [{
   *     'actualState': 'idle',
   *     'newState': 'created'
   *   }, {
   *     'actualState': 'idle',
   *     'newState': 'aborted'
   *   }, {
   *     actualState: 'created',
   *     'newState': 'running'
   *   }, {
   *     'actualState': 'created',
   *     'newState': 'aborted'
   *   }, {
   *     'actualState': 'running',
   *     'newState': 'completed'
   *   }, {
   *     'actualState': 'running',
   *     'newState': 'hold'
   *   }, {
   *     'actualState': 'running',
   *     'newState': 'aborted'
   *   }, {
   *     'actualState': 'hold',
   *     'newState': 'running'
   *   }, {
   *     'actualState': 'error',
   *     'newState': '*'
   *   }, {
   *     'actualState': '*',
   *     'newState': 'error'
   *   }]
   */
  constructor(stateModel, stateValue, options) {
    super();
    this._stateModel = stateModel;
    this._actualStateName = undefined;
    this._options = options;
    this._checkTransitions = false;
    this._transitions = undefined;

    if (this._stateModel.includes(stateValue)) {
      this.setState(stateValue);
    } else {
      this.generateError('State not in stateModel');
    }

    // If options where passed, set parameter accordingly
    if (this._options) {

      // Check if transitions between state should be validated
      if (this._options.hasOwnProperty('allowedTransitions')) {
        this._checkTransitions = true;
        this._transitions = this._options.allowedTransitions.transitions;
      }
    }
  }

  /**
   * Change actual state.
   * @param {String} value - desired state i.e. 'idle'
   */
  setState(value) {
    this._actualStateName = value;
  }


  /**
   * Verifies if value passed is allowed for a state change
   * @param {String} value - desired state i.e. 'idle'
   */
  setStateValue(value) {
    // Check if transition should be validated
    var that = this;
    // check if the 
    if (this._stateModel.includes(value)) {
      if (this._checkTransitions) {
        // check in transitions if state change is allowed
        var stateChange = false;
        this._transitions.forEach(function(transition, i, array) {
          if (transition.actualState === that._actualStateName && transition.newState === value ||
            transition.actualState === '*' && transition.newState === value ||
            transition.actualState === that._actualStateName && transition.newState === '*') {
            stateChange = true;
            console.log('Set state to ' + value);
            that.setState(value);
          }
          if (i === array.length - 1) {
            //if laste transition was checked call checkStatusChange
            checkStatusChange();
          }
        });

        function checkStatusChange() {
          if (stateChange) {
            that.emit('stateChange', {
              newState: that._actualStateName
            });
          } else {
            var error = new Error('Could not change state to ' + value);
            error.name = 'noStateChange';
            error.actState = that._actualStateName;
            that.generateError(error);
          }

        }
      } else {;
        setState(value);
      }
    } else {
      var error = new Error('State: ' + value + ' not in stateModel');
      error.name = 'noInStateModel';
      error.actState = that._actualStateName;
      this.generateError(error);
    }
  }

  /**
   * Emits 'error event'
   * @param {Object} err - standard error object containing also actual state
   */
  generateError(err) {
    this.emit('error', err);
  }

  /**
   * Returns actual state
   */
  getStateValue() {
    return this._actualStateName;
  };
}

module.exports = State;