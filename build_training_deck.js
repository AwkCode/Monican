const pptxgen = require("pptxgenjs");

const pres = new pptxgen();
pres.layout = "LAYOUT_16x9";
pres.author = "Daniel Weadock";
pres.title = "Monican — Agentic AI Training";

// ============================================================
// DESIGN SYSTEM
// ============================================================
const C = {
  dark: "0A0A0A",
  darkCard: "1A1A2E",
  navy: "16213E",
  teal: "4ECDC4",
  tealDark: "2A9D8F",
  white: "FFFFFF",
  gray: "888888",
  lightGray: "CCCCCC",
  offWhite: "F2F2F2",
  green: "22C55E",
  yellow: "F0B060",
  red: "EF4444",
  purple: "A78BFA",
};

const makeCardShadow = () => ({ type: "outer", blur: 8, offset: 3, angle: 135, color: "000000", opacity: 0.3 });

// ============================================================
// SLIDE 1 — TITLE
// ============================================================
let s1 = pres.addSlide();
s1.background = { color: C.dark };
// Top accent bar
s1.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.06, fill: { color: C.teal } });
// Title
s1.addText("MONICAN", { x: 0.8, y: 1.2, w: 8.4, h: 1.0, fontSize: 52, fontFace: "Arial Black", color: C.white, bold: true, margin: 0 });
s1.addText("AGENTIC AI TRAINING", { x: 0.8, y: 2.1, w: 8.4, h: 0.6, fontSize: 20, fontFace: "Calibri", color: C.teal, charSpacing: 6, margin: 0 });
s1.addText("Everything you need to know to sell, build, and deliver\nAI workflow automation for small businesses.", { x: 0.8, y: 3.0, w: 7, h: 0.9, fontSize: 15, fontFace: "Calibri", color: C.gray, margin: 0 });
s1.addText("Daniel Weadock  |  April 2026", { x: 0.8, y: 4.8, w: 8, h: 0.4, fontSize: 12, fontFace: "Calibri", color: C.gray, margin: 0 });

// ============================================================
// SLIDE 2 — WHAT IS AN AI AGENT?
// ============================================================
let s2 = pres.addSlide();
s2.background = { color: C.offWhite };
s2.addText("WHAT IS AN AI AGENT?", { x: 0.8, y: 0.4, w: 8, h: 0.7, fontSize: 32, fontFace: "Arial Black", color: C.dark, margin: 0 });

// Chatbot vs Agent comparison
// Left card — Chatbot
s2.addShape(pres.shapes.RECTANGLE, { x: 0.8, y: 1.4, w: 4, h: 3.4, fill: { color: C.white }, shadow: makeCardShadow() });
s2.addShape(pres.shapes.RECTANGLE, { x: 0.8, y: 1.4, w: 4, h: 0.5, fill: { color: C.red } });
s2.addText("CHATBOT", { x: 0.8, y: 1.4, w: 4, h: 0.5, fontSize: 14, fontFace: "Calibri", color: C.white, bold: true, align: "center", valign: "middle" });
s2.addText([
  { text: "Waits for you to ask something", options: { bullet: true, breakLine: true, fontSize: 13 } },
  { text: "Gives one answer and stops", options: { bullet: true, breakLine: true, fontSize: 13 } },
  { text: "No memory between conversations", options: { bullet: true, breakLine: true, fontSize: 13 } },
  { text: "Can't take actions", options: { bullet: true, breakLine: true, fontSize: 13 } },
  { text: "You do the thinking", options: { bullet: true, fontSize: 13 } }
], { x: 1.1, y: 2.1, w: 3.4, h: 2.5, fontFace: "Calibri", color: "333333", paraSpaceAfter: 8 });

// Right card — Agent
s2.addShape(pres.shapes.RECTANGLE, { x: 5.2, y: 1.4, w: 4, h: 3.4, fill: { color: C.white }, shadow: makeCardShadow() });
s2.addShape(pres.shapes.RECTANGLE, { x: 5.2, y: 1.4, w: 4, h: 0.5, fill: { color: C.tealDark } });
s2.addText("AI AGENT", { x: 5.2, y: 1.4, w: 4, h: 0.5, fontSize: 14, fontFace: "Calibri", color: C.white, bold: true, align: "center", valign: "middle" });
s2.addText([
  { text: "Triggered automatically by events", options: { bullet: true, breakLine: true, fontSize: 13 } },
  { text: "Classifies, decides, then acts", options: { bullet: true, breakLine: true, fontSize: 13 } },
  { text: "Produces multiple structured outputs", options: { bullet: true, breakLine: true, fontSize: 13 } },
  { text: "Takes real actions (send email, update CRM)", options: { bullet: true, breakLine: true, fontSize: 13 } },
  { text: "The AI does the thinking", options: { bullet: true, fontSize: 13 } }
], { x: 5.5, y: 2.1, w: 3.4, h: 2.5, fontFace: "Calibri", color: "333333", paraSpaceAfter: 8 });

s2.addText("A chatbot is a Q&A machine. An agent is a worker.", { x: 0.8, y: 5.0, w: 8.4, h: 0.4, fontSize: 14, fontFace: "Calibri", color: C.tealDark, bold: true, italic: true, margin: 0 });

