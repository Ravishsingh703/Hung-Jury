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
  var flash = punchSvg.querySelector(".flash");
  function smash() {
    bulb.classList.add("broken");
    retrigger(flash, "pop");
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

  /* ---------- rule two: the court typewriter ---------- */
  var typer = $("typer"), paper = $("paper"), tally = $("note-tally"), forgetBtn = $("forget-btn"), ding = $("ding");
  var tKeys = typer.querySelectorAll(".k"), carriage = typer.querySelector(".carriage");
  var count = 0, typing = false;
  var lines = ["The idea. Not the person.", "Argue the point. Not the face.", "Again: the idea.", "We literally just said this.", "Not. The. Person.", "SERIOUSLY."];
  function strike() {
    var k = tKeys[Math.floor(Math.random() * tKeys.length)];
    k.classList.add("down"); setTimeout(function () { k.classList.remove("down"); }, 70);
    retrigger(typer, "jolt");
  }
  function typeLine() {
    if (typing) return;
    if (count >= lines.length) { paper.innerHTML = ""; count = 0; }
    typing = true; forgetBtn.disabled = true;
    var text = lines[count], last = count === lines.length - 1;
    var p = document.createElement("p"); p.className = "typing" + (last ? " loud" : "");
    paper.appendChild(p);
    var speed = Math.max(22, 80 - count * 12), n = 0;
    function next() {
      if (calm) { p.textContent = text; n = text.length; }
      if (n < text.length) {
        p.textContent += text[n++]; strike();
        carriage.style.transform = "translateX(" + (-n * 3) + "px)";
        return setTimeout(next, speed + Math.random() * speed * .6);
      }
      p.classList.remove("typing");
      retrigger(ding, "show");
      setTimeout(function () { carriage.style.transform = ""; }, 150);
      if (last) retrigger(typer, "jam");
      count++; typing = false; forgetBtn.disabled = false;
      tally.textContent = count === 1 ? "Reminded once." : "Reminded " + count + " times.";
      forgetBtn.textContent = count >= lines.length ? "Fresh sheet" : "Someone forgot";
    }
    next();
  }
  forgetBtn.addEventListener("click", typeLine);
  starters.r2 = typeLine;

  /* ---------- rule three: the table leans in for raw thoughts ---------- */
  var talk = $("talk"), bubble = $("bubble"), reacts = $("reacts"), talkTally = $("talk-tally");
  var nBorrowed = 0, nRaw = 0, talkTimers = [];
  var quotes = [
    ["As Kant put it, the moral law within us…", "Kant, 1788"],
    ["Studies show that people are mostly…", "a 2014 paper, probably"],
    ["Well, Nietzsche would say that…", "Nietzsche"],
    ["According to Aristotle, the virtuous man…", "Aristotle"],
    ["There’s a Harvard study that proves…", "citation needed"],
    ["Like Camus said, one must imagine…", "Camus"]
  ];
  var raws = ["From my own life, honestly…", "Gut says no. Here’s why.", "Half-formed, but hear me out…", "I used to think the opposite. Then…", "Okay, what if we flip it?", "This is going to sound weird, but…"];
  var cold = ["…and?", "*checks phone*", "but what do YOU think?", "zzz", "cool quote", "okay, Wikipedia"];
  var hot = ["ooh", "go on", "say more", "hold on…", "okay, that’s real", "hmm!", "keep going"];
  var seats = [63, 77.5, 96], anchor = ["-50%", "-50%", "-100%"];
  function pick(a) { return a[Math.floor(Math.random() * a.length)]; }
  function later(fn, ms) { talkTimers.push(setTimeout(fn, calm ? Math.min(ms, 300) : ms)); }
  function resetTalk() { talkTimers.forEach(clearTimeout); talkTimers = []; reacts.innerHTML = ""; bubble.className = "bubble"; bubble.hidden = true; talk.classList.remove("raw", "borrowed"); }
  function react(text, kind, seat, delay) {
    later(function () {
      var r = document.createElement("span");
      r.className = "react " + kind; r.textContent = text;
      r.style.left = seats[seat] + "%"; r.style.setProperty("--tx", anchor[seat]); r.style.top = [44, 31, 55][seat] + "%";
      r.addEventListener("animationend", function () { r.remove(); });
      reacts.appendChild(r);
    }, delay);
  }
  function sayBorrowed() {
    resetTalk(); var q = pick(quotes);
    bubble.innerHTML = ""; bubble.appendChild(document.createTextNode("“" + q[0] + "”"));
    var c = document.createElement("cite"); c.textContent = "— " + q[1]; bubble.appendChild(c);
    bubble.className = "bubble borrowed"; bubble.hidden = false;
    later(function () { talk.classList.add("borrowed"); }, 350);
    var lines = cold.slice().sort(function () { return Math.random() - .5; });
    react(lines[0], "cold", 0, 700); react(lines[1], "cold", 2, 1100);
    later(function () { bubble.classList.add("stamped"); }, 1300);
    later(function () { bubble.classList.add("dropped"); }, 2200);
    later(function () { talk.classList.remove("borrowed"); }, 3000);
    nBorrowed++; tallyTalk("borrowed");
  }
  function sayRaw() {
    resetTalk();
    bubble.textContent = pick(raws); bubble.className = "bubble raw"; bubble.hidden = false;
    later(function () { talk.classList.add("raw"); }, 250);
    var lines = hot.slice().sort(function () { return Math.random() - .5; });
    react(lines[0], "hot", 0, 600); react(lines[1], "hot", 1, 850); react(lines[2], "hot", 2, 1100);
    later(function () { bubble.classList.add("fade"); }, 3200);
    later(function () { talk.classList.remove("raw"); }, 3600);
    nRaw++; tallyTalk("raw");
  }
  function tallyTalk(last) {
    talkTally.textContent = last === "raw" ? "The table leans in. Raw thoughts: " + nRaw + "." : "Lost the table. Borrowed lines: " + nBorrowed + ".";
  }
  $("quote-btn").addEventListener("click", sayBorrowed);
  $("raw-btn").addEventListener("click", sayRaw);
  starters.r3 = function () { sayBorrowed(); setTimeout(function () { if (!nRaw) sayRaw(); }, calm ? 1200 : 3600); };

  /* ---------- rule four: the cards ---------- */
  var cards = document.querySelectorAll(".lose");
  cards.forEach(function (c) { c.addEventListener("click", function () { c.classList.toggle("flipped"); }); });
  starters.r4 = function () { cards.forEach(function (c, i) { setTimeout(function () { c.classList.add("flipped"); }, 900 + i * 650); }); };

  /* ---------- the host: what happens when you change your mind ---------- */
  var floor = $("floor"), you = floor.querySelector(".you"), over = $("overrule-btn");
  var steps = $("steps").querySelectorAll("li"), hostTimers = [], played = false;
  function step(n) { steps.forEach(function (li, i) { li.classList.toggle("on", i === n); li.classList.toggle("done", i < n); }); }
  function hostLater(fn, ms) { hostTimers.push(setTimeout(fn, calm ? ms / 4 : ms)); }
  function resetHost() {
    hostTimers.forEach(clearTimeout); hostTimers = [];
    floor.classList.remove("argued", "moved", "toasted", "dessert");
    you.classList.remove("rise", "cross", "sat");
    steps.forEach(function (li) { li.classList.remove("on", "done"); });
  }
  function runSwitch() {
    resetHost(); played = true; over.disabled = true;
    step(0);
    hostLater(function () { step(1); floor.classList.add("argued"); }, 1300);
    hostLater(function () { you.classList.add("rise"); }, 2300);
    hostLater(function () { you.classList.remove("rise"); you.classList.add("cross"); floor.classList.add("moved"); }, 2650);
    hostLater(function () { you.classList.remove("cross"); you.classList.add("sat"); }, 3600);
    hostLater(function () { step(2); floor.classList.add("toasted"); }, 4100);
    hostLater(function () { step(3); floor.classList.add("dessert"); }, 5600);
    hostLater(function () { over.disabled = false; over.textContent = "Run it back"; }, 6300);
  }
  over.addEventListener("click", runSwitch);
  starters.host = function () { if (!played) runSwitch(); };

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
