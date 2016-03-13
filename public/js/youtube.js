'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _uniqueId = require('lodash/uniqueId');

var _uniqueId2 = _interopRequireDefault(_uniqueId);

var _isEqual = require('lodash/isEqual');

var _isEqual2 = _interopRequireDefault(_isEqual);

var _youtubePlayer = require('youtube-player');

var _youtubePlayer2 = _interopRequireDefault(_youtubePlayer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * Module dependencies
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */

/**
 * Create a new `YouTube` component.
 */

var YouTube = function (_React$Component) {
  _inherits(YouTube, _React$Component);

  /**
   * @param {Object} props
   */

  function YouTube(props) {
    _classCallCheck(this, YouTube);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(YouTube).call(this, props));

    _this._containerId = props.id || (0, _uniqueId2.default)('player_');
    _this._internalPlayer = null;
    return _this;
  }

  _createClass(YouTube, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      this.createPlayer();
    }
  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate(prevProps) {
      var optsHaveChanged = !(0, _isEqual2.default)(prevProps.opts, this.props.opts);
      var videoHasChanged = prevProps.videoId !== this.props.videoId;

      if (optsHaveChanged) {
        return this.resetPlayer();
      }

      if (videoHasChanged) {
        this.updateVideo();
      }
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      this.destroyPlayer();
    }

    /**
     * https://developers.google.com/youtube/iframe_api_reference#onReady
     *
     * @param {Object} event
     *   @param {Object} target - player object
     */

  }, {
    key: 'onPlayerReady',
    value: function onPlayerReady(event) {
      this.props.onReady(event);
    }

    /**
     * https://developers.google.com/youtube/iframe_api_reference#onError
     *
     * @param {Object} event
     *   @param {Integer} data  - error type
     *   @param {Object} target - player object
     */

  }, {
    key: 'onPlayerError',
    value: function onPlayerError(event) {
      this.props.onError(event);
    }

    /**
     * https://developers.google.com/youtube/iframe_api_reference#onStateChange
     *
     * @param {Object} event
     *   @param {Integer} data  - status change type
     *   @param {Object} target - actual YT player
     */

  }, {
    key: 'onPlayerStateChange',
    value: function onPlayerStateChange(event) {
      this.props.onStateChange(event);
      switch (event.data) {

        case window.YT.PlayerState.ENDED:
          this.props.onEnd(event);
          break;

        case window.YT.PlayerState.PLAYING:
          this.props.onPlay(event);
          break;

        case window.YT.PlayerState.PAUSED:
          this.props.onPause(event);
          break;

        default:
          return;
      }
    }
  }, {
    key: 'createPlayer',
    value: function createPlayer() {
      // do not attempt to create a player server-side, it won't work
      if (typeof document === 'undefined') return;
      // create player
      this._internalPlayer = (0, _youtubePlayer2.default)(this._containerId, _extends({}, this.props.opts));
      // attach event handlers
      this._internalPlayer.on('ready', this.onPlayerReady.bind(this));
      this._internalPlayer.on('error', this.onPlayerError.bind(this));
      this._internalPlayer.on('stateChange', this.onPlayerStateChange.bind(this));
      // update video
      this.updateVideo();
    }
  }, {
    key: 'destroyPlayer',
    value: function destroyPlayer() {
      return this._internalPlayer.destroy();
    }
  }, {
    key: 'resetPlayer',
    value: function resetPlayer() {
      this.destroyPlayer().then(this.createPlayer.bind(this));
    }
  }, {
    key: 'updateVideo',
    value: function updateVideo() {
      // set queueing options
      var autoplay = false;
      var opts = {
        videoId: this.props.videoId
      };
      if ('playerVars' in this.props.opts) {
        autoplay = this.props.opts.playerVars.autoplay === 1;
        if ('start' in this.props.opts.playerVars) {
          opts.startSeconds = this.props.opts.playerVars.start;
        }
        if ('end' in this.props.opts.playerVars) {
          opts.endSeconds = this.props.opts.playerVars.end;
        }
      }

      // if autoplay is enabled loadVideoById
      if (autoplay) {
        this._internalPlayer.loadVideoById(opts);
        return;
      }
      // default behaviour just cues the video
      this._internalPlayer.cueVideoById(opts);
    }

    /**
     * @returns Object
     */

  }, {
    key: 'render',
    value: function render() {
      return _react2.default.createElement('div', { id: this._containerId, className: this.props.className });
    }
  }]);

  return YouTube;
}(_react2.default.Component);

/**
 * Expose `YouTube`
 */

YouTube.propTypes = {
  videoId: _react2.default.PropTypes.string.isRequired,

  // custom ID for player element
  id: _react2.default.PropTypes.string,

  // custom class name for player element
  className: _react2.default.PropTypes.string,

  // https://developers.google.com/youtube/iframe_api_reference#Loading_a_Video_Player
  opts: _react2.default.PropTypes.object,

  // event subscriptions
  onReady: _react2.default.PropTypes.func,
  onError: _react2.default.PropTypes.func,
  onPlay: _react2.default.PropTypes.func,
  onPause: _react2.default.PropTypes.func,
  onEnd: _react2.default.PropTypes.func,
  onStateChange: _react2.default.PropTypes.func
};
YouTube.defaultProps = {
  opts: {},
  onReady: function onReady() {},
  onError: function onError() {},
  onPlay: function onPlay() {},
  onPause: function onPause() {},
  onEnd: function onEnd() {},
  onStateChange: function onStateChange() {}
};
exports.default = YouTube;