// ============================================================
// SLIDE 3 — THE 3-STEP PATTERN
// ============================================================
let s3 = pres.addSlide();
s3.background = { color: C.dark };
s3.addText("THE 3-STEP PATTERN", { x: 0.8, y: 0.4, w: 8, h: 0.7, fontSize: 32, fontFace: "Arial Black", color: C.white, margin: 0 });
s3.addText("Every AI agent in the world follows this pattern.", { x: 0.8, y: 1.0, w: 8, h: 0.4, fontSize: 14, fontFace: "Calibri", color: C.gray, margin: 0 });

// Three boxes with arrows
const boxW = 2.4, boxH = 2.8, gap = 0.5, startX = 0.8;
const arrowY = 2.6;

// Box 1 — INPUT
s3.addShape(pres.shapes.RECTANGLE, { x: startX, y: 1.8, w: boxW, h: boxH, fill: { color: "2D1B69" }, shadow: makeCardShadow() });
s3.addText("INPUT", { x: startX, y: 1.9, w: boxW, h: 0.5, fontSize: 18, fontFace: "Arial Black", color: C.purple, align: "center", margin: 0 });
s3.addText("The Trigger", { x: startX, y: 2.35, w: boxW, h: 0.3, fontSize: 11, fontFace: "Calibri", color: C.lightGray, align: "center", margin: 0 });
s3.addText([
  { text: "New lead arrives", options: { bullet: true, breakLine: true, fontSize: 11, color: C.lightGray } },
  { text: "Listing entered", options: { bullet: true, breakLine: true, fontSize: 11, color: C.lightGray } },
  { text: "Email received", options: { bullet: true, breakLine: true, fontSize: 11, color: C.lightGray } },
  { text: "Deadline approaching", options: { bullet: true, fontSize: 11, color: C.lightGray } }
], { x: startX + 0.3, y: 2.8, w: boxW - 0.5, h: 1.6, fontFace: "Calibri", paraSpaceAfter: 4 });

// Arrow 1
s3.addText("\u2192", { x: startX + boxW, y: arrowY, w: gap, h: 0.5, fontSize: 28, color: C.teal, align: "center", valign: "middle" });

// Box 2 — PROCESSING
const box2X = startX + boxW + gap;
s3.addShape(pres.shapes.RECTANGLE, { x: box2X, y: 1.8, w: boxW, h: boxH, fill: { color: "1A3A2A" }, shadow: makeCardShadow() });
s3.addText("PROCESSING", { x: box2X, y: 1.9, w: boxW, h: 0.5, fontSize: 18, fontFace: "Arial Black", color: C.teal, align: "center", margin: 0 });
s3.addText("The Brain", { x: box2X, y: 2.35, w: boxW, h: 0.3, fontSize: 11, fontFace: "Calibri", color: C.lightGray, align: "center", margin: 0 });
s3.addText([
  { text: "Classify the input", options: { bullet: true, breakLine: true, fontSize: 11, color: C.lightGray } },
  { text: "Pull in extra data", options: { bullet: true, breakLine: true, fontSize: 11, color: C.lightGray } },
  { text: "Decide what to do", options: { bullet: true, breakLine: true, fontSize: 11, color: C.lightGray } },
  { text: "Generate response", options: { bullet: true, fontSize: 11, color: C.lightGray } }
], { x: box2X + 0.3, y: 2.8, w: boxW - 0.5, h: 1.6, fontFace: "Calibri", paraSpaceAfter: 4 });

// Arrow 2
s3.addText("\u2192", { x: box2X + boxW, y: arrowY, w: gap, h: 0.5, fontSize: 28, color: C.teal, align: "center", valign: "middle" });

// Box 3 — OUTPUT
const box3X = box2X + boxW + gap;
s3.addShape(pres.shapes.RECTANGLE, { x: box3X, y: 1.8, w: boxW, h: boxH, fill: { color: "3A2A1A" }, shadow: makeCardShadow() });
s3.addText("OUTPUT", { x: box3X, y: 1.9, w: boxW, h: 0.5, fontSize: 18, fontFace: "Arial Black", color: C.yellow, align: "center", margin: 0 });
s3.addText("The Actions", { x: box3X, y: 2.35, w: boxW, h: 0.3, fontSize: 11, fontFace: "Calibri", color: C.lightGray, align: "center", margin: 0 });
s3.addText([
  { text: "Send email response", options: { bullet: true, breakLine: true, fontSize: 11, color: C.lightGray } },
  { text: "Update CRM", options: { bullet: true, breakLine: true, fontSize: 11, color: C.lightGray } },
  { text: "Create document", options: { bullet: true, breakLine: true, fontSize: 11, color: C.lightGray } },
  { text: "Alert the team", options: { bullet: true, fontSize: 11, color: C.lightGray } }
], { x: box3X + 0.3, y: 2.8, w: boxW - 0.5, h: 1.6, fontFace: "Calibri", paraSpaceAfter: 4 });

