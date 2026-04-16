const pptxgen = require("pptxgenjs");
const pres = new pptxgen();
pres.layout = "LAYOUT_16x9";
pres.author = "Daniel Weadock";
pres.title = "Monican — How It Works";

// Design
const BG = "090909";
const CARD = "141414";
const WHITE = "FFFFFF";
const GRAY = "777777";
const LGRAY = "AAAAAA";
const GREEN = "22C55E";
const RED = "DC3545";
const BORDER = "222222";

const makeShadow = () => ({ type: "outer", blur: 8, offset: 3, angle: 135, color: "000000", opacity: 0.4 });

// ============================================================
// SLIDE 1 — TITLE
// ============================================================
let s1 = pres.addSlide();
s1.background = { color: BG };
s1.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.04, fill: { color: WHITE } });
s1.addText("How AI Agents\nWork For You", { x: 0.8, y: 1.0, w: 8, h: 2.2, fontSize: 48, fontFace: "Arial Black", color: WHITE, margin: 0 });
s1.addText("A visual walkthrough of how we automate your most\ntime-consuming workflows — in real time.", { x: 0.8, y: 3.2, w: 7, h: 0.8, fontSize: 15, fontFace: "Calibri", color: GRAY, margin: 0 });
s1.addText("Monican", { x: 0.8, y: 4.8, w: 3, h: 0.4, fontSize: 13, fontFace: "Calibri", color: GRAY, margin: 0 });

// ============================================================
// SLIDE 2 — THE PROBLEM
// ============================================================
let s2 = pres.addSlide();
s2.background = { color: BG };
s2.addText("THE PROBLEM", { x: 0.8, y: 0.4, w: 8, h: 0.6, fontSize: 32, fontFace: "Arial Black", color: WHITE, margin: 0 });

// Timeline showing manual process
const steps = [
  { time: "9:02 AM", task: "New lead arrives from Zillow", icon: "📨", color: WHITE },
  { time: "9:02 AM", task: "Lead sits in inbox...", icon: "⏳", color: GRAY },
  { time: "11:45 AM", task: "Agent finally sees it (2.5 hrs later)", icon: "👀", color: RED },
  { time: "11:50 AM", task: "Agent reads message, types response", icon: "⌨️", color: RED },
  { time: "12:00 PM", task: "Agent updates CRM manually", icon: "📋", color: RED },
  { time: "12:05 PM", task: "Sets follow-up reminder", icon: "🔔", color: RED },
  { time: "12:10 PM", task: "Done. 15 minutes per lead. Lead is cold.", icon: "❌", color: RED },
];

steps.forEach((s, i) => {
  const y = 1.3 + i * 0.55;
  s2.addShape(pres.shapes.RECTANGLE, { x: 0.8, y: y, w: 8.4, h: 0.45, fill: { color: CARD } });
  s2.addText(s.time, { x: 0.9, y: y, w: 1.4, h: 0.45, fontSize: 11, fontFace: "Calibri", color: GRAY, valign: "middle", margin: 0, bold: true });
  s2.addText(s.icon + "  " + s.task, { x: 2.3, y: y, w: 6.7, h: 0.45, fontSize: 13, fontFace: "Calibri", color: s.color, valign: "middle", margin: 0 });
});

s2.addShape(pres.shapes.RECTANGLE, { x: 0.8, y: 5.2, w: 8.4, h: 0.3, fill: { color: RED } });
s2.addText("20 leads/week × 15 min each = 5 hours/week wasted. And leads go cold.", { x: 1.0, y: 5.2, w: 8, h: 0.3, fontSize: 12, fontFace: "Calibri", color: WHITE, valign: "middle", margin: 0 });

// ============================================================
// SLIDE 3 — THE SOLUTION (Overview)
// ============================================================
let s3 = pres.addSlide();
s3.background = { color: BG };
s3.addText("THE SOLUTION", { x: 0.8, y: 0.4, w: 8, h: 0.6, fontSize: 32, fontFace: "Arial Black", color: WHITE, margin: 0 });
s3.addText("An AI agent does the same work — in 10 seconds.", { x: 0.8, y: 0.95, w: 8, h: 0.35, fontSize: 14, fontFace: "Calibri", color: GRAY, margin: 0 });

