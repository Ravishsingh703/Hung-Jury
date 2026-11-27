/* HUNG JURY: next session's topic poll.
   Counts live in Abacus (https://abacus.jasoncameron.dev), a free counting
   service with no account: /hit adds one, /get reads the total.
   One vote per browser, remembered on the device. */
(function () {
  var E = window.EVENT || {};
  var P = E.poll;
  var section = document.getElementById("poll");
  if (!P || !section || !P.options || !P.options.length) return;
  section.hidden = false;

  var API = window.HJ_POLL_API || "https://abacus.jasoncameron.dev";
  var NS = "hungjury";
  var STORE = "hj-poll-" + P.id;
  var $ = function (id) { return document.getElementById(id); };
  var grid = $("poll-grid"), note = $("poll-note");

  $("poll-h").textContent = P.title;
  $("poll-say").textContent = P.say || "";

  function keyFor(o) { return P.id + "-" + o.key; }
  // Dev pass (?pass=juror8): unlimited test votes, nothing remembered.
  var DEV = /[?&]pass=juror8(&|$)/.test(location.search);
  function mine() { if (DEV) return null; try { return localStorage.getItem(STORE); } catch (e) { return null; } }
  function remember(k) { try { localStorage.setItem(STORE, k); } catch (e) {} }

  var cards = {};
  P.options.forEach(function (o, i) {
    var card = document.createElement("article");
    card.className = "poll-card reveal";
    card.innerHTML =
      '<figure class="noir-art poll-art">' + (window.HJ && window.HJ.pollArt ? window.HJ.pollArt(o.key) : "") + '</figure>' +
      '<p class="poll-name"></p>' +
      '<p class="poll-q"></p>' +
      '<div class="poll-result" hidden><div class="poll-bar"><i></i></div><span class="poll-pct"></span></div>' +
      '<button class="btn poll-vote" type="button">This one</button>';
    card.querySelector(".poll-name").textContent = String(i + 1).padStart(2, "0") + "  " + o.name;
    card.querySelector(".poll-q").textContent = o.q;
    card.querySelector(".poll-vote").addEventListener("click", function () { vote(o, card); });
    grid.appendChild(card);
    cards[o.key] = card;
  });

  function read(o) {
    return fetch(API + "/get/" + NS + "/" + keyFor(o))
      .then(function (r) { return r.status === 404 ? { value: 0 } : r.json(); })
      .then(function (d) { return d && typeof d.value === "number" ? d.value : 0; });
  }

  function show(counts) {
    var total = 0, top = 0;
    P.options.forEach(function (o) { total += counts[o.key] || 0; top = Math.max(top, counts[o.key] || 0); });
    var pick = DEV ? lastPick : mine();
    grid.classList.add("voted");
    P.options.forEach(function (o) {
      var c = cards[o.key], n = counts[o.key] || 0;
      var pct = total ? Math.round(n / total * 100) : 0;
      c.querySelector(".poll-vote").hidden = true;
      var res = c.querySelector(".poll-result");
      res.hidden = false;
      c.querySelector(".poll-pct").textContent = pct + "%" + "  ·  " + n + (n === 1 ? " vote" : " votes");
      requestAnimationFrame(function () { c.querySelector(".poll-bar i").style.width = pct + "%"; });
      c.classList.toggle("mine", pick === o.key);
      c.classList.toggle("lead", total > 0 && n === top);
    });
    note.textContent = total === 1 ? "1 vote in. Send the link round." :
      total + " votes in." + (P.open === false ? " Voting’s closed." : " Send the link round.");
  }

  function loadResults() {
    return Promise.all(P.options.map(read)).then(function (vals) {
      var counts = {};
      P.options.forEach(function (o, i) { counts[o.key] = vals[i]; });
      show(counts);
    });
  }

  var busy = false, lastPick = null;
  function vote(o, card) {
    if (busy || mine() || P.open === false) return;
    busy = true;
    grid.classList.add("busy");
    card.classList.add("picking");
    note.textContent = "Counting your vote…";
    fetch(API + "/hit/" + NS + "/" + keyFor(o))
      .then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); })
      .then(function () { lastPick = o.key; if (DEV) { return loadResults().then(again); } remember(o.key); return loadResults(); })
      .catch(function () { note.textContent = "Couldn’t count that one. Give it another go in a minute."; })
      .then(function () { busy = false; grid.classList.remove("busy"); card.classList.remove("picking"); });
  }

  // Dev pass: after the results show, bring the vote buttons back.
  function again() {
    P.options.forEach(function (o) { cards[o.key].querySelector(".poll-vote").hidden = false; });
    note.textContent += " Dev pass: vote again as much as you like.";
  }

  // Already voted, or voting closed: go straight to the results.
  if (mine() || P.open === false) {
    loadResults().catch(function () { note.textContent = "Results are taking a while. Try again shortly."; });
  }
})();