// ============================================================
// SLIDE 4 — REAL EXAMPLE: LEAD RESPONDER
// ============================================================
let s4 = pres.addSlide();
s4.background = { color: C.offWhite };
s4.addText("REAL EXAMPLE: LEAD RESPONDER", { x: 0.8, y: 0.4, w: 8, h: 0.6, fontSize: 28, fontFace: "Arial Black", color: C.dark, margin: 0 });

s4.addShape(pres.shapes.RECTANGLE, { x: 0.8, y: 1.2, w: 8.4, h: 3.8, fill: { color: C.white }, shadow: makeCardShadow() });

s4.addText([
  { text: "INPUT:  ", options: { bold: true, color: "7C3AED", fontSize: 12, breakLine: false } },
  { text: 'New lead from Zillow: "I\'m interested in 47 Wattaquadock Hill Rd. Can I schedule a showing? We\'re relocating for the school district."', options: { fontSize: 12, color: "333333", breakLine: true } },
  { text: "", options: { breakLine: true, fontSize: 8 } },
  { text: "PROCESSING:", options: { bold: true, color: C.tealDark, fontSize: 12, breakLine: true } },
  { text: "  1. CLASSIFY ", options: { bold: true, fontSize: 12, color: "333333", breakLine: false } },
  { text: '\u2192 This is a "showing request" (not a general question)', options: { fontSize: 12, color: "555555", breakLine: true } },
  { text: "  2. PERSONALIZE ", options: { bold: true, fontSize: 12, color: "333333", breakLine: false } },
  { text: "\u2192 Use their name, reference the specific property", options: { fontSize: 12, color: "555555", breakLine: true } },
  { text: "  3. DETECT SIGNALS ", options: { bold: true, fontSize: 12, color: "333333", breakLine: false } },
  { text: '\u2192 They mentioned "relocating" and "schools" \u2192 add school info', options: { fontSize: 12, color: "555555", breakLine: true } },
  { text: "", options: { breakLine: true, fontSize: 8 } },
  { text: "OUTPUT:", options: { bold: true, color: "D97706", fontSize: 12, breakLine: true } },
  { text: "  \u2713 Personalized email with showing times", options: { fontSize: 12, color: "333333", breakLine: true } },
  { text: "  \u2713 CRM notes: Hot lead, Zillow, relocating, schools priority", options: { fontSize: 12, color: "333333", breakLine: true } },
  { text: "  \u2713 Follow-up plan: Day 0 email, Day 1 call, Day 3 follow-up", options: { fontSize: 12, color: "333333" } }
], { x: 1.2, y: 1.4, w: 7.6, h: 3.4, fontFace: "Calibri" });

s4.addText("A human takes 10-15 min per lead. The agent does it in 10 seconds.", { x: 0.8, y: 5.1, w: 8.4, h: 0.35, fontSize: 13, fontFace: "Calibri", color: C.tealDark, bold: true, italic: true, margin: 0 });

// ============================================================
// SLIDE 5 — THE TOOL STACK
// ============================================================
let s5 = pres.addSlide();
s5.background = { color: C.dark };
s5.addText("THE TOOL STACK", { x: 0.8, y: 0.3, w: 8, h: 0.6, fontSize: 32, fontFace: "Arial Black", color: C.white, margin: 0 });
s5.addText("4 layers. Every agent uses some combination of these.", { x: 0.8, y: 0.85, w: 8, h: 0.35, fontSize: 13, fontFace: "Calibri", color: C.gray, margin: 0 });

const layers = [
  { label: "TRIGGER", color: "7C3AED", desc: "What starts the agent", tools: "Zapier, Make, n8n, CRM webhooks" },
  { label: "BRAIN", color: C.teal, desc: "Where the AI thinking happens", tools: "Claude, GPT-4, Gemini + custom prompts" },
  { label: "ACTION", color: "D97706", desc: "What the agent does", tools: "SendGrid, Twilio, CRM APIs, Google Sheets" },
  { label: "INTERFACE", color: C.green, desc: "How humans interact", tools: "Website chatbot, web form, Slack, email" }
];

layers.forEach((layer, i) => {
  const y = 1.5 + i * 0.95;
  s5.addShape(pres.shapes.RECTANGLE, { x: 0.8, y: y, w: 8.4, h: 0.8, fill: { color: C.darkCard } });
  s5.addShape(pres.shapes.RECTANGLE, { x: 0.8, y: y, w: 0.08, h: 0.8, fill: { color: layer.color } });
  s5.addText(layer.label, { x: 1.2, y: y, w: 1.6, h: 0.8, fontSize: 14, fontFace: "Arial Black", color: layer.color, valign: "middle", margin: 0 });
  s5.addText(layer.desc, { x: 2.8, y: y, w: 2.8, h: 0.8, fontSize: 12, fontFace: "Calibri", color: C.lightGray, valign: "middle", margin: 0 });
  s5.addText(layer.tools, { x: 5.8, y: y, w: 3.2, h: 0.8, fontSize: 11, fontFace: "Calibri", color: C.gray, valign: "middle", margin: 0 });
});

