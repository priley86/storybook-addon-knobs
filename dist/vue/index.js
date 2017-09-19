'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.vueHandler = exports.select = exports.date = exports.array = exports.object = exports.color = exports.number = exports.boolean = exports.text = exports.knob = undefined;
exports.withKnobs = withKnobs;
exports.withKnobsOptions = withKnobsOptions;

var _addons = require('@storybook/addons');

var _addons2 = _interopRequireDefault(_addons);

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
var vueHandler = exports.vueHandler = function vueHandler(channel, knobStore) {
  return function (getStory) {
    return function (context) {
      return {
        render: function render(h) {
          return h(getStory(context));
        },


        methods: {
          onKnobChange: function onKnobChange(change) {
            var name = change.name,
                value = change.value;
            // Update the related knob and it's value.

            var knobOptions = knobStore.get(name);
            knobOptions.value = value;
            this.$forceUpdate();
          },
          onKnobReset: function onKnobReset() {
            knobStore.reset();
            this.setPaneKnobs(false);
            this.$forceUpdate();
          },
          setPaneKnobs: function setPaneKnobs() {
            var timestamp = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : +new Date();

            channel.emit('addon:knobs:setKnobs', { knobs: knobStore.getAll(), timestamp: timestamp });
          }
        },

        created: function created() {
          channel.on('addon:knobs:reset', this.onKnobReset);
          channel.on('addon:knobs:knobChange', this.onKnobChange);
          knobStore.subscribe(this.setPaneKnobs);
        },
        beforeDestroy: function beforeDestroy() {
          channel.removeListener('addon:knobs:reset', this.onKnobReset);
          channel.removeListener('addon:knobs:knobChange', this.onKnobChange);
          knobStore.unsubscribe(this.setPaneKnobs);
        }
      };
    };
  };
};

function wrapperKnobs(options) {
  var channel = _addons2.default.getChannel();
  _base.manager.setChannel(channel);

  if (options) channel.emit('addon:knobs:setOptions', options);

  return vueHandler(channel, _base.manager.knobStore);
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