// Three big steps
const solSteps = [
  { num: "1", title: "TRIGGER", desc: "New lead arrives\nfrom any source", sub: "Zillow, Realtor.com, website,\nemail, phone — anywhere" },
  { num: "2", title: "AI PROCESSES", desc: "Agent reads, classifies,\nand drafts response", sub: "Detects: showing request,\nbuyer inquiry, question, seller" },
  { num: "3", title: "OUTPUT", desc: "Personalized email sent\n+ CRM updated + you get alerted", sub: "Response time:\nhours → seconds" },
];

solSteps.forEach((s, i) => {
  const x = 0.5 + i * 3.15;
  s3.addShape(pres.shapes.RECTANGLE, { x: x, y: 1.6, w: 2.9, h: 3.4, fill: { color: CARD }, shadow: makeShadow() });
  s3.addText(s.num, { x: x, y: 1.7, w: 2.9, h: 0.7, fontSize: 36, fontFace: "Arial Black", color: WHITE, align: "center", margin: 0 });
  s3.addText(s.title, { x: x, y: 2.35, w: 2.9, h: 0.35, fontSize: 12, fontFace: "Calibri", color: GRAY, align: "center", charSpacing: 3, margin: 0 });
  s3.addText(s.desc, { x: x + 0.2, y: 2.9, w: 2.5, h: 0.8, fontSize: 14, fontFace: "Calibri", color: WHITE, align: "center", bold: true, margin: 0 });
  s3.addText(s.sub, { x: x + 0.2, y: 3.8, w: 2.5, h: 0.8, fontSize: 11, fontFace: "Calibri", color: GRAY, align: "center", margin: 0 });
});

// Arrows between steps
s3.addText("→", { x: 3.25, y: 2.8, w: 0.5, h: 0.5, fontSize: 28, color: WHITE, align: "center", valign: "middle" });
s3.addText("→", { x: 6.4, y: 2.8, w: 0.5, h: 0.5, fontSize: 28, color: WHITE, align: "center", valign: "middle" });

// ============================================================
// SLIDE 4 — DEMO: LEAD COMES IN
// ============================================================
let s4 = pres.addSlide();
s4.background = { color: BG };
s4.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.5, fill: { color: CARD } });
s4.addText("LIVE DEMO — LEAD RESPONDER AGENT", { x: 0.8, y: 0, w: 8, h: 0.5, fontSize: 12, fontFace: "Calibri", color: GRAY, valign: "middle", charSpacing: 2, margin: 0 });
s4.addText("●  STEP 1", { x: 7.5, y: 0, w: 2, h: 0.5, fontSize: 12, fontFace: "Calibri", color: GREEN, valign: "middle", bold: true, margin: 0 });

s4.addText("A Lead Arrives", { x: 0.8, y: 0.7, w: 8, h: 0.6, fontSize: 28, fontFace: "Arial Black", color: WHITE, margin: 0 });

// Fake email inbox
s4.addShape(pres.shapes.RECTANGLE, { x: 0.8, y: 1.5, w: 8.4, h: 3.2, fill: { color: CARD }, shadow: makeShadow() });
// Email header
s4.addShape(pres.shapes.RECTANGLE, { x: 0.8, y: 1.5, w: 8.4, h: 0.5, fill: { color: "1a1a1a" } });
s4.addText("INBOX", { x: 1.0, y: 1.5, w: 2, h: 0.5, fontSize: 11, fontFace: "Calibri", color: GRAY, valign: "middle", bold: true, margin: 0 });
s4.addText("●  1 new", { x: 7.5, y: 1.5, w: 1.5, h: 0.5, fontSize: 11, fontFace: "Calibri", color: GREEN, valign: "middle", margin: 0 });

// Email
s4.addShape(pres.shapes.RECTANGLE, { x: 1.0, y: 2.2, w: 8.0, h: 2.3, fill: { color: "1e1e1e" } });
s4.addText([
  { text: "From: ", options: { bold: true, fontSize: 12, color: GRAY, breakLine: false } },
  { text: "Sarah Chen (via Zillow)", options: { fontSize: 12, color: WHITE, breakLine: true } },
  { text: "Property: ", options: { bold: true, fontSize: 12, color: GRAY, breakLine: false } },
  { text: "47 Wattaquadock Hill Rd, Bolton, MA", options: { fontSize: 12, color: WHITE, breakLine: true } },
  { text: "", options: { fontSize: 6, breakLine: true } },
  { text: '"Hi, I saw this listing online and I\'m interested in scheduling a showing. My husband and I are relocating from Worcester for the school district. Is this still available?"', options: { fontSize: 13, color: LGRAY, italic: true } },
], { x: 1.3, y: 2.3, w: 7.4, h: 2.0, fontFace: "Calibri" });