// ============================================================
// SLIDE 6 — YOUR CORE TOOLS
// ============================================================
let s6 = pres.addSlide();
s6.background = { color: C.offWhite };
s6.addText("YOUR CORE 5 TOOLS", { x: 0.8, y: 0.3, w: 8, h: 0.6, fontSize: 28, fontFace: "Arial Black", color: C.dark, margin: 0 });
s6.addText("Master these before anything else.", { x: 0.8, y: 0.85, w: 8, h: 0.3, fontSize: 13, fontFace: "Calibri", color: C.gray, margin: 0 });

const tools = [
  { name: "n8n", cat: "Workflow Automation", price: "Free self-hosted", aff: "30% / 12mo", color: "EA4B71" },
  { name: "Make.com", cat: "Workflow Automation", price: "From $9/mo", aff: "35% / 12mo", color: "6D28D9" },
  { name: "CustomGPT", cat: "Knowledge Chatbot", price: "From $99/mo", aff: "20% / 2yrs", color: "0891B2" },
  { name: "Lindy AI", cat: "AI Agent Platform", price: "From $8/mo", aff: "Partner rev share", color: "059669" },
  { name: "Claude", cat: "Your AI Engine", price: "$20/mo Pro", aff: "N/A (your co-builder)", color: "D97706" }
];

tools.forEach((tool, i) => {
  const y = 1.4 + i * 0.78;
  s6.addShape(pres.shapes.RECTANGLE, { x: 0.8, y: y, w: 8.4, h: 0.65, fill: { color: C.white }, shadow: makeCardShadow() });
  s6.addShape(pres.shapes.RECTANGLE, { x: 0.8, y: y, w: 0.08, h: 0.65, fill: { color: tool.color } });
  s6.addText(tool.name, { x: 1.15, y: y, w: 1.5, h: 0.65, fontSize: 14, fontFace: "Calibri", color: C.dark, bold: true, valign: "middle", margin: 0 });
  s6.addText(tool.cat, { x: 2.7, y: y, w: 2.2, h: 0.65, fontSize: 11, fontFace: "Calibri", color: C.gray, valign: "middle", margin: 0 });
  s6.addText(tool.price, { x: 4.9, y: y, w: 1.8, h: 0.65, fontSize: 11, fontFace: "Calibri", color: "333333", valign: "middle", margin: 0 });
  s6.addText(tool.aff, { x: 6.9, y: y, w: 2.2, h: 0.65, fontSize: 11, fontFace: "Calibri", color: C.tealDark, bold: true, valign: "middle", margin: 0 });
});

// ============================================================
// SLIDE 7 — THE CLIENT CONVERSATION
// ============================================================
let s7 = pres.addSlide();
s7.background = { color: C.dark };
s7.addText("WHAT CLIENTS SAY \u2192 WHAT YOU RECOMMEND", { x: 0.8, y: 0.3, w: 8.4, h: 0.6, fontSize: 24, fontFace: "Arial Black", color: C.white, margin: 0 });

const recs = [
  { say: '"Our inbox is drowning"', rec: "Lindy AI email triage", price: "$50/mo" },
  { say: '"We answer the same Qs"', rec: "CustomGPT chatbot", price: "$99/mo" },
  { say: '"Lead follow-up is slow"', rec: "n8n + Instantly", price: "$47-97/mo" },
  { say: '"Reports take forever"', rec: "n8n + Claude API", price: "Usage-based" },
  { say: '"Phones overwhelm us"', rec: "Retell AI voice agent", price: "Pay-per-min" },
  { say: '"Everything is manual"', rec: "Full audit \u2192 n8n/Make", price: "$1,500 pilot" }
];

// Header row
s7.addShape(pres.shapes.RECTANGLE, { x: 0.8, y: 1.1, w: 8.4, h: 0.45, fill: { color: C.teal } });
s7.addText("CLIENT SAYS", { x: 1.0, y: 1.1, w: 3.5, h: 0.45, fontSize: 11, fontFace: "Calibri", color: C.dark, bold: true, valign: "middle", margin: 0 });
s7.addText("YOU RECOMMEND", { x: 4.5, y: 1.1, w: 3, h: 0.45, fontSize: 11, fontFace: "Calibri", color: C.dark, bold: true, valign: "middle", margin: 0 });
s7.addText("PRICE", { x: 7.6, y: 1.1, w: 1.5, h: 0.45, fontSize: 11, fontFace: "Calibri", color: C.dark, bold: true, valign: "middle", margin: 0 });

recs.forEach((r, i) => {
  const y = 1.6 + i * 0.58;
  const bgColor = i % 2 === 0 ? C.darkCard : "111122";
  s7.addShape(pres.shapes.RECTANGLE, { x: 0.8, y: y, w: 8.4, h: 0.5, fill: { color: bgColor } });
  s7.addText(r.say, { x: 1.0, y: y, w: 3.5, h: 0.5, fontSize: 12, fontFace: "Calibri", color: C.yellow, italic: true, valign: "middle", margin: 0 });
  s7.addText(r.rec, { x: 4.5, y: y, w: 3, h: 0.5, fontSize: 12, fontFace: "Calibri", color: C.white, valign: "middle", margin: 0 });
  s7.addText(r.price, { x: 7.6, y: y, w: 1.5, h: 0.5, fontSize: 12, fontFace: "Calibri", color: C.teal, valign: "middle", margin: 0 });
});

