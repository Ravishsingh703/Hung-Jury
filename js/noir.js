/* Noir scenes and particles. Builds the art into any element with data-noir. */
(function () {
  window.HJ = window.HJ || {};
  var calm = !!window.HJ.calm;

  /* Particles: little divs that fly out from a point inside a positioned box. */
  window.HJ.spray = function (box, x, y, opts) {
    if (calm) return;
    opts = opts || {};
    var n = opts.n || 14, cols = opts.colors || ["#e2231a", "#b3120f", "#ff6a5a"], spread = opts.spread || 90;
    for (var k = 0; k < n; k++) {
      var b = document.createElement("i");
      b.className = "spark";
      var a = opts.up ? Math.PI + Math.random() * Math.PI : Math.random() * Math.PI * 2;
      var d = spread * (.4 + Math.random() * .6);
      b.style.left = x + "px"; b.style.top = y + "px";
      b.style.setProperty("--dx", (Math.cos(a) * d).toFixed(0) + "px");
      b.style.setProperty("--dy", (Math.sin(a) * d + (opts.fall ? 40 : 0)).toFixed(0) + "px");
      b.style.setProperty("--s", (3 + Math.random() * (opts.size || 7)).toFixed(0) + "px");
      b.style.setProperty("--c", cols[k % cols.length]);
      b.style.setProperty("--t", (.6 + Math.random() * .6).toFixed(2) + "s");
      box.appendChild(b);
      setTimeout(function (el) { return function () { el.remove(); }; }(b), 1400);
    }
  };

  function motes(n, x0, x1, y0, y1) {
    var out = "";
    for (var k = 0; k < n; k++) {
      var x = x0 + Math.random() * (x1 - x0), y = y0 + Math.random() * (y1 - y0);
      out += '<circle class="mote" cx="' + x.toFixed(0) + '" cy="' + y.toFixed(0) + '" r="' + (0.8 + Math.random() * 1.6).toFixed(1) +
        '" style="animation-delay:-' + (Math.random() * 9).toFixed(1) + 's;animation-duration:' + (7 + Math.random() * 6).toFixed(1) + 's"/>';
    }
    return out;
  }

  // a man in a hat and coat; feet at 0,0
  var MAN = '<g id="nr-man">' +
    '<ellipse cx="0" cy="-158" rx="23" ry="4.5"/><rect x="-14" y="-179" width="28" height="22" rx="5"/>' +
    '<circle cx="0" cy="-145" r="12"/>' +
    '<path d="M-9 -135 h18 l18 14 l6 66 l-10 2 l-4 -40 l-2 58 h-34 l-2 -58 l-4 40 l-10 -2 l6 -66z"/>' +
    '<rect x="-15" y="-35" width="11" height="35" rx="2"/><rect x="4" y="-35" width="11" height="35" rx="2"/></g>';
  // the same man, hat off (for the jester)
  var BARE = '<g id="nr-bare"><circle cx="0" cy="-145" r="12"/>' +
    '<path d="M-9 -135 h18 l18 14 l6 66 l-10 2 l-4 -40 l-2 58 h-34 l-2 -58 l-4 40 l-10 -2 l6 -66z"/>' +
    '<rect x="-15" y="-35" width="11" height="35" rx="2"/><rect x="4" y="-35" width="11" height="35" rx="2"/></g>';
  // a bystander; feet at 0,0
  var FIG = '<g id="nr-fig"><circle cx="0" cy="-66" r="9"/><path d="M-8 -56 h16 q8 2 9 14 l3 42 h-40 l3 -42 q1 -12 9 -14z"/></g>';

  /* The two sides: one man, two shadows. */
  function sides(el) {
    var S = (window.EVENT && window.EVENT.sides) || ["Respected", "Liked"];
    el.innerHTML =
      '<svg viewBox="0 0 400 480" role="img" aria-label="A man under a street lamp casting two shadows. One stands alone among people turning their backs. The other wears a jester’s hat among people laughing.">' +
      '<defs>' + MAN + BARE + FIG +
        '<radialGradient id="nr-gl" cx="25%" cy="45%" r="45%"><stop offset="0" stop-color="#e2231a" stop-opacity=".95"/><stop offset=".6" stop-color="#7d0b10" stop-opacity=".55"/><stop offset="1" stop-color="#7d0b10" stop-opacity="0"/></radialGradient>' +
        '<radialGradient id="nr-gr" cx="75%" cy="45%" r="45%"><stop offset="0" stop-color="#f5a524" stop-opacity=".9"/><stop offset=".6" stop-color="#8a4a08" stop-opacity=".5"/><stop offset="1" stop-color="#8a4a08" stop-opacity="0"/></radialGradient>' +
        '<linearGradient id="nr-cone" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff1d6" stop-opacity=".55"/><stop offset="1" stop-color="#fff1d6" stop-opacity="0"/></linearGradient>' +
        '<linearGradient id="nr-floor" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1a0405"/><stop offset="1" stop-color="#050101"/></linearGradient>' +
      '</defs>' +
      '<rect width="400" height="480" fill="#050101"/>' +
      '<rect class="glow-l" width="400" height="340" fill="url(#nr-gl)"/>' +
      '<rect class="glow-r" width="400" height="340" fill="url(#nr-gr)"/>' +
      '<rect y="330" width="400" height="150" fill="url(#nr-floor)"/>' +
      '<line x1="0" y1="330" x2="400" y2="330" stroke="rgba(255,255,255,.12)"/>' +
      // the shadows on the wall
      '<g fill="#000" opacity=".75"><polygon points="188,440 204,440 106,330 84,330"/><polygon points="196,440 212,440 318,330 296,330"/></g>' +
      // respected: tall, alone, backs turned
      '<use href="#nr-man" transform="translate(95 330) scale(1.3)" fill="#1c0203"/>' +
      '<g fill="#140102"><use href="#nr-fig" transform="translate(28 330)"/><use href="#nr-fig" transform="translate(162 330) scale(.92)"/></g>' +
      '<g fill="#e2231a" font-family="Newsreader, Georgia, serif" font-style="italic" font-size="15"><text class="ugh" x="14" y="250">ugh</text><text class="ugh ugh2" x="150" y="256">ugh</text></g>' +
      // liked: jester hat, laughing crowd
      '<use href="#nr-bare" transform="translate(305 330) scale(1.3)" fill="#241202"/>' +
      '<g class="jester" fill="#241202" stroke="#f5a524" stroke-width="2" stroke-linejoin="round">' +
        '<path d="M290 126 Q280 96 256 100 Q266 108 262 122 Q276 110 296 124Z"/>' +
        '<path d="M320 126 Q330 96 354 100 Q344 108 348 122 Q334 110 314 124Z"/>' +
        '<path d="M297 126 Q294 94 316 82 Q326 84 330 96 Q318 92 313 126Z"/>' +
        '<path d="M286 128 h38" stroke-width="5"/></g>' +
      '<g fill="#f5a524"><circle cx="262" cy="124" r="4.5"/><circle cx="348" cy="124" r="4.5"/><circle cx="331" cy="98" r="4.5"/></g>' +
      '<g fill="#241202"><use class="laugh-a" href="#nr-fig" transform="translate(246 330) rotate(-8)"/><use class="laugh-b" href="#nr-fig" transform="translate(372 330) scale(.92) rotate(9)"/></g>' +
      '<g fill="#f5a524" font-family="Archivo, sans-serif" font-weight="900" font-stretch="70%"><text class="ha" x="232" y="242" font-size="17">HA</text><text class="ha ha2" x="362" y="236" font-size="15">HA HA</text></g>' +
      // the lamp
      '<g class="lamp-sway"><line x1="200" y1="0" x2="200" y2="40" stroke="#2a2a2a" stroke-width="3"/>' +
        '<polygon class="cone" points="186,58 214,58 300,480 100,480" fill="url(#nr-cone)"/>' +
        '<path d="M182 58 L188 40 H212 L218 58Z" fill="#1a1a1a"/><ellipse cx="200" cy="59" rx="9" ry="4" fill="#fff1d6"/>' +
        '<g class="motes" fill="#fff1d6">' + motes(26, 150, 250, 80, 440) + '</g></g>' +
      // the man himself
      '<use href="#nr-man" transform="translate(200 440)" fill="#000"/>' +
      '<g font-family="Archivo, sans-serif" font-weight="900" font-stretch="66%" font-size="34">' +
        '<text x="22" y="58" fill="#e2231a">' + esc(S[0]) + '</text><text x="378" y="58" text-anchor="end" fill="#f5a524">' + esc(S[1]) + '</text></g>' +
      '</svg>';
  }

  /* The bribe: a gloved hand slides an envelope to the host. */
  function bribe(el) {
    el.innerHTML =
      '<svg viewBox="0 0 480 300" role="img" aria-label="Noir scene: a gloved hand slides a fat envelope of cash across a table to the host, who takes it.">' +
      '<defs>' + MAN +
        '<linearGradient id="nb-cone" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff1d6" stop-opacity=".5"/><stop offset="1" stop-color="#fff1d6" stop-opacity=".02"/></linearGradient>' +
        '<radialGradient id="nb-wall" cx="65%" cy="40%" r="60%"><stop offset="0" stop-color="#7d0b10"/><stop offset="1" stop-color="#050101"/></radialGradient>' +
        '<pattern id="nb-blinds" width="480" height="16" patternUnits="userSpaceOnUse" patternTransform="rotate(-10)"><rect width="480" height="8" fill="#000" opacity=".45"/></pattern>' +
      '</defs>' +
      '<rect width="480" height="300" fill="url(#nb-wall)"/><rect width="480" height="240" fill="url(#nb-blinds)"/>' +
      '<g class="lamp-sway nb-lamp"><line x1="240" y1="0" x2="240" y2="34" stroke="#2a2a2a" stroke-width="3"/>' +
        '<polygon class="cone" points="226,52 254,52 360,250 120,250" fill="url(#nb-cone)"/>' +
        '<path d="M222 52 L228 34 H252 L258 52Z" fill="#1a1a1a"/><ellipse cx="240" cy="53" rx="9" ry="4" fill="#fff1d6"/>' +
        '<g class="motes" fill="#fff1d6">' + motes(18, 190, 300, 70, 240) + '</g></g>' +
      // the host, seated
      '<g fill="#000"><use href="#nr-man" transform="translate(380 336) scale(1.6)"/></g>' +
      '<path d="M362 108 a19 19 0 0 1 30 -4" fill="none" stroke="#e2231a" stroke-width="2" opacity=".6"/>' +
      '<rect x="396" y="108" width="32" height="5" rx="2.5" fill="#ece8e2" transform="rotate(-6 396 110)"/>' +
      '<circle class="ember" cx="429" cy="106" r="3.5" fill="#ff4d1c"/>' +
      '<path class="smoke" d="M430 99 q8 -14 -2 -26 q-10 -12 2 -28" fill="none" stroke="rgba(255,255,255,.35)" stroke-width="2.5" stroke-linecap="round"/>' +
      '<path class="smoke s2" d="M432 99 q-8 -12 2 -24 q10 -12 -2 -26" fill="none" stroke="rgba(255,255,255,.25)" stroke-width="2" stroke-linecap="round"/>' +
      // table
      '<rect y="236" width="480" height="64" fill="#120403"/><rect y="234" width="480" height="3" fill="#e2231a" opacity=".75"/>' +
      // host hand
      '<g class="host-hand"><rect x="318" y="226" width="40" height="12" rx="6" fill="#000"/><rect x="350" y="224" width="40" height="14" rx="4" fill="#0b0b0b"/></g>' +
      // the envelope
      '<g class="nb-env"><g transform="translate(-60 -115) scale(1.5)">' +
        '<rect x="120" y="206" width="22" height="26" rx="2" fill="#7fa36a" transform="rotate(-12 131 219)"/>' +
        '<rect x="134" y="204" width="22" height="28" rx="2" fill="#93b97c" transform="rotate(8 145 218)"/>' +
        '<text x="146" y="222" font-family="Archivo, sans-serif" font-weight="900" font-size="13" fill="#2f4a24" text-anchor="middle" transform="rotate(8 145 218)">$</text>' +
        '<rect x="104" y="212" width="86" height="24" rx="3" fill="#ece8e2"/>' +
        '<path d="M104 212 l43 13 l43 -13" fill="none" stroke="#bfb29b" stroke-width="1.5"/>' +
        '<circle cx="147" cy="226" r="5" fill="#e2231a"/>' +
        '<text x="110" y="233" font-family="Newsreader, Georgia, serif" font-style="italic" font-size="8" fill="#6c5f4b">For the host</text>' +
      '</g></g>' +
      // the briber's arm
      '<g class="nb-arm"><g transform="translate(-60 -115) scale(1.5)">' +
        '<path d="M-40 268 L84 226 L94 252 L-30 300Z" fill="#0d0d0d"/><path d="M-40 268 L84 226" stroke="#e2231a" stroke-width="1.5" opacity=".7"/>' +
        '<rect x="80" y="222" width="14" height="30" rx="2" fill="#ece8e2" transform="rotate(-18 87 237)"/>' +
        '<circle cx="88" cy="238" r="2.2" fill="#e2231a"/>' +
        '<path d="M92 222 h26 q8 0 8 8 v6 q0 6 -6 6 h-28z" fill="#050505"/>' +
      '</g></g>' +
      '</svg>';
  }

  function esc(t) { return String(t).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }

  document.querySelectorAll("[data-noir]").forEach(function (el) {
    ({ sides: sides, bribe: bribe })[el.getAttribute("data-noir")](el);
  });
})();