s4.addText("This lead just arrived. The clock is ticking.", { x: 0.8, y: 4.9, w: 8.4, h: 0.4, fontSize: 13, fontFace: "Calibri", color: GRAY, italic: true, margin: 0 });

// ============================================================
// SLIDE 5 — DEMO: AI CLASSIFIES
// ============================================================
let s5 = pres.addSlide();
s5.background = { color: BG };
s5.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.5, fill: { color: CARD } });
s5.addText("LIVE DEMO — LEAD RESPONDER AGENT", { x: 0.8, y: 0, w: 8, h: 0.5, fontSize: 12, fontFace: "Calibri", color: GRAY, valign: "middle", charSpacing: 2, margin: 0 });
s5.addText("●  STEP 2", { x: 7.5, y: 0, w: 2, h: 0.5, fontSize: 12, fontFace: "Calibri", color: GREEN, valign: "middle", bold: true, margin: 0 });

s5.addText("The Agent Reads & Classifies", { x: 0.8, y: 0.7, w: 8, h: 0.6, fontSize: 28, fontFace: "Arial Black", color: WHITE, margin: 0 });
s5.addText("In milliseconds, the AI scans the message and makes decisions.", { x: 0.8, y: 1.2, w: 8, h: 0.35, fontSize: 13, fontFace: "Calibri", color: GRAY, margin: 0 });

// Classification visual
s5.addShape(pres.shapes.RECTANGLE, { x: 0.8, y: 1.8, w: 8.4, h: 3.0, fill: { color: CARD }, shadow: makeShadow() });

const classifications = [
  { label: "LEAD TYPE", value: "Showing Request", conf: "HIGH CONFIDENCE" },
  { label: "LEAD QUALITY", value: "🔥 Hot", conf: "Wants to schedule now" },
  { label: "SIGNAL: RELOCATING", value: "✓ Detected", conf: '"relocating from Worcester"' },
  { label: "SIGNAL: SCHOOLS", value: "✓ Detected", conf: '"for the school district"' },
  { label: "ACTION NEEDED", value: "Send showing times + school info", conf: "Auto-personalized" },
];

classifications.forEach((c, i) => {
  const y = 1.9 + i * 0.55;
  s5.addShape(pres.shapes.RECTANGLE, { x: 1.0, y: y, w: 8.0, h: 0.45, fill: { color: "1e1e1e" } });
  s5.addText(c.label, { x: 1.2, y: y, w: 2.5, h: 0.45, fontSize: 11, fontFace: "Calibri", color: GRAY, valign: "middle", bold: true, margin: 0 });
  s5.addText(c.value, { x: 3.7, y: y, w: 2.5, h: 0.45, fontSize: 13, fontFace: "Calibri", color: WHITE, valign: "middle", bold: true, margin: 0 });
  s5.addText(c.conf, { x: 6.3, y: y, w: 2.5, h: 0.45, fontSize: 11, fontFace: "Calibri", color: GREEN, valign: "middle", margin: 0 });
});

s5.addText("A human would need 5 minutes to read and decide. The agent does it instantly.", { x: 0.8, y: 5.0, w: 8.4, h: 0.35, fontSize: 13, fontFace: "Calibri", color: GRAY, italic: true, margin: 0 });

// ============================================================
// SLIDE 6 — DEMO: AI GENERATES RESPONSE
// ============================================================
let s6 = pres.addSlide();
s6.background = { color: BG };
s6.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.5, fill: { color: CARD } });
s6.addText("LIVE DEMO — LEAD RESPONDER AGENT", { x: 0.8, y: 0, w: 8, h: 0.5, fontSize: 12, fontFace: "Calibri", color: GRAY, valign: "middle", charSpacing: 2, margin: 0 });
s6.addText("●  STEP 3", { x: 7.5, y: 0, w: 2, h: 0.5, fontSize: 12, fontFace: "Calibri", color: GREEN, valign: "middle", bold: true, margin: 0 });

s6.addText("Personalized Response Drafted", { x: 0.8, y: 0.7, w: 8, h: 0.6, fontSize: 28, fontFace: "Arial Black", color: WHITE, margin: 0 });