// ============================================================
// SLIDE 8 — PRICING PHASES
// ============================================================
let s8 = pres.addSlide();
s8.background = { color: C.offWhite };
s8.addText("YOUR PRICING STRATEGY", { x: 0.8, y: 0.3, w: 8, h: 0.6, fontSize: 28, fontFace: "Arial Black", color: C.dark, margin: 0 });
s8.addText("Start low to earn proof. Raise prices with case studies.", { x: 0.8, y: 0.85, w: 8, h: 0.3, fontSize: 13, fontFace: "Calibri", color: C.gray, margin: 0 });

// Phase 1
s8.addShape(pres.shapes.RECTANGLE, { x: 0.5, y: 1.5, w: 2.8, h: 3.5, fill: { color: C.white }, shadow: makeCardShadow() });
s8.addShape(pres.shapes.RECTANGLE, { x: 0.5, y: 1.5, w: 2.8, h: 0.55, fill: { color: C.tealDark } });
s8.addText("PHASE 1: NOW", { x: 0.5, y: 1.5, w: 2.8, h: 0.55, fontSize: 13, fontFace: "Calibri", color: C.white, bold: true, align: "center", valign: "middle" });
s8.addText([
  { text: "Free Audit", options: { bold: true, fontSize: 14, breakLine: true, color: "333333" } },
  { text: "Lead magnet. Get in the door.", options: { fontSize: 11, breakLine: true, color: C.gray } },
  { text: "", options: { breakLine: true, fontSize: 6 } },
  { text: "$500 Quick Win", options: { bold: true, fontSize: 14, breakLine: true, color: "333333" } },
  { text: "One workflow automated.", options: { fontSize: 11, breakLine: true, color: C.gray } },
  { text: "", options: { breakLine: true, fontSize: 6 } },
  { text: "$1,500 Pilot", options: { bold: true, fontSize: 14, breakLine: true, color: "333333" } },
  { text: "3 workflows + case study.", options: { fontSize: 11, color: C.gray } }
], { x: 0.7, y: 2.2, w: 2.4, h: 2.6, fontFace: "Calibri" });

// Phase 2
s8.addShape(pres.shapes.RECTANGLE, { x: 3.6, y: 1.5, w: 2.8, h: 3.5, fill: { color: C.white }, shadow: makeCardShadow() });
s8.addShape(pres.shapes.RECTANGLE, { x: 3.6, y: 1.5, w: 2.8, h: 0.55, fill: { color: "6D28D9" } });
s8.addText("PHASE 2: 3+ CLIENTS", { x: 3.6, y: 1.5, w: 2.8, h: 0.55, fontSize: 13, fontFace: "Calibri", color: C.white, bold: true, align: "center", valign: "middle" });
s8.addText([
  { text: "$1,500 Audit", options: { bold: true, fontSize: 14, breakLine: true, color: "333333" } },
  { text: "Full workflow report.", options: { fontSize: 11, breakLine: true, color: C.gray } },
  { text: "", options: { breakLine: true, fontSize: 6 } },
  { text: "$2.5-5K Agent Build", options: { bold: true, fontSize: 14, breakLine: true, color: "333333" } },
  { text: "Custom automation.", options: { fontSize: 11, breakLine: true, color: C.gray } },
  { text: "", options: { breakLine: true, fontSize: 6 } },
  { text: "$750-2K/mo Retainer", options: { bold: true, fontSize: 14, breakLine: true, color: "333333" } },
  { text: "Ongoing optimization.", options: { fontSize: 11, color: C.gray } }
], { x: 3.8, y: 2.2, w: 2.4, h: 2.6, fontFace: "Calibri" });

// Phase 3
s8.addShape(pres.shapes.RECTANGLE, { x: 6.7, y: 1.5, w: 2.8, h: 3.5, fill: { color: C.white }, shadow: makeCardShadow() });
s8.addShape(pres.shapes.RECTANGLE, { x: 6.7, y: 1.5, w: 2.8, h: 0.55, fill: { color: "B45309" } });
s8.addText("PHASE 3: 6+ MONTHS", { x: 6.7, y: 1.5, w: 2.8, h: 0.55, fontSize: 13, fontFace: "Calibri", color: C.white, bold: true, align: "center", valign: "middle" });
s8.addText([
  { text: "$3-5K Strategy", options: { bold: true, fontSize: 14, breakLine: true, color: "333333" } },
  { text: "Enterprise-level audits.", options: { fontSize: 11, breakLine: true, color: C.gray } },
  { text: "", options: { breakLine: true, fontSize: 6 } },
  { text: "$5-15K Builds", options: { bold: true, fontSize: 14, breakLine: true, color: "333333" } },
  { text: "Multi-department projects.", options: { fontSize: 11, breakLine: true, color: C.gray } },
  { text: "", options: { breakLine: true, fontSize: 6 } },
  { text: "$3-5K/mo Fractional", options: { bold: true, fontSize: 14, breakLine: true, color: "333333" } },
  { text: "AI Operations Officer.", options: { fontSize: 11, color: C.gray } }
], { x: 6.9, y: 2.2, w: 2.4, h: 2.6, fontFace: "Calibri" });

