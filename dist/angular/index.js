'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.angularHandler = exports.select = exports.date = exports.array = exports.object = exports.color = exports.number = exports.boolean = exports.text = exports.knob = undefined;
exports.withKnobs = withKnobs;
exports.withKnobsOptions = withKnobsOptions;

var _addons = require('@storybook/addons');

var _addons2 = _interopRequireDefault(_addons);

var _helpers = require('./helpers.ts');

var _base = require('../base');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.knob = _base.knob;
exports.text = _base.text;
exports.boolean = _base.boolean;
exports.number = _base.number;
exports.color = _base.color;
exports.object = _base.object;
exports.array = _base.array;
exports.date = _base.date;
exports.select = _base.select;
var angularHandler = exports.angularHandler = function angularHandler(channel, knobStore) {
  return function (getStory) {
    return function (context) {
      return (0, _helpers.prepareComponent)({ getStory: getStory, context: context, channel: channel, knobStore: knobStore });
    };
  };
};

function wrapperKnobs(options) {
  var channel = _addons2.default.getChannel();
  _base.manager.setChannel(channel);

  if (options) channel.emit('addon:knobs:setOptions', options);

  return angularHandler(channel, _base.manager.knobStore);
}

function withKnobs(storyFn, context) {
  return wrapperKnobs()(storyFn)(context);
}

function withKnobsOptions() {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  return function (storyFn, context) {
    return wrapperKnobs(options)(storyFn)(context);
  };
}