// Email response
s6.addShape(pres.shapes.RECTANGLE, { x: 0.8, y: 1.5, w: 8.4, h: 3.6, fill: { color: CARD }, shadow: makeShadow() });
s6.addShape(pres.shapes.RECTANGLE, { x: 0.8, y: 1.5, w: 8.4, h: 0.45, fill: { color: "1a1a1a" } });
s6.addText("GENERATED RESPONSE", { x: 1.0, y: 1.5, w: 3, h: 0.45, fontSize: 11, fontFace: "Calibri", color: GRAY, valign: "middle", bold: true, margin: 0 });
s6.addText("✓  SENT", { x: 7.5, y: 1.5, w: 1.5, h: 0.45, fontSize: 11, fontFace: "Calibri", color: GREEN, valign: "middle", bold: true, margin: 0 });

s6.addText([
  { text: "Hi Sarah,\n\n", options: { fontSize: 12, color: WHITE, bold: true } },
  { text: "Thank you for reaching out about 47 Wattaquadock Hill Rd! Great news — it's still available.\n\n", options: { fontSize: 11, color: LGRAY } },
  { text: "I'd love to set up a private showing. Here's my availability:\n", options: { fontSize: 11, color: LGRAY } },
  { text: "  •  Tomorrow at 10:00 AM or 4:00 PM\n  •  Thursday at 11:00 AM or 5:30 PM\n  •  Saturday at 12:00 PM or 2:00 PM\n\n", options: { fontSize: 11, color: WHITE } },
  { text: "You mentioned relocating for the schools — the Nashoba Regional School District is excellent and ranked in the top 15% statewide. I'd love to share more when we meet.\n\n", options: { fontSize: 11, color: LGRAY } },
  { text: "Best, Eileen Fitzpatrick | RE/MAX Traditions", options: { fontSize: 11, color: GRAY } },
], { x: 1.1, y: 2.1, w: 7.8, h: 2.9, fontFace: "Calibri" });

s6.addText("Notice: it referenced her specific property, offered times, AND added school info because she mentioned schools.", { x: 0.8, y: 5.2, w: 8.4, h: 0.3, fontSize: 12, fontFace: "Calibri", color: WHITE, bold: true, margin: 0 });

// ============================================================
// SLIDE 7 — DEMO: CRM + FOLLOW-UP
// ============================================================
let s7 = pres.addSlide();
s7.background = { color: BG };
s7.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.5, fill: { color: CARD } });
s7.addText("LIVE DEMO — LEAD RESPONDER AGENT", { x: 0.8, y: 0, w: 8, h: 0.5, fontSize: 12, fontFace: "Calibri", color: GRAY, valign: "middle", charSpacing: 2, margin: 0 });
s7.addText("●  STEP 4", { x: 7.5, y: 0, w: 2, h: 0.5, fontSize: 12, fontFace: "Calibri", color: GREEN, valign: "middle", bold: true, margin: 0 });

s7.addText("CRM Updated + Follow-Up Scheduled", { x: 0.8, y: 0.7, w: 8, h: 0.6, fontSize: 28, fontFace: "Arial Black", color: WHITE, margin: 0 });
s7.addText("While the email was sending, the agent also did this:", { x: 0.8, y: 1.2, w: 8, h: 0.35, fontSize: 13, fontFace: "Calibri", color: GRAY, margin: 0 });

// Two cards side by side
// CRM card
s7.addShape(pres.shapes.RECTANGLE, { x: 0.8, y: 1.8, w: 4, h: 2.8, fill: { color: CARD }, shadow: makeShadow() });
s7.addText("CRM RECORD", { x: 0.8, y: 1.8, w: 4, h: 0.45, fontSize: 11, fontFace: "Calibri", color: GRAY, align: "center", valign: "middle", bold: true });
s7.addText([
  { text: "Name:  ", options: { bold: true, color: GRAY, fontSize: 12, breakLine: false } },
  { text: "Sarah Chen", options: { color: WHITE, fontSize: 12, breakLine: true } },
  { text: "Source:  ", options: { bold: true, color: GRAY, fontSize: 12, breakLine: false } },
  { text: "Zillow", options: { color: WHITE, fontSize: 12, breakLine: true } },
  { text: "Quality:  ", options: { bold: true, color: GRAY, fontSize: 12, breakLine: false } },
  { text: "🔥 Hot", options: { color: WHITE, fontSize: 12, breakLine: true } },
  { text: "Type:  ", options: { bold: true, color: GRAY, fontSize: 12, breakLine: false } },
  { text: "Showing Request", options: { color: WHITE, fontSize: 12, breakLine: true } },
  { text: "", options: { fontSize: 6, breakLine: true } },
  { text: "Key Signals:", options: { bold: true, color: GRAY, fontSize: 12, breakLine: true } },
  { text: "  ✓  Relocating (motivated buyer)", options: { color: GREEN, fontSize: 11, breakLine: true } },
  { text: "  ✓  Schools are a priority", options: { color: GREEN, fontSize: 11 } },
], { x: 1.1, y: 2.3, w: 3.5, h: 2.2, fontFace: "Calibri" });

