# Jury Night

The trial app for Hung Jury nights at home. One Mac runs it; everyone else uses their phone's browser. Nothing to install on phones.

## On the night

1. Mac on the home Wi-Fi, plugged in, HDMI to the TV.
2. Double-click **Start Jury Night.command**. The TV screen opens with a QR code.
   - First time only: if macOS asks whether to allow incoming connections, click **Allow**.
3. Guests join the Wi-Fi, scan the QR, and pick a role. Taken roles are locked.
4. Open the **Control** tab on the Mac (or any phone at `/#control`) and press **Start trial**.
5. Whoever's line it is taps **Done, next line**. Only the current speaker can move it on.
6. Act 2: open the **Jury room** tab on the TV for evidence and testimony.

To stop, close the Terminal window. If the Mac restarts mid-trial, start it again: it picks up on the same line.

## Screens

| Address | What |
| --- | --- |
| `/#tv` | Courtroom on the TV: QR to join, current line, evidence, gavel sound |
| `/#phone` | A guest's script: pick a role, your lines, tone chips, buzz/flash cues |
| `/#control` | Start, back, next, reset, free a role |
| `/#jury` | Jury room: exhibits, testimony grouped by exchange, full record |
| `/#demo` | All of the above on one screen, for testing |

Sound on the TV needs one click on **Turn on TV sound** (browsers block audio until you click).

## Cases

- `cases/dummy.js` is a 13-line test case. It's safe to keep here.
- **Real cases never go in this repo: it's public.** Put the real case in `cases/private/` on the Mac. That folder is ignored by git. If it holds exactly one `.js` file, the launcher uses it automatically.
- Each line: `seg` (which exchange: opening, direct, cross…), `who` (role id), `tone`, `text`, and optional `note`, `ex` (exhibit id) and `sfx`.

## Testing without the night

Run it, then open `http://localhost:3000/#demo` for the all-in-one view, or several tabs at `/#phone`. Phones on the same Wi-Fi can scan the TV's QR.

## Phone tips for guests

- Set auto-lock to "Never" or 5 minutes for the trial, or the screen sleeps between lines.
- Vibration cues only work on Android. iPhones get the full-screen flash instead.
