function formatTime(time) {
  if (time >= 0) {
    let h = Math.floor(time / 3600);
    let m = Math.floor((time - h * 3600) / 60);
    let s = Math.floor(time % 60);
    h = h < 10 ? "0" + h : h;
    m = m < 10 ? "0" + m : m;
    s = s < 10 ? "0" + s : s;
    return h + ":" + m + ":" + s;
  }
}

export { formatTime };