// Follow-up card
s7.addShape(pres.shapes.RECTANGLE, { x: 5.2, y: 1.8, w: 4, h: 2.8, fill: { color: CARD }, shadow: makeShadow() });
s7.addText("AUTO FOLLOW-UP PLAN", { x: 5.2, y: 1.8, w: 4, h: 0.45, fontSize: 11, fontFace: "Calibri", color: GRAY, align: "center", valign: "middle", bold: true });
s7.addText([
  { text: "Day 0  ", options: { bold: true, color: WHITE, fontSize: 12, breakLine: false } },
  { text: "Email response sent  ✓", options: { color: GREEN, fontSize: 12, breakLine: true } },
  { text: "", options: { fontSize: 6, breakLine: true } },
  { text: "Day 1  ", options: { bold: true, color: WHITE, fontSize: 12, breakLine: false } },
  { text: "Call Sarah (phone provided)", options: { color: LGRAY, fontSize: 12, breakLine: true } },
  { text: "", options: { fontSize: 6, breakLine: true } },
  { text: "Day 3  ", options: { bold: true, color: WHITE, fontSize: 12, breakLine: false } },
  { text: "Follow-up email if no reply", options: { color: LGRAY, fontSize: 12, breakLine: true } },
  { text: "", options: { fontSize: 6, breakLine: true } },
  { text: "Day 7  ", options: { bold: true, color: WHITE, fontSize: 12, breakLine: false } },
  { text: "Send new listings / market update", options: { color: LGRAY, fontSize: 12, breakLine: true } },
  { text: "", options: { fontSize: 6, breakLine: true } },
  { text: "Day 14  ", options: { bold: true, color: WHITE, fontSize: 12, breakLine: false } },
  { text: "Add to monthly newsletter", options: { color: LGRAY, fontSize: 12 } },
], { x: 5.5, y: 2.3, w: 3.5, h: 2.2, fontFace: "Calibri" });

// Bottom summary
s7.addShape(pres.shapes.RECTANGLE, { x: 0.8, y: 4.85, w: 8.4, h: 0.55, fill: { color: "111111" } });
s7.addText("Total time: 10 seconds.  Response sent, CRM updated, follow-ups scheduled. No human touched it.", { x: 1.0, y: 4.85, w: 8, h: 0.55, fontSize: 13, fontFace: "Calibri", color: WHITE, valign: "middle", bold: true, margin: 0 });

// ============================================================
// SLIDE 8 — BEFORE / AFTER
// ============================================================
let s8 = pres.addSlide();
s8.background = { color: BG };
s8.addText("BEFORE vs AFTER", { x: 0.8, y: 0.4, w: 8, h: 0.6, fontSize: 32, fontFace: "Arial Black", color: WHITE, margin: 0 });