// ============================================================
// SLIDE 9 — ROI MATH
// ============================================================
let s9 = pres.addSlide();
s9.background = { color: C.dark };
s9.addText("THE ROI MATH", { x: 0.8, y: 0.3, w: 8, h: 0.6, fontSize: 32, fontFace: "Arial Black", color: C.white, margin: 0 });
s9.addText("This is how you justify your price on every single call.", { x: 0.8, y: 0.85, w: 8, h: 0.35, fontSize: 13, fontFace: "Calibri", color: C.gray, margin: 0 });

// Formula
s9.addShape(pres.shapes.RECTANGLE, { x: 0.8, y: 1.5, w: 8.4, h: 0.7, fill: { color: C.darkCard } });
s9.addText("Time Saved  x  Hourly Cost  =  Value Created.    Your price = 20-30% of annual value.", { x: 1.0, y: 1.5, w: 8, h: 0.7, fontSize: 15, fontFace: "Calibri", color: C.teal, bold: true, valign: "middle", margin: 0 });

// Example
s9.addShape(pres.shapes.RECTANGLE, { x: 0.8, y: 2.5, w: 8.4, h: 2.6, fill: { color: C.darkCard }, shadow: makeCardShadow() });
s9.addText("EXAMPLE: Lead Response Agent", { x: 1.1, y: 2.6, w: 8, h: 0.4, fontSize: 16, fontFace: "Calibri", color: C.white, bold: true, margin: 0 });

s9.addText([
  { text: "15 min/lead  x  20 leads/week  =  5 hours/week", options: { fontSize: 13, breakLine: true, color: C.lightGray } },
  { text: "5 hrs  x  $25/hr  =  $125/week  =  $6,500/year", options: { fontSize: 13, breakLine: true, color: C.lightGray } },
  { text: "Agent saves 80%  =  $5,200/year in value", options: { fontSize: 13, breakLine: true, color: C.lightGray } },
  { text: "", options: { breakLine: true, fontSize: 6 } },
  { text: "Your price: $1,500 build + $750/mo retainer", options: { fontSize: 14, bold: true, breakLine: true, color: C.teal } },
  { text: "Client breaks even in 2-3 months. Pure savings after that.", options: { fontSize: 13, bold: true, color: C.green } }
], { x: 1.3, y: 3.1, w: 7.6, h: 1.8, fontFace: "Calibri" });

// ============================================================
// SLIDE 10 — REVENUE STACKING
// ============================================================
let s10 = pres.addSlide();
s10.background = { color: C.offWhite };
s10.addText("REVENUE STACKING", { x: 0.8, y: 0.3, w: 8, h: 0.6, fontSize: 28, fontFace: "Arial Black", color: C.dark, margin: 0 });
s10.addText("One client, three revenue streams. Here's the math.", { x: 0.8, y: 0.85, w: 8, h: 0.3, fontSize: 13, fontFace: "Calibri", color: C.gray, margin: 0 });

// Big number callout
s10.addShape(pres.shapes.RECTANGLE, { x: 0.8, y: 1.4, w: 3.6, h: 2.2, fill: { color: C.white }, shadow: makeCardShadow() });
s10.addText("$10,415", { x: 0.8, y: 1.5, w: 3.6, h: 1.2, fontSize: 48, fontFace: "Arial Black", color: C.tealDark, align: "center", valign: "middle", margin: 0 });
s10.addText("Year 1 from ONE client", { x: 0.8, y: 2.7, w: 3.6, h: 0.5, fontSize: 14, fontFace: "Calibri", color: C.gray, align: "center", margin: 0 });

// Breakdown
s10.addShape(pres.shapes.RECTANGLE, { x: 4.8, y: 1.4, w: 4.4, h: 2.2, fill: { color: C.white }, shadow: makeCardShadow() });
s10.addText([
  { text: "Pilot Package:  ", options: { bold: true, fontSize: 13, color: "333333", breakLine: false } },
  { text: "$1,500 (one-time)", options: { fontSize: 13, color: C.gray, breakLine: true } },
  { text: "Monthly Retainer:  ", options: { bold: true, fontSize: 13, color: "333333", breakLine: false } },
  { text: "$750 x 11 mo = $8,250", options: { fontSize: 13, color: C.gray, breakLine: true } },
  { text: "Tool Affiliates:  ", options: { bold: true, fontSize: 13, color: "333333", breakLine: false } },
  { text: "$665/yr (Make + CustomGPT + Tidio)", options: { fontSize: 13, color: C.gray, breakLine: true } },
  { text: "", options: { breakLine: true, fontSize: 6 } },
  { text: "5 clients  =  $50K-60K/year", options: { bold: true, fontSize: 15, color: C.tealDark } }
], { x: 5.1, y: 1.6, w: 3.8, h: 1.8, fontFace: "Calibri" });

