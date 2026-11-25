# Hung Jury

One page. This week's question, the brief, the night, and the reading list that unseals when the night ends.

## Weekly update (5 minutes)

Edit **one file: `event.js`**. Change the topic, the headline question, the deck line, the brief, the details, the `unsealAt` time and the reading list. Commit. GitHub Pages republishes in about a minute.

The headline is the hook: make it a question people can't stop chewing on all week.

Nothing else needs touching.

## First-time setup

1. Create a new **public** repo on GitHub, e.g. `hung-jury`.
2. Upload everything in this folder (keep the `fonts` folder).
3. Repo **Settings > Pages**: Source "Deploy from a branch", branch `main`, folder `/ (root)`. Save.
4. Your site is live at `https://<your-username>.github.io/hung-jury/`.
5. To hand over to a subhost: **Settings > Collaborators**, add them. They can then edit `event.js` too.

## Things to know

- **The repo is public.** Never put full names, ages, phone numbers or payment details in it.
- **Hidden from search engines** via a `noindex` tag on every page. People only find it if they're given the link.
- **The seal is a soft lock.** The reading list unlocks by the clock, but it's in `event.js`, so anyone who views the page source can read it early. If you want it truly hidden, leave `reading` and `internetVerdict` empty until after the night and add them then.
- **Fonts** (Archivo, Newsreader) are bundled in `/fonts` under the SIL Open Font License, so the site doesn't depend on Google.
