'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactTextareaAutosize = require('react-textarea-autosize');

var _reactTextareaAutosize2 = _interopRequireDefault(_reactTextareaAutosize);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var styles = {
  display: 'table-cell',
  boxSizing: 'border-box',
  verticalAlign: 'middle',
  height: '26px',
  width: '100%',
  outline: 'none',
  border: '1px solid #f7f4f4',
  borderRadius: 2,
  fontSize: 11,
  padding: '5px',
  color: '#555'
};

function formatArray(value, separator) {
  if (value === '') {
    return [];
  }
  return value.split(separator);
}

var ArrayType = function (_React$Component) {
  (0, _inherits3.default)(ArrayType, _React$Component);

  function ArrayType() {
    (0, _classCallCheck3.default)(this, ArrayType);
    return (0, _possibleConstructorReturn3.default)(this, (ArrayType.__proto__ || (0, _getPrototypeOf2.default)(ArrayType)).apply(this, arguments));
  }

  (0, _createClass3.default)(ArrayType, [{
    key: 'render',
    value: function render() {
      var _this2 = this;

      var _props = this.props,
          knob = _props.knob,
          _onChange = _props.onChange;

      return _react2.default.createElement(_reactTextareaAutosize2.default, {
        id: knob.name,
        ref: function ref(c) {
          _this2.input = c;
        },
        style: styles,
        value: knob.value.join(knob.separator),
        onChange: function onChange(e) {
          return _onChange(formatArray(e.target.value, knob.separator));
        }
      });
    }
  }]);
  return ArrayType;
}(_react2.default.Component);

ArrayType.defaultProps = {
  knob: {},
  onChange: function onChange(value) {
    return value;
  }
};

ArrayType.propTypes = {
  knob: _propTypes2.default.shape({
    name: _propTypes2.default.string,
    value: _propTypes2.default.array
  }),
  onChange: _propTypes2.default.func
};

ArrayType.serialize = function (value) {
  return value;
};
ArrayType.deserialize = function (value) {
  return value;
};

exports.default = ArrayType;