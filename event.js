/*
  HUNG JURY: this week's session.
  This is the only file you edit each week. Change the text between the quotes,
  save, commit. The page rebuilds itself from this.

  Times are Perth time. `unsealAt` is when the reading material opens.
  Set it to when the night ends, so everyone walks in raw.
*/
window.EVENT = {
  session: 1,
  dateline: "Perth, Thursday 10 December 2026",

  // The topic in plain words, shown small above the headline.
  topic: "Respected or liked?",

  // The big question. Make it one that sticks in people's heads all week.
  headline: "Would you rather be respected by people who can\u2019t stand you, or liked by people who think you\u2019re a joke?",

  // Two short lines, shown under the table. Keep them punchy.
  brief: [
    "You get one. No \u201cit depends\u201d, no \u201cwhy not both\u201d.",
    "No quotes, no studies, no homework. Just your own reasons, said out loud."
  ],

  // The table scene. Two sides, three jurors each (seats 1-3 on the left, 4-6 on the right).
  // The script plays in order and loops. Moods: talk, shout, stand, slam, laugh, hurt, switch, cheer.
  // "switch" moves that juror to the other side; "cheer" gets their whole side going.
  sides: ["Respected", "Liked"],
  script: [
    { j: 1, mood: "talk",   say: "Respect lasts. Being liked wears off." },
    { j: 4, mood: "talk",   say: "Respect never got anyone invited to dinner." },
    { j: 2, mood: "stand",  say: "I don\u2019t need invites. I need people to listen." },
    { j: 5, mood: "laugh",  say: "Pfft. Nobody listens to someone they can\u2019t stand." },
    { j: 3, mood: "slam",   say: "THAT\u2019S NOT THE POINT." },
    { j: 6, mood: "talk",   say: "Then what is the point?" },
    { j: 1, mood: "talk",   say: "Would you rather be liked by people who think you\u2019re a joke?" },
    { j: 4, mood: "stand",  say: "Would you rather be right, and eat alone?" },
    { j: 3, mood: "hurt",   say: "\u2026" },
    { j: 5, mood: "laugh",  say: "HA. He felt that." },
    { j: 3, mood: "switch", say: "Fine. I\u2019m crossing the floor." },
    { j: 6, mood: "cheer",  say: "Dessert\u2019s on the host!" }
  ],

  // The happy ending. Dessert lands, everyone eats, and the jurors say
  // something good about each other's arguments. Plays after the script.
  ending: [
    { j: 4, say: "Juror 1. \u201cRespect lasts\u201d was a good line. Annoyingly." },
    { j: 1, say: "Your dinner invite point got me. A bit." },
    { j: 5, say: "Juror 3, takes guts to cross. Respect." },
    { j: 3, say: "You lot made it hard. That\u2019s the point." },
    { j: 2, say: "Still Respected. Pass the cake." }
  ],

  // The night. `day` is shown huge, `time` under it, then the small print.
  day: "Thursday 10 December",
  time: "6pm. The door closes once we start.",
  smallPrint: ["Venue in the group chat.", "Order your own, pay your own.", "Done by 9."],

  unsealAt: "2026-12-10T21:00:00+08:00",

  // Fill these in after the night. They show once the envelope opens.
  // result: { count: "4\u20133", side: 1, note: "Two crossed the floor." }
  result: null,
  next: "Session 02 is being drafted. Same table. New question.",

  reading: [
    {
      title: "The Prince, chapter 17",
      source: "Niccolò Machiavelli, 1513",
      url: "https://standardebooks.org/ebooks/niccolo-machiavelli/the-prince/w-k-marriott/text/chapter-17",
      note: "The original version of tonight’s question, with fear in place of respect. He wanted both, and picked fear if forced."
    },
    {
      title: "Connect, Then Lead",
      source: "Cuddy, Kohut & Neffinger, Harvard Business Review, 2013",
      url: "https://hbr.org/2013/07/connect-then-lead",
      note: "The case for warmth first: people decide whether they trust you before they weigh how good you are."
    },
    {
      title: "Stereotype Content: Warmth and Competence Endure",
      source: "Susan Fiske, 2018",
      url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC5945217",
      note: "The research behind it. We read everyone on two scales, warmth and competence, roughly ‘liked’ and ‘respected’."
    },
    {
      title: "Avoiding the Likability Trap at Work",
      source: "Kellogg Insight podcast, Harry Kraemer",
      url: "https://insight.kellogg.northwestern.edu/article/podcast-avoiding-the-likability-trap-at-work-7",
      note: "The opposite view: chase being liked and you probably lose respect along the way."
    },
    {
      title: "Why It’s Better to Be Liked Than Respected",
      source: "Kristin Kaufman, Fortune, 2016",
      url: "https://fortune.com/2016/06/01/your-colleagues-dont-like-you/",
      note: "A short, blunt argument for liked, built on who people actually vote for and follow."
    },
    {
      title: "What Being Respected Means to Different Personalities",
      source: "16Personalities survey",
      url: "https://www.16personalities.com/articles/what-being-respected-means-to-different-personalities-a-study",
      note: "Survey data on who picks which. Analytical types lean heavily towards respect."
    }
  ],

  internetVerdict: [
    "Most people online pick respected, especially when the question is about work. Their reasoning: likability fades, respect lasts, and chasing approval makes you a pushover.",
    "The minority who pick liked argue it’s what actually moves people. We vote for, hire and stay loyal to people we like, and research on first impressions backs them up: warmth gets judged first and counts for more.",
    "The most common answer of all is the one we banned tonight: “you don’t have to choose”. One thread in the research suggests why. Moral character, like being honest and fair, earns both at once."
  ]
};