// Before column
s8.addShape(pres.shapes.RECTANGLE, { x: 0.5, y: 1.3, w: 4.3, h: 3.8, fill: { color: CARD }, shadow: makeShadow() });
s8.addShape(pres.shapes.RECTANGLE, { x: 0.5, y: 1.3, w: 4.3, h: 0.5, fill: { color: RED } });
s8.addText("WITHOUT AI AGENT", { x: 0.5, y: 1.3, w: 4.3, h: 0.5, fontSize: 13, fontFace: "Calibri", color: WHITE, bold: true, align: "center", valign: "middle" });
s8.addText([
  { text: "Response time:  ", options: { color: GRAY, fontSize: 13, breakLine: false } },
  { text: "2-4 hours", options: { color: RED, fontSize: 13, bold: true, breakLine: true } },
  { text: "", options: { fontSize: 8, breakLine: true } },
  { text: "Time per lead:  ", options: { color: GRAY, fontSize: 13, breakLine: false } },
  { text: "15 minutes", options: { color: RED, fontSize: 13, bold: true, breakLine: true } },
  { text: "", options: { fontSize: 8, breakLine: true } },
  { text: "Weekly hours:  ", options: { color: GRAY, fontSize: 13, breakLine: false } },
  { text: "5 hours", options: { color: RED, fontSize: 13, bold: true, breakLine: true } },
  { text: "", options: { fontSize: 8, breakLine: true } },
  { text: "Annual cost:  ", options: { color: GRAY, fontSize: 13, breakLine: false } },
  { text: "$6,500", options: { color: RED, fontSize: 13, bold: true, breakLine: true } },
  { text: "", options: { fontSize: 8, breakLine: true } },
  { text: "CRM updated:  ", options: { color: GRAY, fontSize: 13, breakLine: false } },
  { text: "Sometimes", options: { color: RED, fontSize: 13, bold: true, breakLine: true } },
  { text: "", options: { fontSize: 8, breakLine: true } },
  { text: "Follow-up plan:  ", options: { color: GRAY, fontSize: 13, breakLine: false } },
  { text: "Inconsistent", options: { color: RED, fontSize: 13, bold: true } },
], { x: 0.8, y: 2.0, w: 3.8, h: 2.8, fontFace: "Calibri" });

// After column
s8.addShape(pres.shapes.RECTANGLE, { x: 5.2, y: 1.3, w: 4.3, h: 3.8, fill: { color: CARD }, shadow: makeShadow() });
s8.addShape(pres.shapes.RECTANGLE, { x: 5.2, y: 1.3, w: 4.3, h: 0.5, fill: { color: GREEN } });
s8.addText("WITH AI AGENT", { x: 5.2, y: 1.3, w: 4.3, h: 0.5, fontSize: 13, fontFace: "Calibri", color: WHITE, bold: true, align: "center", valign: "middle" });
s8.addText([
  { text: "Response time:  ", options: { color: GRAY, fontSize: 13, breakLine: false } },
  { text: "10 seconds", options: { color: GREEN, fontSize: 13, bold: true, breakLine: true } },
  { text: "", options: { fontSize: 8, breakLine: true } },
  { text: "Time per lead:  ", options: { color: GRAY, fontSize: 13, breakLine: false } },
  { text: "0 minutes", options: { color: GREEN, fontSize: 13, bold: true, breakLine: true } },
  { text: "", options: { fontSize: 8, breakLine: true } },
  { text: "Weekly hours:  ", options: { color: GRAY, fontSize: 13, breakLine: false } },
  { text: "0 hours", options: { color: GREEN, fontSize: 13, bold: true, breakLine: true } },
  { text: "", options: { fontSize: 8, breakLine: true } },
  { text: "Annual cost:  ", options: { color: GRAY, fontSize: 13, breakLine: false } },
  { text: "$600 (tool cost)", options: { color: GREEN, fontSize: 13, bold: true, breakLine: true } },
  { text: "", options: { fontSize: 8, breakLine: true } },
  { text: "CRM updated:  ", options: { color: GRAY, fontSize: 13, breakLine: false } },
  { text: "Every time, instantly", options: { color: GREEN, fontSize: 13, bold: true, breakLine: true } },
  { text: "", options: { fontSize: 8, breakLine: true } },
  { text: "Follow-up plan:  ", options: { color: GRAY, fontSize: 13, breakLine: false } },
  { text: "Automatic, every lead", options: { color: GREEN, fontSize: 13, bold: true } },
], { x: 5.5, y: 2.0, w: 3.8, h: 2.8, fontFace: "Calibri" });

// ============================================================
// SLIDE 9 — LISTING GENERATOR DEMO
// ============================================================
let s9 = pres.addSlide();
s9.background = { color: BG };
s9.addText("AGENT #2: LISTING DESCRIPTION GENERATOR", { x: 0.8, y: 0.4, w: 8, h: 0.6, fontSize: 24, fontFace: "Arial Black", color: WHITE, margin: 0 });
s9.addText("45 minutes of writing → 10 seconds. Four formats at once.", { x: 0.8, y: 0.95, w: 8, h: 0.35, fontSize: 13, fontFace: "Calibri", color: GRAY, margin: 0 });

