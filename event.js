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
  headline: "Would you rather be the person they trust, or the person they invite?",

  // One line under the headline.
  deck: "Same people, same life. Pick one.",

  // Two short lines, shown under the table. Keep them punchy.
  brief: [
    "You get one. No \u201cit depends\u201d, no \u201cwhy not both\u201d.",
    "No quotes, no studies, no homework. Just your own reasons, said out loud."
  ],

  // The night. `day` is shown huge, `time` under it, then the small print.
  day: "Thursday 10 December",
  time: "6pm. The door closes once we start.",
  smallPrint: ["Venue in the group chat.", "Order your own, pay your own.", "Done by 9."],

  unsealAt: "2026-12-10T21:00:00+08:00",

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
