import React from "react";
import { Slider, Icon, message } from "antd";
import "./player.scss";
import { formatTime } from "./utils";
import fullscreen from "./full-screen";

class Player extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isShowControl: true,
      showBtn: true,
      isPlaying: false,
      isFullScreen: false,
      duration: 0,
      currentTime: 0,
      volume: 50,
      progress: 0,
      playUrl: "https://media.w3.org/2010/05/sintel/trailer_hd.mp4"
    };
  }
  handleUpdate(e) {
    let duration = e.target.duration;
    let currentTime = e.target.currentTime;
    let progress = (currentTime / duration) * 100;
    this.setState({
      progress,
      currentTime
    });
  }
  handleEnd() {
    this.setState({
      isPlaying: false
    });
  }
  handleload(e) {
    let duration = e.target.duration;
    this.setState({
      duration
    });
  }
  handleError(e) {
    let { playUrl } = this.state;
    if (playUrl) {
      message.error("无法播放");
    }
  }
  changeVolume(volume) {
    let realVolume = volume / 100;
    let myAudio = this.refs.myAudio;
    myAudio.volume = realVolume;
    this.setState({
      volume
    });
  }
  toggleVolume() {
    let { volume } = this.state;
    let newVolume = volume !== 0 ? 0 : 50;
    this.setState({
      volume: newVolume
    });
  }
  handleProgress(progress) {
    let { duration } = this.state;
    this.setState({
      progress
    });
    let currentTime = (progress / 100) * duration;
    let myAudio = this.refs.myAudio;
    myAudio.currentTime = currentTime;
  }
  handlePlay() {
    let { isPlaying, duration } = this.state;
    if (!duration) {
      return;
    }
    let myAudio = this.refs.myAudio;
    if (isPlaying) {
      myAudio.pause();
      this.setState({
        showBtn: true
      });
    } else {
      myAudio.play();
      setTimeout(() => {
        this.setState({
          showBtn: false
        });
      }, 1000);
    }
    this.setState({
      isPlaying: !isPlaying
    });
  }
  handleEnter() {
    this.setState({
      showControls: true
    });
  }
  handleLeave() {
    setTimeout(() => {
      this.setState({
        showControls: false
      });
    }, 2000);
  }
  handleMouseMove() {
    this.timer && window.clearTimeout(this.timer);
    this.setState({ isShowControl: true }, () => {
      this.timer = setTimeout(() => {
        this.setState({ isShowControl: false });
      }, 5000);
    });
  }
  toggleFullscreen() {
    let videoWrapper = this.refs["myAudioBox"];
    if (fullscreen.enabled) {
      if (fullscreen.isFullscreen) {
        fullscreen.exit();
        this.setState({
          isFullScreen: false
        });
      } else {
        fullscreen.request(videoWrapper);
        this.setState({
          isFullScreen: true
        });
      }
      this.change("remove", e => {
        console.log("remove!!!");
      });

      this.change("add", e => {
        let width = e.target.clientWidth;
        let docWidth = window.innerWidth;
        let isFullScreen = width === docWidth ? true : false;
        this.setState({
          isFullScreen
        });
      });
    }
  }
  change(type, callback) {
    let vendors = [
      "fullscreenchange",
      "mozfullscreenchange",
      "MSFullscreenChange",
      "webkitfullscreenchange"
    ];
    vendors.forEach(function(vendor) {
      return document[type + "EventListener"](vendor, callback);
    });
  }

  render() {
    let { showBtn, playUrl, isShowControl } = this.state;
    let {
      progress,
      isPlaying,
      volume,
      currentTime,
      duration,
      isFullScreen
    } = this.state;
    let playType = isPlaying ? "pause-circle" : "play-circle";
    let fullClass = isFullScreen ? "isFullScreen" : "";

    return (
      <div
        id="myAudioBox"
        ref="myAudioBox"
        className={"video-container " + fullClass}
        onDoubleClick={this.toggleFullscreen.bind(this)}
        onMouseMove={this.handleMouseMove.bind(this)}
      >
        <video
          preload={"true"}
          id="myAudio"
          ref="myAudio"
          src={playUrl}
          controls={false}
          onTimeUpdate={this.handleUpdate.bind(this)}
          onLoadedMetadata={this.handleload.bind(this)}
          onError={this.handleError.bind(this)}
          onEnded={this.handleEnd.bind(this)}
          onClick={this.handlePlay.bind(this)}
        />
        <div
          className="play-pause-box"
          style={{ display: showBtn ? "block" : "none" }}
        >
          <Icon
            type={playType}
            onClick={this.handlePlay.bind(this)}
            className="play-icon"
          />
        </div>
        <div
          className="controls-bar-box"
          style={{ display: isShowControl ? "block" : "none" }}
        >
          <div className="play-progress">
            <Slider
              step={0.01}
              tipFormatter={null}
              value={progress}
              onChange={this.handleProgress.bind(this)}
            />
          </div>
          <div className="play-controls-box">
            <div className="bar-left">
              <div className="play-btn-box">
                <Icon
                  type={playType}
                  onClick={this.handlePlay.bind(this)}
                  className="play-icon"
                />
              </div>
              <div className="time-box">
                <span className="play-current">{formatTime(currentTime)}</span>
                <span className="play-split">/</span>
                <span className="play-duration">{formatTime(duration)}</span>
              </div>
            </div>
            <div className="bar-right">
              <div className="volume-bar">
                <Icon
                  type="sound"
                  className="volume-icon"
                  onClick={this.toggleVolume.bind(this)}
                />
                <Slider
                  step={0.01}
                  value={volume}
                  tipFormatter={null}
                  className="volume-slider"
                  onChange={this.changeVolume.bind(this)}
                />
              </div>
              <div className="screen-box">
                <Icon
                  title={isFullScreen ? "退出全屏" : "全屏"}
                  className={isFullScreen ? "screen-icon" : "screen-icon"}
                  type={isFullScreen ? "fullscreen-exit" : "fullscreen"}
                  onClick={this.toggleFullscreen.bind(this)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Player;