// Input side
s9.addShape(pres.shapes.RECTANGLE, { x: 0.5, y: 1.5, w: 3.5, h: 3.8, fill: { color: CARD }, shadow: makeShadow() });
s9.addText("YOU ENTER", { x: 0.5, y: 1.5, w: 3.5, h: 0.4, fontSize: 11, fontFace: "Calibri", color: GRAY, align: "center", valign: "middle", bold: true, charSpacing: 2 });
s9.addText([
  { text: "47 Wattaquadock Hill Rd\n", options: { bold: true, fontSize: 13, color: WHITE, breakLine: true } },
  { text: "$625,000\n", options: { fontSize: 12, color: WHITE, breakLine: true } },
  { text: "4 BD / 2.5 BA / 2,400 SF\n", options: { fontSize: 12, color: WHITE, breakLine: true } },
  { text: "1.8 acres\n\n", options: { fontSize: 12, color: WHITE, breakLine: true } },
  { text: "Features:\n", options: { bold: true, fontSize: 11, color: GRAY, breakLine: true } },
  { text: "• Updated kitchen\n• Hardwood floors\n• Primary suite\n• Finished basement\n• Screened porch\n• New roof 2024", options: { fontSize: 11, color: LGRAY } },
], { x: 0.7, y: 1.9, w: 3.1, h: 3.2, fontFace: "Calibri" });

// Arrow
s9.addText("→", { x: 4.0, y: 3.0, w: 0.7, h: 0.5, fontSize: 32, color: WHITE, align: "center", valign: "middle" });

// Output side — 4 mini cards
const outputs = [
  { title: "MLS Description", desc: "Formal, 200 words,\nfeature-rich listing copy" },
  { title: "Social Media Post", desc: "Casual, hashtags,\nInstagram/Facebook ready" },
  { title: "Email Blast", desc: "3 subject line options,\nbuyer list email" },
  { title: "Open House", desc: "Dates, directions,\nready to post" },
];

outputs.forEach((o, i) => {
  const y = 1.5 + i * 0.92;
  s9.addShape(pres.shapes.RECTANGLE, { x: 4.8, y: y, w: 4.7, h: 0.78, fill: { color: CARD }, shadow: makeShadow() });
  s9.addShape(pres.shapes.RECTANGLE, { x: 4.8, y: y, w: 0.06, h: 0.78, fill: { color: WHITE } });
  s9.addText((i+1) + ". " + o.title, { x: 5.1, y: y, w: 2.2, h: 0.78, fontSize: 13, fontFace: "Calibri", color: WHITE, bold: true, valign: "middle", margin: 0 });
  s9.addText(o.desc, { x: 7.3, y: y, w: 2.0, h: 0.78, fontSize: 10, fontFace: "Calibri", color: GRAY, valign: "middle", margin: 0 });
});

// ============================================================
// SLIDE 10 — WHAT THIS MEANS FOR YOU
// ============================================================
let s10 = pres.addSlide();
s10.background = { color: BG };
s10.addText("WHAT THIS MEANS\nFOR YOUR BUSINESS", { x: 0.8, y: 0.6, w: 8, h: 1.6, fontSize: 40, fontFace: "Arial Black", color: WHITE, margin: 0 });

// Three big stats
const stats = [
  { num: "10+", label: "Hours saved\nper week", x: 0.5 },
  { num: "$6,500+", label: "Annual savings\nin staff time", x: 3.5 },
  { num: "10 sec", label: "Lead response\n(was 2+ hours)", x: 6.5 },
];
stats.forEach(s => {
  s10.addShape(pres.shapes.RECTANGLE, { x: s.x, y: 2.6, w: 2.8, h: 1.8, fill: { color: CARD }, shadow: makeShadow() });
  s10.addText(s.num, { x: s.x, y: 2.7, w: 2.8, h: 1.0, fontSize: 36, fontFace: "Arial Black", color: WHITE, align: "center", margin: 0 });
  s10.addText(s.label, { x: s.x, y: 3.6, w: 2.8, h: 0.7, fontSize: 12, fontFace: "Calibri", color: GRAY, align: "center", margin: 0 });
});

s10.addText("Want to see it working on your own leads? Let's set up a pilot.", { x: 0.8, y: 4.8, w: 8.4, h: 0.4, fontSize: 16, fontFace: "Calibri", color: WHITE, bold: true, margin: 0 });

// ============================================================
// SAVE
// ============================================================
pres.writeFile({ fileName: "/Users/danielweadock/Conduit AI/Monican_Demo_Walkthrough.pptx" })
  .then(() => console.log("Demo deck saved!"))
  .catch(err => console.error(err));
