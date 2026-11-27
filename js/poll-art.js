/* Noir scenes for the poll cards. Each one is split down the middle:
   one choice in red light, the other in amber. window.HJ.pollArt(key) -> SVG string. */
(function () {
  window.HJ = window.HJ || {};

  // shapes (feet at 0,0)
  var MAN = '<ellipse cx="0" cy="-158" rx="23" ry="4.5"/><rect x="-14" y="-179" width="28" height="22" rx="5"/>' +
    '<circle cx="0" cy="-145" r="12"/>' +
    '<path d="M-9 -135 h18 l18 14 l6 66 l-10 2 l-4 -40 l-2 58 h-34 l-2 -58 l-4 40 l-10 -2 l6 -66z"/>' +
    '<rect x="-15" y="-35" width="11" height="35" rx="2"/><rect x="4" y="-35" width="11" height="35" rx="2"/>';
  var BARE = '<circle cx="0" cy="-145" r="12"/>' +
    '<path d="M-9 -135 h18 l18 14 l6 66 l-10 2 l-4 -40 l-2 58 h-34 l-2 -58 l-4 40 l-10 -2 l6 -66z"/>' +
    '<rect x="-15" y="-35" width="11" height="35" rx="2"/><rect x="4" y="-35" width="11" height="35" rx="2"/>';
  var FIG = '<circle cx="0" cy="-66" r="9"/><path d="M-8 -56 h16 q8 2 9 14 l3 42 h-40 l3 -42 q1 -12 9 -14z"/>';

  function g(shape, x, y, s, fill, extra) {
    return '<g transform="translate(' + x + ' ' + y + ') scale(' + s + ')' + (extra || '') + '" fill="' + fill + '">' + shape + '</g>';
  }
  function frame(id, label, body, left, right) {
    return '<svg viewBox="0 0 400 200" role="img" aria-label="' + label + '">' +
      '<defs>' +
        '<radialGradient id="' + id + 'l" cx="22%" cy="55%" r="55%"><stop offset="0" stop-color="#e2231a" stop-opacity=".85"/><stop offset=".6" stop-color="#7d0b10" stop-opacity=".45"/><stop offset="1" stop-color="#7d0b10" stop-opacity="0"/></radialGradient>' +
        '<radialGradient id="' + id + 'r" cx="78%" cy="55%" r="55%"><stop offset="0" stop-color="#f5a524" stop-opacity=".8"/><stop offset=".6" stop-color="#8a4a08" stop-opacity=".42"/><stop offset="1" stop-color="#8a4a08" stop-opacity="0"/></radialGradient>' +
      '</defs>' +
      '<rect width="400" height="200" fill="#050101"/>' +
      '<rect class="glow-l" width="400" height="170" fill="url(#' + id + 'l)"/>' +
      '<rect class="glow-r" width="400" height="170" fill="url(#' + id + 'r)"/>' +
      '<rect y="168" width="400" height="32" fill="#0b0203"/>' +
      '<line x1="0" y1="168" x2="400" y2="168" stroke="rgba(255,255,255,.12)"/>' +
      '<line x1="200" y1="14" x2="200" y2="168" stroke="rgba(255,255,255,.07)" stroke-dasharray="3 5"/>' +
      body +
      '<g font-family="Newsreader, Georgia, serif" font-style="italic" font-size="17">' +
        '<text x="14" y="190" fill="#ff6a5a">' + left + '</text>' +
        '<text x="386" y="190" fill="#f5a524" text-anchor="end">' + right + '</text></g>' +
      '</svg>';
  }

  var scenes = {
    // stay in the lit house, or walk out toward the horizon
    safe: function () {
      return frame("pa-safe", "A man at a fork in the road. On one side a lit house with two people in the window. On the other, a long road to a red horizon.",
        // horizon on the left: hills, a low red sun
        '<circle cx="62" cy="150" r="22" fill="#ff4d1c" opacity=".9"/>' +
        '<path d="M0 168 L40 140 L70 152 L104 128 L150 168Z" fill="#140102"/>' +
        // the road splits
        '<path d="M184 200 L196 168 L120 132 L112 134 L176 168 L170 200Z" fill="#1d0405"/>' +
        '<path d="M216 200 L204 168 L262 150 L272 152 L226 168 L232 200Z" fill="#241202"/>' +
        // the house on the right, two in the window
        '<path d="M262 168 V118 L300 92 L338 118 V168Z" fill="#170a02"/>' +
        '<rect x="284" y="124" width="32" height="24" fill="#f5a524"/>' +
        '<g fill="#170a02"><circle cx="294" cy="134" r="4"/><rect x="289" y="138" width="10" height="10" rx="3"/><circle cx="306" cy="134" r="4"/><rect x="301" y="138" width="10" height="10" rx="3"/></g>' +
        g(MAN, 200, 168, .62, "#0d0102"),
        "go", "stay");
    },
    // a perfect embrace behind a mask, or two people sat apart
    lie: function () {
      return frame("pa-lie", "On one side two people embrace, one hiding their face behind a smiling mask. On the other, two people sit at either end of a bench.",
        // the embrace, one holds a smiling mask over their face
        g(BARE, 78, 168, .7, "#1c0203") +
        g(FIG, 108, 168, 1.12, "#140102", " rotate(-6)") +
        '<path d="M84 72 q16 -6 20 10" stroke="#1c0203" stroke-width="7" fill="none" stroke-linecap="round"/>' +
        '<line x1="114" y1="104" x2="120" y2="132" stroke="#e2c9a0" stroke-width="2"/>' +
        '<ellipse cx="112" cy="93" rx="11" ry="13" fill="#ece8e2"/>' +
        '<path d="M106 97 q6 6 12 0" stroke="#1c0203" stroke-width="2" fill="none"/>' +
        '<g fill="#1c0203"><circle cx="108" cy="89" r="1.6"/><circle cx="116" cy="89" r="1.6"/></g>' +
        // the bench, sitting apart
        '<rect x="252" y="140" width="116" height="6" rx="2" fill="#2a1503"/>' +
        '<rect x="258" y="146" width="5" height="22" fill="#2a1503"/><rect x="357" y="146" width="5" height="22" fill="#2a1503"/>' +
        '<g fill="#241202"><circle cx="268" cy="106" r="8"/><path d="M260 115 h16 l3 26 h-22z"/>' +
        '<circle cx="354" cy="104" r="8"/><path d="M346 113 h16 l3 28 h-22z"/></g>',
        "perfect", "real");
    },
    // a halo with a devil's shadow, or no halo with a halo'd shadow
    good: function () {
      return frame("pa-good", "Two men under a lamp. One wears a halo but his shadow on the wall has horns. The other is pointed at by a crowd, but his shadow wears a halo.",
        // lamp
        '<line x1="200" y1="0" x2="200" y2="26" stroke="#333" stroke-width="2"/><path d="M190 26 h20 l-4 8 h-12z" fill="#222"/><circle cx="200" cy="36" r="3" fill="#fff1d6"/>' +
        // left: halo on the man, horns on his shadow
        g(MAN, 62, 168, .78, "#3a0306", " scale(-1 1)") +
        '<g fill="#3a0306"><path d="M50 30 l-8 -16 l14 10z"/><path d="M74 30 l8 -16 l-14 10z"/></g>' +
        g(BARE, 120, 168, .62, "#140102") +
        '<ellipse cx="120" cy="68" rx="13" ry="3.5" fill="none" stroke="#f5a524" stroke-width="2.5"/>' +
        // right: crowd pointing at a bare man, halo on his shadow
        g(BARE, 338, 168, .78, "#2a1503") +
        '<ellipse cx="338" cy="46" rx="16" ry="4" fill="none" stroke="#f5a524" stroke-width="2.5" opacity=".9"/>' +
        g(BARE, 280, 168, .62, "#170a02") +
        g(FIG, 236, 168, .75, "#170a02") + '<path d="M240 126 l18 -6" stroke="#170a02" stroke-width="5" stroke-linecap="round"/>' +
        g(FIG, 380, 168, .7, "#170a02") + '<path d="M376 130 l-18 -6" stroke="#170a02" stroke-width="5" stroke-linecap="round"/>',
        "seen as good", "is good");
    },
    // a cradle in the middle: a kid with a balloon, or a kid facing a storm
    kid: function () {
      return frame("pa-kid", "A cradle under a lamp between two children. One holds a balloon in warm light. The other stands with a lantern, looking up at a storm.",
        // cradle and lamp
        '<path d="M180 0 v24 M220 0 v24" stroke="#333" stroke-width="1"/><path d="M170 24 h60" stroke="#333"/>' +
        '<path d="M176 136 q24 26 48 0z" fill="#1a0a0a"/><path d="M172 136 h56" stroke="#2a1515" stroke-width="4" stroke-linecap="round"/>' +
        '<path d="M180 158 q20 12 40 0" stroke="#2a1515" stroke-width="3" fill="none"/>' +
        // left: storm, a kid with a lantern looking up
        '<g fill="#1c0203"><ellipse cx="56" cy="34" rx="40" ry="14"/><ellipse cx="94" cy="28" rx="30" ry="12"/><ellipse cx="28" cy="40" rx="24" ry="10"/></g>' +
        '<path d="M74 44 l-10 22 h10 l-12 26 l24 -32 h-10 l8 -16z" fill="#ffd59a"/>' +
        g(FIG, 98, 168, .72, "#1c0203") +
        '<line x1="108" y1="128" x2="116" y2="138" stroke="#1c0203" stroke-width="3"/><rect x="112" y="136" width="9" height="12" rx="2" fill="#ffb347"/>' +
        // right: a kid holding a balloon in warm light
        g(FIG, 306, 168, .72, "#241202") +
        '<path d="M314 128 q8 -30 2 -56" stroke="#241202" stroke-width="1.5" fill="none"/>' +
        '<ellipse cx="318" cy="58" rx="14" ry="17" fill="#f5a524"/><path d="M315 74 l3 4 l3 -4z" fill="#f5a524"/>',
        "sharp", "happy");
    }
  };

  window.HJ.pollArt = function (key) { return scenes[key] ? scenes[key]() : ""; };
})();
