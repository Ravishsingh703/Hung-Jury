/* The jury table: a scripted argument you can walk into.
   Reads EVENT.sides and EVENT.script from event.js. */
(function () {
  var E = window.EVENT, svg = document.getElementById("table");
  if (!svg || !E || !E.script) return;
  var calm = window.HJ && window.HJ.calm;
  var NS = "http://www.w3.org/2000/svg";
  var SIDE = ["#e2231a", "#f5a524"];           // respected, liked
  var HEAD_Y = 216, TABLE_Y = 320, W = 900;
  svg.setAttribute("viewBox", "0 0 " + W + " 460");

  function mk(tag, attrs, parent) {
    var n = document.createElementNS(NS, tag);
    for (var k in attrs) n.setAttribute(k, attrs[k]);
    (parent || svg).appendChild(n); return n;
  }
  function retrigger(node, cls) { node.classList.remove(cls); void node.getBoundingClientRect(); node.classList.add(cls); }
  function pick(a) { return a[Math.floor(Math.random() * a.length)]; }

  /* ---------- the cast ---------- */
  var cast = [
    { n: 1, side: 0, x: 150, skin: "#f1c9a5", hair: "#2b1d16", style: "long",  woman: true },
    { n: 2, side: 0, x: 255, skin: "#8d5a3b", hair: "#1a1a1a", style: "short" },
    { n: 3, side: 0, x: 360, skin: "#e0ac7e", hair: "#5a3a22", style: "beard" },
    { n: 4, side: 1, x: 540, skin: "#6e4630", hair: "#1a1a1a", style: "bun",   woman: true },
    { n: 5, side: 1, x: 645, skin: "#f5d5b8", hair: "#c8a36a", style: "curly" },
    { n: 6, side: 1, x: 750, skin: "#c68a5e", hair: "#2b1d16", style: "pony",  woman: true }
  ];

  var scene = mk("g", { "class": "scene" });

  // the empty chair in the middle
  var chair = mk("g", { "class": "chair-empty" }, scene);
  mk("rect", { x: 412, y: 214, width: 76, height: 110, rx: 16, fill: "none", stroke: "rgba(255,255,255,.55)", "stroke-width": 3, "stroke-dasharray": "8 7" }, chair);
  var chairLabel = mk("text", { x: 450, y: 274, "text-anchor": "middle", fill: "rgba(255,255,255,.75)", "font-family": "Archivo, sans-serif", "font-weight": 750, "font-size": 17, "font-stretch": "85%" }, chair);
  chairLabel.textContent = "Empty";

  function drawPerson(p, parent) {
    var g = mk("g", { "class": "juror" }, parent);
    g.style.setProperty("--shirt", SIDE[p.side]);
    var cx = p.x, cy = HEAD_Y, right = p.n % 2 === 1;
    // arm (behind body)
    mk("rect", { x: right ? cx + 26 : cx - 42, y: 258, width: 16, height: 62, rx: 8, "class": "shirt arm " + (right ? "arm-r" : "arm-l") }, g);
    // hair behind the head
    if (p.style === "long") mk("rect", { x: cx - 31, y: cy - 24, width: 62, height: 70, rx: 26, fill: p.hair }, g);
    if (p.style === "pony") { mk("ellipse", { cx: cx + 28, cy: cy + 10, rx: 10, ry: 22, fill: p.hair }, g); }
    if (p.style === "bun") mk("circle", { cx: cx, cy: cy - 31, r: 13, fill: p.hair }, g);
    // body
    mk("rect", { x: cx - 40, y: 248, width: 80, height: 130, rx: 34, "class": "shirt" }, g);
    // head
    mk("circle", { cx: cx, cy: cy, r: 27, fill: p.skin }, g);
    // hair on top
    if (p.style === "curly") {
      for (var a = 190; a <= 350; a += 26) {
        var rad = a * Math.PI / 180;
        mk("circle", { cx: cx + Math.cos(rad) * 24, cy: cy + Math.sin(rad) * 24, r: 10, fill: p.hair }, g);
      }
    } else if (p.style !== "beard") {
      mk("path", { d: "M" + (cx - 27) + " " + (cy - 4) + " a27 27 0 0 1 54 0 q-27 -14 -54 0z", fill: p.hair }, g);
    } else {
      mk("path", { d: "M" + (cx - 24) + " " + (cy + 4) + " q24 36 48 0 q-4 16 -24 18 q-20 -2 -24 -18z", fill: p.hair }, g);
      mk("path", { d: "M" + (cx - 26) + " " + (cy - 8) + " a27 27 0 0 1 52 0 q-26 -9 -52 0z", fill: p.hair }, g);
    }
    if (p.woman) {
      mk("circle", { cx: cx - 27, cy: cy + 8, r: 3, fill: "#f5a524" }, g);
      mk("circle", { cx: cx + 27, cy: cy + 8, r: 3, fill: "#f5a524" }, g);
    }
    // face
    mk("line", { x1: cx - 15, y1: cy - 9, x2: cx - 4, y2: cy - 8, "class": "brow brow-l" }, g);
    mk("line", { x1: cx + 4, y1: cy - 8, x2: cx + 15, y2: cy - 9, "class": "brow brow-r" }, g);
    mk("circle", { cx: cx - 9, cy: cy + 2, r: 2.7, "class": "eye" }, g);
    mk("circle", { cx: cx + 9, cy: cy + 2, r: 2.7, "class": "eye" }, g);
    mk("path", { d: "M" + (cx - 7) + " " + (cy + 14) + " h14", "class": "lips" }, g);
    mk("ellipse", { cx: cx, cy: cy + 15, rx: 8, ry: 6, "class": "mouth" }, g);
    mk("path", { d: "M" + (cx + 20) + " " + (cy - 14) + " q5 8 0 12 q-5 -4 0 -12z", fill: "#8fd3ff", "class": "sweat" }, g);
    p.g = g;
    return g;
  }
  cast.forEach(function (p) { drawPerson(p, scene); });

  /* ---------- the table ---------- */
  var board = mk("g", { "class": "board" }, scene);
  mk("rect", { x: 40, y: TABLE_Y, width: 820, height: 24, rx: 9, fill: "#5e3a2e" }, board);
  mk("rect", { x: 62, y: TABLE_Y + 24, width: 776, height: 116, fill: "#2e1b17" }, board);
  [["Respected", 255], ["Liked", 645]].forEach(function (t, i) {
    var tx = mk("text", { x: t[1], y: 420, "text-anchor": "middle", fill: SIDE[i], opacity: .28, "font-family": "Archivo, sans-serif", "font-weight": 900, "font-size": 56, "font-stretch": "70%" }, board);
    tx.textContent = E.sides[i];
  });
  var puddle = mk("ellipse", { cx: 708, cy: TABLE_Y + 9, rx: 80, ry: 7, fill: "#7a3e17", "class": "puddle" }, board);
  var papers = [[110, TABLE_Y + 4], [300, TABLE_Y + 6], [560, TABLE_Y + 3], [770, TABLE_Y + 5]].map(function (q) {
    return mk("rect", { x: q[0], y: q[1], width: 50, height: 9, rx: 2, fill: "#efe9df", "class": "paper" }, board);
  });
  var cup = mk("g", { "class": "cup" }, board);
  mk("path", { d: "M668 " + (TABLE_Y - 24) + " h22 v18 a6 6 0 0 1 -6 6 h-10 a6 6 0 0 1 -6 -6z", fill: "#ece8e2" }, cup);
  mk("path", { d: "M690 " + (TABLE_Y - 19) + " a6 6 0 0 1 0 12", fill: "none", stroke: "#ece8e2", "stroke-width": 3.5 }, cup);
  mk("path", { d: "M675 " + (TABLE_Y - 32) + " q4 -6 0 -12 M683 " + (TABLE_Y - 32) + " q4 -6 0 -12", fill: "none", stroke: "rgba(255,255,255,.45)", "stroke-width": 2.5, "stroke-linecap": "round", "class": "steam" }, cup);

  // tent cards with juror numbers
  function tent(p, label) {
    var t = mk("g", { "class": "tent" }, board);
    mk("rect", { x: p.x - 24, y: TABLE_Y - 20, width: 48, height: 24, rx: 4, fill: "#ece8e2", stroke: SIDE[p.side], "stroke-width": 4, "class": "tent-card" }, t);
    var tx = mk("text", { x: p.x, y: TABLE_Y - 2, "text-anchor": "middle", fill: "#22060a", "font-family": "Archivo, sans-serif", "font-weight": 850, "font-size": 16, "font-stretch": "80%" }, t);
    tx.textContent = label;
    p.tent = t;
  }
  cast.forEach(function (p) { tent(p, p.n); });

  var fx = mk("g", { "class": "fx" });

  /* ---------- speech ---------- */
  function wrap(text, max) {
    var words = text.split(" "), lines = [], cur = "";
    words.forEach(function (w) {
      if ((cur + " " + w).trim().length > max) { lines.push(cur.trim()); cur = w; }
      else cur += " " + w;
    });
    lines.push(cur.trim());
    return lines;
  }
  var active = [];
  function say(p, text, loud) {
    var lines = wrap(text, loud ? 18 : 24), size = loud ? 21 : 18, lh = size + 5;
    var longest = Math.max.apply(null, lines.map(function (l) { return l.length; }));
    var w = longest * (loud ? 12.2 : 9.8) + 34, h = lines.length * lh + 18;
    var lift = p.g.classList.contains("standing") ? 46 : 0;
    var top = HEAD_Y - 27 - lift - 16 - h;
    var x = Math.max(6, Math.min(W - 6 - w, p.x - w / 2)), y = Math.max(4, top);
    active = active.filter(function (a) {
      if (!a.b.isConnected) return false;
      if (x < a.x2 + 12 && x + w > a.x1 - 12) { a.b.remove(); return false; }
      return true;
    });
    var b = mk("g", { "class": "bubble" + (loud ? " loud" : "") }, fx);
    active.push({ b: b, x1: x, x2: x + w });
    if (loud) {
      mk("path", { d: "M" + x + " " + (y + h / 2) + " l10 " + (-h / 2) + " h" + (w - 20) + " l10 " + h / 2 + " l-10 " + h / 2 + " h" + (-(w - 20)) + "z", fill: "#fff" }, b);
    } else {
      mk("rect", { x: x, y: y, width: w, height: h, rx: 18, fill: "#fff" }, b);
    }
    mk("path", { d: "M" + (p.x - 8) + " " + (y + h - 1) + " l8 12 l8 -12z", fill: "#fff" }, b);
    lines.forEach(function (l, i) {
      var t = mk("text", { x: x + w / 2, y: y + 9 + lh * (i + 1) - 6, "text-anchor": "middle", fill: loud ? "#e2231a" : "#22060a", "font-family": "Archivo, sans-serif", "font-weight": loud ? 850 : 700, "font-size": size, "font-stretch": "82%" }, b);
      t.textContent = l;
    });
    requestAnimationFrame(function () { b.classList.add("on"); });
    return b;
  }

  var transcript = document.getElementById("transcript");
  var typing;
  function note(who, text) {
    if (!transcript) return;
    clearInterval(typing);
    transcript.innerHTML = "";
    var b = document.createElement("b"); b.textContent = who; transcript.appendChild(b);
    var span = document.createElement("span"); transcript.appendChild(span);
    if (calm) { span.textContent = text; return; }
    var i = 0;
    typing = setInterval(function () { span.textContent = text.slice(0, ++i); if (i >= text.length) clearInterval(typing); }, 22);
  }

  function burst(x, y, word) {
    var g = mk("g", { "class": "burst" }, fx), pts = [];
    for (var k = 0; k < 16; k++) {
      var r = k % 2 ? 26 : 52, a = Math.PI * 2 * k / 16;
      pts.push((x + Math.cos(a) * r * 1.5).toFixed(1) + "," + (y + Math.sin(a) * r).toFixed(1));
    }
    mk("polygon", { points: pts.join(" "), fill: "#f5a524", stroke: "#22060a", "stroke-width": 3 }, g);
    var t = mk("text", { x: x, y: y + 9, "text-anchor": "middle", fill: "#22060a", "font-family": "Archivo, sans-serif", "font-weight": 900, "font-size": 26, "font-stretch": "70%" }, g);
    t.textContent = word;
    setTimeout(function () { g.remove(); }, 900);
  }

  var spilt = false;
  function slamTable(x) {
    retrigger(board, "shake");
    burst(x, TABLE_Y - 8, pick(["BANG", "SLAM", "THUD"]));
    papers.forEach(function (pp) { retrigger(pp, "hop"); });
    if (!spilt) {
      spilt = true; cup.classList.add("spilt"); puddle.classList.add("on");
      setTimeout(function () { cup.classList.remove("spilt"); puddle.classList.remove("on"); spilt = false; }, 6500);
    }
  }

  var MOODS = ["talking", "standing", "laugh", "slam", "angry", "hurt"];
  function clearMood(p) { MOODS.forEach(function (c) { p.g.classList.remove(c); }); }

  function setSide(p, side) {
    p.side = side;
    p.g.style.setProperty("--shirt", SIDE[side]);
    if (p.tent) {
      p.tent.querySelector(".tent-card").setAttribute("stroke", SIDE[side]);
      retrigger(p.tent, "flip");
    }
  }

  function perform(p, mood, text, dur) {
    clearMood(p);
    var loud = mood === "slam" || mood === "stand" || mood === "shout" || /[A-Z]{3,}/.test(text);
    var cls = { talk: ["talking"], shout: ["talking", "angry"], stand: ["talking", "standing", "angry"], slam: ["talking", "slam", "angry"],
                laugh: ["laugh"], hurt: ["hurt"], "switch": ["talking"], cheer: ["talking"] }[mood] || ["talking"];
    cls.forEach(function (c) { p.g.classList.add(c); });
    var b = say(p, text, loud);
    if (mood === "slam") setTimeout(function () { slamTable(p.x); }, 260);
    if (mood === "switch") setTimeout(function () { setSide(p, 1 - p.side); }, 700);
    if (mood === "cheer") {
      cast.concat(you ? [you] : []).forEach(function (q) { if (q !== p && q.side === p.side) { q.g.classList.add("laugh"); setTimeout(function () { q.g.classList.remove("laugh"); }, dur); } });
    }
    setTimeout(function () {
      b.classList.remove("on"); clearMood(p);
      setTimeout(function () { b.remove(); }, 300);
    }, dur);
  }

  /* ---------- the script ---------- */
  var step = 0, timer = null, running = false, origin = cast.map(function (p) { return p.side; });
  var DUR = { talk: 2600, shout: 2600, stand: 3000, slam: 2800, laugh: 2300, hurt: 2000, "switch": 3200, cheer: 2800 };

  function next() {
    if (step >= E.script.length) {
      // the night resets: everyone back to their opening seats
      step = 0;
      cast.forEach(function (p, i) { if (p.side !== origin[i]) setSide(p, origin[i]); });
      note("The court", "A new night. Same question.");
      timer = setTimeout(next, 2600);
      return;
    }
    var line = E.script[step++], p = cast[line.j - 1];
    if (!p) { timer = setTimeout(next, 100); return; }
    var dur = DUR[line.mood] || 2600;
    perform(p, line.mood, line.say, dur - 300);
    note("Juror " + p.n, line.say);
    timer = setTimeout(next, dur);
  }
  function hold(ms) { clearTimeout(timer); timer = setTimeout(next, ms); }

  /* ---------- you ---------- */
  var you = null;
  var KEY = "hj-vote-" + E.session;
  function store(v) { try { localStorage.setItem(KEY, JSON.stringify(v)); } catch (e) {} }
  function load() { try { return JSON.parse(localStorage.getItem(KEY)); } catch (e) { return null; } }

  function sitDown(silent) {
    if (you) return;
    chair.classList.add("taken");
    you = { n: "You", side: -1, x: 450, skin: "#d9a57c", hair: "#2b1d16", style: "short" };
    var g = drawPerson(you, scene);
    scene.insertBefore(g, board);
    g.classList.add("arrive", "undecided");
    tent(you, "You");
    if (!silent) {
      hold(3200);
      perform(cast[0], "talk", "Finally. Someone with sense.", 2200);
      setTimeout(function () { perform(cast[4], "laugh", "Sit with us. We have snacks.", 2200); }, 1100);
      note("The court", "A new juror takes the empty chair.");
    }
  }
  function choose(side, silent) {
    var was = you.side;
    you.g.classList.remove("undecided");
    setSide(you, side);
    var mine = cast.filter(function (p) { return p.side === side; });
    var theirs = cast.filter(function (p) { return p.side !== side; });
    if (!silent) {
      hold(3400);
      if (was === -1) {
        perform(pick(mine), "talk", pick(["Welcome to the right side.", "Good. You’re one of us.", "Smart. Sit.", "Knew it."]), 2400);
        setTimeout(function () { perform(pick(theirs), "laugh", pick(["Pfft. Enjoy being wrong.", "HA. Give it an hour.", "Oh, you’re one of THOSE."]), 2400); }, 900);
        note("The court", "You walked in saying " + E.sides[side] + ". We’ll see if you still are at 9.");
      } else {
        perform(pick(mine), "stand", pick(["OHHH! A defector!", "Welcome over!", "MIND CHANGED!"]), 2600);
        setTimeout(function () { perform(pick(theirs), "hurt", "…traitor.", 2200); }, 900);
        note("The court", "You crossed the floor. That’s what we’re here for.");
      }
    }
    var v = load() || {};
    v.first = v.first === undefined ? side : v.first;
    v.now = side; v.switches = (v.switches || 0) + (was !== -1 && was !== side ? 1 : 0);
    store(v);
    renderControls();
  }

  /* ---------- controls ---------- */
  var controls = document.getElementById("seat");
  function btn(label, fn, cls) {
    var b = document.createElement("button");
    b.type = "button"; b.className = "btn " + (cls || ""); b.textContent = label;
    b.addEventListener("click", fn); return b;
  }
  function renderControls() {
    if (!controls) return;
    controls.innerHTML = "";
    var row = document.createElement("div"); row.className = "seat-row";
    if (!you) {
      row.appendChild(btn("Take the empty chair", function () { sitDown(false); renderControls(); }, "hot"));
      row.appendChild(btn("Slam the table", userSlam, "ghost"));
      controls.appendChild(row);
      var hint = document.createElement("p"); hint.className = "seat-hint";
      hint.textContent = "Or poke a juror. They love that.";
      controls.appendChild(hint);
    } else if (you.side === -1) {
      var q = document.createElement("p"); q.className = "seat-q"; q.textContent = "Where do you sit?";
      controls.appendChild(q);
      E.sides.forEach(function (s, i) { row.appendChild(btn(s, function () { choose(i); }, "side side-" + i)); });
      controls.appendChild(row);
    } else {
      var st = document.createElement("p"); st.className = "seat-q";
      st.innerHTML = "You’re sitting with <b></b>.";
      st.querySelector("b").textContent = E.sides[you.side];
      controls.appendChild(st);
      row.appendChild(btn("Cross the floor", function () { choose(1 - you.side); }, "hot"));
      row.appendChild(btn("Slam the table", userSlam, "ghost"));
      controls.appendChild(row);
    }
  }
  function userSlam() {
    hold(2600);
    slamTable(you ? you.x : 450);
    var p = pick(cast);
    perform(p, "stand", pick(["WHOA.", "EASY!", "Okay, okay!", "Who did that?"]), 2000);
    note("The court", "Someone slammed the table. It was you.");
  }
  // poke a juror
  cast.forEach(function (p) {
    p.g.style.cursor = "pointer";
    p.g.addEventListener("click", function () {
      hold(2600);
      perform(p, pick(["talk", "laugh", "shout"]), pick(["Don’t poke me.", "Excuse me?", "I’m MID-ARGUMENT.", "Do you mind?", "Pick a side first."]), 2000);
      note("Juror " + p.n, "Has been poked. Is not happy about it.");
    });
  });
  board.style.cursor = "pointer";
  board.addEventListener("click", function () { userSlam(); });

  /* ---------- start when seen ---------- */
  var saved = load();
  if (saved && saved.now !== undefined) { sitDown(true); choose(saved.now, true); }
  renderControls();

  function start() { if (running) return; running = true; note("The court", "The jury is seated. Arguments begin."); timer = setTimeout(next, 1200); }
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (es) { if (es[0].isIntersecting) { start(); io.disconnect(); } }, { threshold: 0.3 });
    io.observe(svg);
  } else start();

  window.HJ = window.HJ || {};
  window.HJ.vote = load;
})();
