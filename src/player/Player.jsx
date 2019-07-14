import React from "react";
import { Slider, Icon, message } from "antd";
import "./player.scss";
import { formatTime } from "./utils";
import fullscreen from "./full-screen";

class Player extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showControls: true,
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
  handleMove() {
    let { showControls } = this.state;
    if (!showControls) {
      this.setState(
        {
          showControls: true
        },
        () => {
          setTimeout(() => {
            this.setState({
              showControls: false
            });
          }, 2000);
        }
      );
    }
  }

  enterFullScreen() {
    let videoWrapper = this.refs["myAudio"];
    let requestMethod =
      videoWrapper.requestFullScreen || //W3C
      videoWrapper.webkitRequestFullScreen || //FireFox
      videoWrapper.mozRequestFullScreen || //Chrome等
      videoWrapper.msRequestFullScreen; //IE11
    if (requestMethod) {
      requestMethod.call(videoWrapper);
      this.setState({
        isFullScreen: true
      });
    }
  }

  exitFullscreen() {
    let exitMethod =
      document.webkitCancelFullScreen ||
      document.exitFullscreen ||
      document.mozExitFullScreen;
    if (exitMethod) {
      exitMethod.call(document);
      this.setState({
        isFullScreen: false
      });
    }
  }
  render() {
    let { showBtn, playUrl, showControls } = this.state;
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
        className={"video-container " + fullClass}
        onMouseEnter={this.handleEnter.bind(this)}
        onMouseLeave={this.handleLeave.bind(this)}
        onMouseMove={this.handleMove.bind(this)}
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
          style={{ display: showControls ? "block" : "none" }}
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
                <Icon type="sound" className="volume-icon" />
                <Slider
                  step={0.01}
                  value={volume}
                  tipFormatter={null}
                  className="volume-slider"
                  onChange={this.changeVolume.bind(this)}
                />
              </div>
              <div className="screen-box">
                {isFullScreen ? (
                  <Icon
                    title={isFullScreen ? "退出全屏" : "全屏"}
                    className="screen-icon"
                    type="fullscreen-exit"
                    onClick={this.exitFullscreen.bind(this)}
                  />
                ) : (
                  <Icon
                    title={isFullScreen ? "退出全屏" : "全屏"}
                    className="screen-icon"
                    type="fullscreen"
                    onClick={this.enterFullScreen.bind(this)}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Player;
