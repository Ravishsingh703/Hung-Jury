// DUMMY CASE for testing only. Real cases go in cases/private/ (never committed: this repo is public).
// Each line: seg (which exchange it belongs to), who (role id), tone, text, optional note / ex (exhibit id) / sfx ("gavel").
window.CASE = {
  segs: {open:"Openings", direct:"Direct examination · Prosecution questions the witness", cross:"Cross-examination · Defence questions the witness", close:"Close"},
  title: "The State v. Tomas Vey",
  roles: [
    {id:"judge", name:"Judge"},
    {id:"pros", name:"Prosecutor"},
    {id:"def", name:"Defence"},
    {id:"wit", name:"Witness"}
  ],
  exhibits: {
    A: {tag:"Exhibit A · Receipt", html:`<div class="row"><span>ELLERY ST FUEL</span><span>#2231</span></div><div>14/03 · 22:41</div><hr><div class="row"><span>Water 600ml</span><span>$3.20</span></div><div class="row"><span>Chewing gum</span><span>$2.90</span></div><hr><div class="row"><b>TOTAL</b><b>$6.10</b></div><div>VISA ····8812 · T. VEY</div>`}
  },
  lines: [
    {seg:"open", who:"judge", tone:"formal", text:"Court is in session. The State versus Tomas Vey. Prosecution, your opening.", sfx:"gavel"},
    {seg:"open", who:"pros", tone:"confident", text:"On the night of 14 March, the cash tin from the Ellery Street community hall went missing. The defendant held the only spare key."},
    {seg:"open", who:"def", tone:"dismissive", text:"A spare key proves access, not guilt. Half the committee knew where it was kept."},
    {seg:"open", who:"judge", tone:"formal", text:"Call your first witness."},
    {seg:"direct", who:"pros", tone:"formal", text:"The prosecution calls Marjorie Hale."},
    {seg:"direct", who:"wit", tone:"nervous", text:"I live across the road. Around half past ten I saw a man in a grey hoodie leave by the side door.", note:"Look at the jury, not the lawyer."},
    {seg:"direct", who:"pros", tone:"confident", text:"Exhibit A. A receipt from 10:41 that night, two streets away, paid on the defendant's card.", ex:"A"},
    {seg:"direct", who:"wit", tone:"unsure", text:"That's about right. He went that way.", ex:"A"},
    {seg:"cross", who:"def", tone:"probing", text:"Mrs Hale, you told police the man was tall. My client is five foot seven."},
    {seg:"cross", who:"wit", tone:"defensive", text:"It was dark. He looked tall from my window.", note:"Pause before answering."},
    {seg:"cross", who:"def", tone:"pressing", text:"So you can't say it was him."},
    {seg:"cross", who:"wit", tone:"firm", text:"I can say it was a grey hoodie."},
    {seg:"close", who:"judge", tone:"formal", text:"That concludes the evidence. Jurors, you may retire to deliberate.", sfx:"gavel"}
  ]
};