// Scale visual
s10.addShape(pres.shapes.RECTANGLE, { x: 0.8, y: 4.0, w: 8.4, h: 1.2, fill: { color: C.white }, shadow: makeCardShadow() });
const milestones = [
  { label: "3 clients", val: "$30K", x: 1.2 },
  { label: "5 clients", val: "$50-60K", x: 3.4 },
  { label: "10 clients", val: "$100-120K", x: 5.6 },
  { label: "15 clients", val: "$150K+", x: 7.8 }
];
milestones.forEach(m => {
  s10.addText(m.val, { x: m.x, y: 4.1, w: 1.8, h: 0.5, fontSize: 18, fontFace: "Arial Black", color: C.tealDark, align: "center", margin: 0 });
  s10.addText(m.label, { x: m.x, y: 4.6, w: 1.8, h: 0.4, fontSize: 11, fontFace: "Calibri", color: C.gray, align: "center", margin: 0 });
});

// ============================================================
// SLIDE 11 — THE DISCOVERY CALL
// ============================================================
let s11 = pres.addSlide();
s11.background = { color: C.dark };
s11.addText("THE DISCOVERY CALL", { x: 0.8, y: 0.3, w: 8, h: 0.6, fontSize: 32, fontFace: "Arial Black", color: C.white, margin: 0 });
s11.addText("30 minutes. 5 sections. Here's the structure.", { x: 0.8, y: 0.85, w: 8, h: 0.3, fontSize: 13, fontFace: "Calibri", color: C.gray, margin: 0 });

const callSteps = [
  { num: "01", name: "OPEN", time: "3 min", desc: "Build rapport. Set the frame. You're here to listen, not pitch." },
  { num: "02", name: "UNDERSTAND", time: "7 min", desc: 'Map their world. "Walk me through a typical week."' },
  { num: "03", name: "FIND PAIN", time: "10 min", desc: "Drill into specific workflows. Get hours, frequency, error rates." },
  { num: "04", name: "QUALIFY", time: "5 min", desc: "Budget signal, decision authority, timeline. Can this become paid work?" },
  { num: "05", name: "CLOSE", time: "5 min", desc: '"Can I put together a short proposal based on what you told me?"' }
];

callSteps.forEach((step, i) => {
  const y = 1.4 + i * 0.78;
  s11.addShape(pres.shapes.RECTANGLE, { x: 0.8, y: y, w: 8.4, h: 0.65, fill: { color: C.darkCard } });
  s11.addText(step.num, { x: 0.9, y: y, w: 0.6, h: 0.65, fontSize: 20, fontFace: "Arial Black", color: C.teal, valign: "middle", margin: 0 });
  s11.addText(step.name, { x: 1.5, y: y, w: 1.8, h: 0.65, fontSize: 14, fontFace: "Calibri", color: C.white, bold: true, valign: "middle", margin: 0 });
  s11.addText(step.time, { x: 3.2, y: y, w: 0.8, h: 0.65, fontSize: 11, fontFace: "Calibri", color: C.teal, valign: "middle", margin: 0 });
  s11.addText(step.desc, { x: 4.1, y: y, w: 4.9, h: 0.65, fontSize: 11, fontFace: "Calibri", color: C.lightGray, valign: "middle", margin: 0 });
});

// ============================================================
// SLIDE 12 — KEY QUESTIONS
// ============================================================
let s12 = pres.addSlide();
s12.background = { color: C.offWhite };
s12.addText("QUESTIONS THAT CLOSE DEALS", { x: 0.8, y: 0.3, w: 8, h: 0.6, fontSize: 28, fontFace: "Arial Black", color: C.dark, margin: 0 });

const questions = [
  { q: '"Walk me through a typical week. What takes up most of your time?"', why: "Reveals their perception of where time goes" },
  { q: '"When a new lead comes in, what happens? Walk me through the steps."', why: "Maps the core workflow \u2014 this is where the money is" },
  { q: '"How many times per week does that happen? How long each time?"', why: "Gets you the numbers for ROI math" },
  { q: '"If you could wave a magic wand and fix one thing, what would it be?"', why: "Their #1 priority \u2014 lead your proposal with this" },
  { q: '"If we could cut that time by 80% for $X/month, would that make sense?"', why: "Budget signal \u2014 watch their reaction" }
];

questions.forEach((item, i) => {
  const y = 1.2 + i * 0.85;
  s12.addShape(pres.shapes.RECTANGLE, { x: 0.8, y: y, w: 8.4, h: 0.72, fill: { color: C.white }, shadow: makeCardShadow() });
  s12.addShape(pres.shapes.RECTANGLE, { x: 0.8, y: y, w: 0.08, h: 0.72, fill: { color: C.tealDark } });
  s12.addText(item.q, { x: 1.15, y: y, w: 5.2, h: 0.72, fontSize: 11, fontFace: "Calibri", color: "333333", italic: true, valign: "middle", margin: 0 });
  s12.addText(item.why, { x: 6.5, y: y, w: 2.5, h: 0.72, fontSize: 10, fontFace: "Calibri", color: C.tealDark, valign: "middle", margin: 0 });
});

