/* Why page: the room moves as you scroll. */
(function () {
  var $ = function (id) { return document.getElementById(id); };
  function retrigger(n, c) { n.classList.remove(c); void n.getBoundingClientRect(); n.classList.add(c); }

  // reveals
  var io = new IntersectionObserver(function (es) {
    es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
  }, { threshold: 0.2 });
  document.querySelectorAll(".reveal").forEach(function (el, i) {
    var sib = el.parentElement ? Array.prototype.indexOf.call(el.parentElement.children, el) : 0;
    el.style.transitionDelay = (Math.min(sib, 5) * 0.1) + "s";
    io.observe(el);
  });

  /* ---------- the vote ---------- */
  var box = $("ballots"), vote = $("vote"), gEl = $("g"), ngEl = $("ng"), line = $("vote-line");
  var cards = {};
  for (var n = 1; n <= 12; n++) {
    var c = document.createElement("button");
    c.type = "button"; c.className = "ballot" + (n === 8 ? " ng" : "");
    c.setAttribute("aria-label", "Juror " + n);
    c.innerHTML = '<i class="g"><b>' + n + '</b><small>Guilty</small></i><i class="n"><b>' + n + '</b><small>Not guilty</small></i>';
    c.addEventListener("click", (function (card) { return function () { card.classList.toggle("ng"); count(); }; })(c));
    box.appendChild(c); cards[n] = c;
  }
  var order = [9, 5, 11, 2, 6, 7, 12, 1, 10, 4, 3];   // Juror 3 holds out last
  var lines = [
    "It starts eleven to one. One man isn’t sure.",
    "He doesn’t say they’re wrong. He asks to talk it through.",
    "One by one, people find their own reasons to doubt.",
    "The room gets hotter. The holdouts get louder.",
    "The last one to move is the angriest. Then he moves too."
  ];
  var shownLine = -1, lastK = -1;
  function count() {
    var ng = Object.keys(cards).filter(function (k) { return cards[k].classList.contains("ng"); }).length;
    gEl.textContent = 12 - ng; ngEl.textContent = ng;
  }
  function setLine(i) {
    if (i === shownLine) return;
    shownLine = i; line.textContent = lines[i]; retrigger(line, "swap");
  }
  function onScroll() {
    var r = vote.getBoundingClientRect(), span = r.height - innerHeight;
    var p = span > 0 ? Math.min(1, Math.max(0, -r.top / span)) : 0;
    var k = Math.round(Math.min(1, Math.max(0, (p - 0.06) / 0.86)) * order.length);
    if (k !== lastK) {
      lastK = k;
      order.forEach(function (j, i) { cards[j].classList.toggle("ng", i < k); });
      cards[8].classList.add("ng");
      count();
    }
    setLine(k === 0 ? 0 : k <= 3 ? 1 : k <= 7 ? 2 : k <= 10 ? 3 : 4);
  }
  var t = false;
  addEventListener("scroll", function () { if (!t) { t = true; requestAnimationFrame(function () { onScroll(); t = false; }); } }, { passive: true });
  onScroll();

  /* ---------- the film strip loops ---------- */
  var strip = $("strip");
  if (strip) { var half = strip.children.length; strip.innerHTML += strip.innerHTML; Array.prototype.slice.call(strip.children, half).forEach(function (f) { f.setAttribute("aria-hidden", "true"); }); }

  /* ---------- cards and trophies ---------- */
  document.querySelectorAll(".dc").forEach(function (d) { d.addEventListener("click", function () { d.classList.toggle("flipped"); }); });
  document.querySelectorAll(".trophy").forEach(function (tr) {
    tr.addEventListener("click", function () {
      var open = tr.getAttribute("aria-expanded") === "true";
      tr.setAttribute("aria-expanded", open ? "false" : "true");
    });
  });
})();
