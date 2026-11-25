/* The rules page: each rule gets a toy to play with. */
(function () {
  var calm = window.HJ && window.HJ.calm;
  var $ = function (id) { return document.getElementById(id); };
  function retrigger(n, c) { n.classList.remove(c); void n.getBoundingClientRect(); n.classList.add(c); }
  function rand(a, b) { return a + Math.random() * (b - a); }

  // headlines land one word at a time
  document.querySelectorAll(".slam").forEach(function (h) {
    var words = h.textContent.trim().split(/\s+/);
    h.setAttribute("aria-label", h.textContent.trim());
    h.textContent = "";
    words.forEach(function (w, i) {
      var s = document.createElement("span");
      s.className = "w"; s.style.setProperty("--i", i); s.textContent = w; s.setAttribute("aria-hidden", "true");
      h.appendChild(s);
      if (i < words.length - 1) h.appendChild(document.createTextNode(" "));
    });
  });

  /* ---------- reveal, rail, progress ---------- */
  var starters = {};
  var rules = document.querySelectorAll(".rule");
  var railLinks = {};
  document.querySelectorAll(".rail a").forEach(function (a) { railLinks[a.dataset.for] = a; });
  var order = ["r1", "r2", "r3", "r4", "host", "oath"];

  var io = new IntersectionObserver(function (es) {
    es.forEach(function (e) {
      if (!e.isIntersecting) return;
      var r = e.target;
      if (!r.classList.contains("in")) {
        r.classList.add("in");
        if (starters[r.id]) setTimeout(starters[r.id], 700);
      }
    });
  }, { threshold: 0.3 });
  rules.forEach(function (r) { io.observe(r); });

  var railIO = new IntersectionObserver(function (es) {
    es.forEach(function (e) {
      if (!e.isIntersecting) return;
      var idx = order.indexOf(e.target.id);
      order.forEach(function (id, i) {
        var a = railLinks[id]; if (!a) return;
        a.classList.toggle("on", i === idx);
        a.classList.toggle("done", i < idx);
      });
    });
  }, { rootMargin: "-45% 0px -45% 0px" });
  rules.forEach(function (r) { railIO.observe(r); });

  var nums = document.querySelectorAll(".num"), bar = $("bar"), tick = false;
  function onScroll() {
    var max = document.documentElement.scrollHeight - innerHeight;
    bar.style.setProperty("--p", (max > 0 ? scrollY / max * 100 : 0).toFixed(1) + "%");
    if (!calm) nums.forEach(function (n) {
      var r = n.parentElement.getBoundingClientRect();
      n.style.setProperty("--p", ((r.top + r.height / 2 - innerHeight / 2) * -0.35).toFixed(1));
    });
    tick = false;
  }
  addEventListener("scroll", function () { if (!tick) { tick = true; requestAnimationFrame(onScroll); } }, { passive: true });
  onScroll();

  /* ---------- rule one: hit the idea, never the person ---------- */
  var NS = "http://www.w3.org/2000/svg";
  var punchSvg = $("punch"), glove = punchSvg.querySelector(".glove"), bulb = punchSvg.querySelector(".bulb");
  var shards = punchSvg.querySelector(".shards"), noSign = punchSvg.querySelector(".no-sign");
  function smash() {
    bulb.classList.add("broken");
    for (var k = 0; k < 10; k++) {
      var a = Math.PI * 2 * k / 10 + rand(-.2, .2), d = rand(60, 130);
      var p = document.createElementNS(NS, "polygon");
      var x = 120 + Math.cos(a) * 30, y = 150 + Math.sin(a) * 30;
      p.setAttribute("points", [x, y, x + rand(6, 16), y + rand(-4, 10), x + rand(-6, 6), y + rand(8, 18)].map(function (n) { return n.toFixed(1); }).join(","));
      p.setAttribute("fill", k % 2 ? "#ffe9a8" : "#ffffff");
      p.setAttribute("class", "shard");
      p.style.setProperty("--dx", (Math.cos(a) * d).toFixed(0) + "px");
      p.style.setProperty("--dy", (Math.sin(a) * d).toFixed(0) + "px");
      p.style.setProperty("--r", rand(-300, 300).toFixed(0) + "deg");
      shards.appendChild(p);
    }
    setTimeout(function () { shards.innerHTML = ""; }, 1000);
    setTimeout(function () { bulb.classList.remove("broken"); }, 1800);
  }
  function punch() {
    bulb.classList.remove("broken");
    retrigger(glove, "hit");
    setTimeout(smash, calm ? 0 : 410);
  }
  function hitPerson() {
    glove.classList.remove("hit");
    retrigger(glove, "refuse");
    setTimeout(function () { noSign.classList.add("show"); }, calm ? 0 : 380);
    setTimeout(function () { noSign.classList.remove("show"); }, 1600);
  }
  $("punch-btn").addEventListener("click", punch);
  $("person-btn").addEventListener("click", hitPerson);
  punchSvg.querySelector(".bulb").addEventListener("click", punch);
  punchSvg.querySelector(".who").addEventListener("click", hitPerson);
  punchSvg.querySelector(".bulb").style.cursor = "pointer";
  punchSvg.querySelector(".who").style.cursor = "pointer";
  starters.r1 = punch;

  /* ---------- rule two: someone always forgets ---------- */
  var notes = $("notes"), tally = $("note-tally"), count = 0;
  var lines = ["The idea. Not the person.", "Argue the point. Not the face.", "Again: the idea.", "We literally just said this.", "Not. The. Person.", "SERIOUSLY."];
  function slapNote() {
    if (count >= lines.length) { notes.innerHTML = ""; count = 0; }
    var n = document.createElement("div");
    var last = count === lines.length - 1;
    n.className = "note" + (last ? " loud" : "");
    n.textContent = lines[count];
    n.style.left = rand(3, last ? 30 : 48) + "%";
    n.style.top = rand(4, last ? 30 : 52) + "%";
    n.style.setProperty("--rot", rand(-12, 12).toFixed(1) + "deg");
    notes.appendChild(n);
    count++;
    tally.textContent = count === 1 ? "Reminded once." : "Reminded " + count + " times.";
    $("forget-btn").textContent = count >= lines.length ? "Start fresh" : "Someone forgot";
  }
  $("forget-btn").addEventListener("click", slapNote);
  starters.r2 = slapNote;

  /* ---------- rule three: raw thoughts out, borrowed ones binned ---------- */
  var mind = $("mind"), bin = mind.querySelector(".bin"), binned = 0, thinking = null, quoting = null;
  var raw = ["what if…", "hmm, no", "okay, hear me out", "wait.", "but why though?", "actually…", "I think…", "no, listen", "unless…", "here’s the thing", "gut says no", "flip it:", "from my own life…", "I used to think…"];
  function think() {
    var t = document.createElement("span");
    t.className = "thought";
    t.textContent = raw[Math.floor(Math.random() * raw.length)];
    t.style.left = rand(4, 9) + "rem";
    t.style.bottom = rand(10, 12) + "rem";
    t.style.setProperty("--dx", rand(-1, 10).toFixed(1) + "rem");
    t.addEventListener("animationend", function () { t.remove(); });
    mind.appendChild(t);
  }
  function quote() {
    if (mind.querySelectorAll(".quote:not(.binned)").length >= 3) return;
    var q = document.createElement("button");
    q.type = "button"; q.className = "quote";
    q.textContent = Math.random() < .5 ? "“" : "”";
    q.setAttribute("aria-label", "A borrowed quote. Bin it.");
    q.style.left = rand(40, 72) + "%";
    q.style.top = rand(6, 50) + "%";
    q.style.animationDelay = rand(0, 1) + "s";
    q.addEventListener("click", function () {
      var a = q.getBoundingClientRect(), b = bin.getBoundingClientRect();
      q.style.transform = "translate(" + (b.left + b.width / 2 - a.left - a.width / 2) + "px," + (b.top + 10 - a.top - a.height / 2) + "px) scale(.25) rotate(180deg)";
      q.classList.add("binned");
      setTimeout(function () { q.remove(); retrigger(bin, "gulp"); }, 550);
      binned++;
      $("bin-tally").textContent = binned === 1 ? "One borrowed thought binned." : binned + " borrowed thoughts binned. Good.";
    });
    mind.appendChild(q);
  }
  var mindIO = new IntersectionObserver(function (es) {
    if (es[0].isIntersecting) {
      if (!thinking) { think(); quote(); thinking = setInterval(think, calm ? 2200 : 950); quoting = setInterval(quote, 2400); }
    } else { clearInterval(thinking); clearInterval(quoting); thinking = quoting = null; }
  }, { threshold: 0.2 });
  mindIO.observe(mind);

  /* ---------- rule four: the cards ---------- */
  var cards = document.querySelectorAll(".lose");
  cards.forEach(function (c) { c.addEventListener("click", function () { c.classList.toggle("flipped"); }); });
  starters.r4 = function () { cards.forEach(function (c, i) { setTimeout(function () { c.classList.add("flipped"); }, 900 + i * 650); }); };

  /* ---------- the host ---------- */
  var podium = $("podium"), over = $("overrule-btn");
  over.addEventListener("click", function () {
    var on = podium.classList.toggle("overruled");
    over.textContent = on ? "Put the crown back" : "Change your mind";
  });

  /* ---------- the oath ---------- */
  var hold = $("hold"), ring = $("ring"), holdText = $("hold-text"), sworn = $("sworn"), conf = $("confetti");
  var C = 339.3, LEN = 1600, start = 0, raf = 0, done = false;
  function swear(quiet) {
    done = true; hold.hidden = true; sworn.hidden = false;
    $("oath-sub").textContent = quiet ? "You’re already sworn in." : "Done. No take-backs.";
    try { localStorage.setItem("hj-sworn", new Date().toISOString()); } catch (e) {}
    if (quiet || calm) return;
    var cols = ["#e2231a", "#f5a524", "#ffffff", "#ff4d1c"];
    for (var k = 0; k < 70; k++) {
      var c = document.createElement("i"); c.className = "cf";
      c.style.left = rand(0, 100) + "%";
      c.style.setProperty("--c", cols[k % cols.length]);
      c.style.setProperty("--dx", rand(-120, 120).toFixed(0) + "px");
      c.style.setProperty("--r", rand(-720, 720).toFixed(0) + "deg");
      c.style.setProperty("--t", rand(1.6, 3.2).toFixed(2) + "s");
      c.style.animationDelay = rand(0, .4) + "s";
      conf.appendChild(c);
    }
    setTimeout(function () { conf.innerHTML = ""; }, 4200);
  }
  function frame(now) {
    var p = Math.min(1, (now - start) / LEN);
    ring.style.strokeDashoffset = (C * (1 - p)).toFixed(1);
    holdText.textContent = p < .4 ? "Keep holding…" : p < .8 ? "Mean it…" : "Almost…";
    if (p >= 1) { hold.classList.remove("pressing"); swear(false); return; }
    raf = requestAnimationFrame(frame);
  }
  function down(e) { if (done) return; if (e) e.preventDefault(); hold.classList.add("pressing"); start = performance.now(); raf = requestAnimationFrame(frame); }
  function up() {
    if (done) return;
    cancelAnimationFrame(raf); hold.classList.remove("pressing");
    ring.style.transition = "stroke-dashoffset .4s"; ring.style.strokeDashoffset = C;
    setTimeout(function () { ring.style.transition = ""; }, 400);
    holdText.textContent = "Not yet. Hold it.";
  }
  hold.addEventListener("pointerdown", down);
  ["pointerup", "pointerleave", "pointercancel"].forEach(function (ev) { hold.addEventListener(ev, up); });
  hold.addEventListener("keydown", function (e) { if ((e.key === " " || e.key === "Enter") && !e.repeat) down(e); });
  hold.addEventListener("keyup", function (e) { if (e.key === " " || e.key === "Enter") up(); });
  try { if (localStorage.getItem("hj-sworn")) swear(true); } catch (e) {}
})();