// ============================================================
// SLIDE 13 — YOUR PITCH
// ============================================================
let s13 = pres.addSlide();
s13.background = { color: C.dark };
s13.addText("YOUR PITCH (MEMORIZE THIS)", { x: 0.8, y: 0.3, w: 8, h: 0.6, fontSize: 28, fontFace: "Arial Black", color: C.white, margin: 0 });

s13.addShape(pres.shapes.RECTANGLE, { x: 0.8, y: 1.2, w: 8.4, h: 3.8, fill: { color: C.darkCard }, shadow: makeCardShadow() });
s13.addShape(pres.shapes.RECTANGLE, { x: 0.8, y: 1.2, w: 0.08, h: 3.8, fill: { color: C.teal } });

s13.addText([
  { text: '"You know how your team spends hours every week on [specific task]?', options: { fontSize: 14, italic: true, color: C.white, breakLine: true } },
  { text: "", options: { breakLine: true, fontSize: 8 } },
  { text: "I build AI systems that handle that automatically.", options: { fontSize: 14, italic: true, color: C.white, breakLine: true } },
  { text: "", options: { breakLine: true, fontSize: 8 } },
  { text: "When a new lead comes in, right now someone reads it, figures out what they want, drafts a response, updates your CRM, and sets a reminder. That's 10-15 minutes per lead.", options: { fontSize: 14, italic: true, color: C.lightGray, breakLine: true } },
  { text: "", options: { breakLine: true, fontSize: 8 } },
  { text: "I build an agent that does all of that in 10 seconds. Response time goes from hours to seconds, and your team gets that time back.", options: { fontSize: 14, italic: true, color: C.lightGray, breakLine: true } },
  { text: "", options: { breakLine: true, fontSize: 8 } },
  { text: 'The same pattern works for listings, transaction tracking, email \u2014 any workflow where your team does the same steps over and over."', options: { fontSize: 14, italic: true, color: C.teal } }
], { x: 1.2, y: 1.4, w: 7.6, h: 3.4, fontFace: "Calibri" });

// ============================================================
// SLIDE 14 — WHAT YOU DON'T NEED TO KNOW
// ============================================================
let s14 = pres.addSlide();
s14.background = { color: C.offWhite };
s14.addText("WHAT YOU DON'T NEED TO KNOW", { x: 0.8, y: 0.3, w: 8, h: 0.6, fontSize: 28, fontFace: "Arial Black", color: C.dark, margin: 0 });
s14.addText("Stop worrying about these. Focus on what matters.", { x: 0.8, y: 0.85, w: 8, h: 0.3, fontSize: 13, fontFace: "Calibri", color: C.gray, margin: 0 });

// Don't need
const donts = ["How neural networks work", "Fine-tuning models", "Transformer architecture", "Training custom models", "Writing complex code"];
donts.forEach((d, i) => {
  const y = 1.5 + i * 0.45;
  s14.addText("\u2717  " + d, { x: 0.8, y: y, w: 4, h: 0.4, fontSize: 14, fontFace: "Calibri", color: C.red, margin: 0 });
});

// Do need
const dos = ["How workflows work (what steps humans take)", "Which tool fits which problem", "How to calculate ROI for a client", "How to demo a working agent", "How to explain this in plain English"];
dos.forEach((d, i) => {
  const y = 1.5 + i * 0.45;
  s14.addText("\u2713  " + d, { x: 5.2, y: y, w: 4, h: 0.4, fontSize: 14, fontFace: "Calibri", color: C.green, bold: true, margin: 0 });
});

s14.addText("The AI is the easy part. The business understanding is the hard part \u2014 and that's where you add value.", { x: 0.8, y: 4.5, w: 8.4, h: 0.6, fontSize: 14, fontFace: "Calibri", color: C.tealDark, bold: true, italic: true, margin: 0 });

// ============================================================
// SLIDE 15 — NOW GO
// ============================================================
let s15 = pres.addSlide();
s15.background = { color: C.dark };
s15.addShape(pres.shapes.RECTANGLE, { x: 0, y: 5.525, w: 10, h: 0.1, fill: { color: C.teal } });

s15.addText("NOW GO TALK\nTO PEOPLE.", { x: 0.8, y: 1.0, w: 8.4, h: 2.0, fontSize: 48, fontFace: "Arial Black", color: C.white, margin: 0 });
s15.addText([
  { text: "1. Open prospects.xlsx", options: { breakLine: true, fontSize: 16, color: C.teal } },
  { text: "2. Pick the top 3 green rows closest to Bolton", options: { breakLine: true, fontSize: 16, color: C.teal } },
  { text: "3. Send the first email today", options: { fontSize: 16, color: C.teal } }
], { x: 0.8, y: 3.2, w: 8, h: 1.5, fontFace: "Calibri", bold: true });
s15.addText("The plan is done. The system is built. The only thing left is you.", { x: 0.8, y: 4.9, w: 8, h: 0.4, fontSize: 13, fontFace: "Calibri", color: C.gray, italic: true, margin: 0 });

// ============================================================
// SAVE
// ============================================================
pres.writeFile({ fileName: "/Users/danielweadock/Conduit AI/Monican_Training.pptx" })
  .then(() => console.log("Presentation saved!"))
  .catch(err => console.error(err));
