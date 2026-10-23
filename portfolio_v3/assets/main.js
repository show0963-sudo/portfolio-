// 테마 전환 + 현재 구역 표시 (저장은 이 브라우저에만, 실패해도 화면은 그대로)
(function () {
  var root = document.documentElement;
  var KEY = "pf_theme";
  function saved() { try { return localStorage.getItem(KEY); } catch (e) { return null; } }
  function save(v) { try { localStorage.setItem(KEY, v); } catch (e) { /* 저장 못 해도 괜찮다 */ } }
  var s = saved();
  if (s === "light" || s === "dark") root.setAttribute("data-theme", s);

  function isDark() {
    var t = root.getAttribute("data-theme");
    if (t) return t === "dark";
    return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  }
  var btn = document.getElementById("themeBtn");
  function paint() {
    if (!btn) return;
    var d = isDark();
    btn.setAttribute("aria-label", d ? "밝은 화면으로 바꾸기" : "어두운 화면으로 바꾸기");
    btn.setAttribute("aria-pressed", d ? "true" : "false");
    btn.querySelector(".sun").style.display = d ? "block" : "none";
    btn.querySelector(".moon").style.display = d ? "none" : "block";
  }
  if (btn) {
    btn.addEventListener("click", function () {
      var next = isDark() ? "light" : "dark";
      root.setAttribute("data-theme", next);
      save(next);
      paint();
    });
  }
  paint();

  // 지금 보고 있는 구역을 위 메뉴에 표시
  var links = [].slice.call(document.querySelectorAll(".nav a[href^='#']"));
  var secs = links.map(function (a) { return document.querySelector(a.getAttribute("href")); });
  function cur() {
    var y = window.scrollY + window.innerHeight * 0.3, idx = -1;
    secs.forEach(function (s, i) { if (s && s.offsetTop <= y) idx = i; });
    links.forEach(function (a, i) {
      if (i === idx) a.setAttribute("aria-current", "true"); else a.removeAttribute("aria-current");
    });
  }
  // 움직임 줄이기를 켠 사람에게는 영상을 멈춘 채로 둔다
  if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    [].forEach.call(document.querySelectorAll("video[autoplay]"), function (v) { v.removeAttribute("autoplay"); v.pause(); v.setAttribute("controls", ""); });
  } else {
    // 일부 브라우저가 autoplay 속성만으로는 시작하지 않아 한 번 더 부른다(소리 없음)
    [].forEach.call(document.querySelectorAll("video[autoplay]"), function (v) {
      v.muted = true;
      var p = v.play();
      if (p && p.catch) p.catch(function () { v.setAttribute("controls", ""); });
    });
  }
  window.addEventListener("scroll", cur, { passive: true });
  cur();
})();
