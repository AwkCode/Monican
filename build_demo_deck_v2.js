const pptxgen = require("pptxgenjs");
const fs = require("fs");
const path = require("path");
const pres = new pptxgen();
pres.layout = "LAYOUT_16x9";
pres.author = "Daniel Weadock";
pres.title = "Monican — How It Works";

const BG = "090909";
const CARD = "141414";
const WHITE = "FFFFFF";
const GRAY = "777777";
const LGRAY = "AAAAAA";
const GREEN = "22C55E";
const RED = "DC3545";

const ssDir = path.join(__dirname, "demo", "screenshots");
const makeShadow = () => ({ type: "outer", blur: 6, offset: 2, angle: 135, color: "000000", opacity: 0.5 });

// Helper to load image as base64
function img(name) {
  const data = fs.readFileSync(path.join(ssDir, name));
  return "image/png;base64," + data.toString("base64");
}

// ============ SLIDE 1 — TITLE ============
let s1 = pres.addSlide();
s1.background = { color: BG };
s1.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.04, fill: { color: WHITE } });
s1.addText("How AI Agents\nWork For You", { x: 0.8, y: 1.0, w: 8, h: 2.2, fontSize: 48, fontFace: "Arial Black", color: WHITE, margin: 0 });
s1.addText("A visual walkthrough of how we automate your most\ntime-consuming workflows — in real time.", { x: 0.8, y: 3.2, w: 7, h: 0.8, fontSize: 15, fontFace: "Calibri", color: GRAY, margin: 0 });
s1.addText("Monican", { x: 0.8, y: 4.8, w: 3, h: 0.4, fontSize: 13, fontFace: "Calibri", color: GRAY, margin: 0 });

// ============ SLIDE 2 — THE PROBLEM ============
let s2 = pres.addSlide();
s2.background = { color: BG };
s2.addText("THE PROBLEM", { x: 0.8, y: 0.3, w: 8, h: 0.5, fontSize: 32, fontFace: "Arial Black", color: WHITE, margin: 0 });
s2.addText("When a lead comes in, this is what happens today:", { x: 0.8, y: 0.8, w: 8, h: 0.3, fontSize: 13, fontFace: "Calibri", color: GRAY, margin: 0 });

const steps = [
  { time: "9:02 AM", task: "New lead arrives from Zillow", color: WHITE },
  { time: "9:02 AM", task: "Lead sits in inbox, waiting...", color: GRAY },
  { time: "11:45 AM", task: "Agent finally sees it (2.5 hrs later)", color: RED },
  { time: "11:50 AM", task: "Agent reads message, decides how to respond", color: RED },
  { time: "12:00 PM", task: "Types personalized response manually", color: RED },
  { time: "12:05 PM", task: "Updates CRM, sets follow-up reminder", color: RED },
  { time: "12:10 PM", task: "Done. 15 minutes of work. Lead already went cold.", color: RED },
];
steps.forEach((s, i) => {
  const y = 1.3 + i * 0.52;
  s2.addShape(pres.shapes.RECTANGLE, { x: 0.8, y: y, w: 8.4, h: 0.42, fill: { color: CARD } });
  s2.addText(s.time, { x: 1.0, y: y, w: 1.3, h: 0.42, fontSize: 11, fontFace: "Calibri", color: GRAY, valign: "middle", bold: true, margin: 0 });
  s2.addText(s.task, { x: 2.3, y: y, w: 6.7, h: 0.42, fontSize: 13, fontFace: "Calibri", color: s.color, valign: "middle", margin: 0 });
});
s2.addShape(pres.shapes.RECTANGLE, { x: 0.8, y: 5.0, w: 8.4, h: 0.35, fill: { color: RED } });
s2.addText("20 leads/week × 15 min = 5 hours/week wasted. Leads go cold. Money lost.", { x: 1.0, y: 5.0, w: 8, h: 0.35, fontSize: 12, fontFace: "Calibri", color: WHITE, valign: "middle", bold: true, margin: 0 });

// ============ SLIDE 3 — STEP 1: LEAD ARRIVES (SCREENSHOT) ============
let s3 = pres.addSlide();
s3.background = { color: BG };
s3.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.45, fill: { color: CARD } });
s3.addText("STEP 1", { x: 0.8, y: 0, w: 1.5, h: 0.45, fontSize: 12, fontFace: "Calibri", color: GREEN, valign: "middle", bold: true, margin: 0 });
s3.addText("A New Lead Arrives", { x: 2.3, y: 0, w: 5, h: 0.45, fontSize: 12, fontFace: "Calibri", color: WHITE, valign: "middle", charSpacing: 2, margin: 0 });
s3.addText("9:02 AM", { x: 8.0, y: 0, w: 1.5, h: 0.45, fontSize: 12, fontFace: "Calibri", color: GRAY, valign: "middle", margin: 0 });

// Inbox screenshot
const inboxImg = img("inbox.png");
// Image is 1200x323, display at good size
const inboxW = 8.4;
const inboxH = inboxW * (323/1200);
s3.addImage({ data: inboxImg, x: 0.8, y: 0.8, w: inboxW, h: inboxH, shadow: makeShadow() });

s3.addText("Sarah Chen from Zillow wants to schedule a showing at 47 Wattaquadock Hill Rd.\nShe mentions relocating from Worcester for the school district.", { x: 0.8, y: 0.8 + inboxH + 0.3, w: 8.4, h: 0.7, fontSize: 14, fontFace: "Calibri", color: LGRAY, margin: 0 });

s3.addText("Without AI: this sits for 2+ hours. With AI: processed in 10 seconds.", { x: 0.8, y: 5.0, w: 8.4, h: 0.35, fontSize: 14, fontFace: "Calibri", color: WHITE, bold: true, margin: 0 });

// ============ SLIDE 4 — STEP 2: AI PROCESSES (SCREENSHOT) ============
let s4 = pres.addSlide();
s4.background = { color: BG };
s4.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.45, fill: { color: CARD } });
s4.addText("STEP 2", { x: 0.8, y: 0, w: 1.5, h: 0.45, fontSize: 12, fontFace: "Calibri", color: GREEN, valign: "middle", bold: true, margin: 0 });
s4.addText("AI Agent Reads, Classifies & Decides", { x: 2.3, y: 0, w: 5, h: 0.45, fontSize: 12, fontFace: "Calibri", color: WHITE, valign: "middle", charSpacing: 2, margin: 0 });
s4.addText("1.2 seconds", { x: 7.5, y: 0, w: 2, h: 0.45, fontSize: 12, fontFace: "Calibri", color: GREEN, valign: "middle", margin: 0 });

const procImg = img("processing.png");
const procW = 8.4;
const procH = procW * (461/1200);
s4.addImage({ data: procImg, x: 0.8, y: 0.7, w: procW, h: procH, shadow: makeShadow() });

s4.addText("The agent detected this is a showing request from a hot lead who is relocating\nand cares about schools. It decided to include school district info in the response.", { x: 0.8, y: 0.7 + procH + 0.2, w: 8.4, h: 0.7, fontSize: 13, fontFace: "Calibri", color: LGRAY, margin: 0 });

// ============ SLIDE 5 — STEP 3: RESPONSE SENT (SCREENSHOT) ============
let s5 = pres.addSlide();
s5.background = { color: BG };
s5.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.45, fill: { color: CARD } });
s5.addText("STEP 3", { x: 0.8, y: 0, w: 1.5, h: 0.45, fontSize: 12, fontFace: "Calibri", color: GREEN, valign: "middle", bold: true, margin: 0 });
s5.addText("Personalized Email Sent Automatically", { x: 2.3, y: 0, w: 5, h: 0.45, fontSize: 12, fontFace: "Calibri", color: WHITE, valign: "middle", charSpacing: 2, margin: 0 });
s5.addText("✓ SENT", { x: 8.0, y: 0, w: 1.5, h: 0.45, fontSize: 12, fontFace: "Calibri", color: GREEN, valign: "middle", bold: true, margin: 0 });

const respImg = img("response.png");
const respW = 8.4;
const respH = respW * (553/1200);
s5.addImage({ data: respImg, x: 0.8, y: 0.65, w: respW, h: respH, shadow: makeShadow() });

s5.addText("Personalized response with showing times + school district info.\nSent at 9:02 AM — same minute the lead arrived.", { x: 0.8, y: 5.0, w: 8.4, h: 0.5, fontSize: 13, fontFace: "Calibri", color: WHITE, bold: true, margin: 0 });

// ============ SLIDE 6 — STEP 4: CRM UPDATED (SCREENSHOT) ============
let s6 = pres.addSlide();
s6.background = { color: BG };
s6.addShape(pres.shapes.RECTANGLE, { x: 0, y: 0, w: 10, h: 0.45, fill: { color: CARD } });
s6.addText("STEP 4", { x: 0.8, y: 0, w: 1.5, h: 0.45, fontSize: 12, fontFace: "Calibri", color: GREEN, valign: "middle", bold: true, margin: 0 });
s6.addText("CRM Updated + Follow-Ups Scheduled", { x: 2.3, y: 0, w: 5, h: 0.45, fontSize: 12, fontFace: "Calibri", color: WHITE, valign: "middle", charSpacing: 2, margin: 0 });
s6.addText("Automatic", { x: 8.0, y: 0, w: 1.5, h: 0.45, fontSize: 12, fontFace: "Calibri", color: GREEN, valign: "middle", margin: 0 });

const crmImg = img("crm.png");
const crmW = 8.4;
const crmH = Math.min(crmW * (663/1200), 4.5);
s6.addImage({ data: crmImg, x: 0.8, y: 0.6, w: crmW, h: crmH, shadow: makeShadow() });

s6.addText("Lead classified, signals extracted, follow-up plan set. No human touched it.", { x: 0.8, y: 5.1, w: 8.4, h: 0.35, fontSize: 13, fontFace: "Calibri", color: WHITE, bold: true, margin: 0 });

// ============ SLIDE 7 — BEFORE vs AFTER ============
let s7 = pres.addSlide();
s7.background = { color: BG };
s7.addText("THE MATH", { x: 0.8, y: 0.3, w: 8, h: 0.5, fontSize: 32, fontFace: "Arial Black", color: WHITE, margin: 0 });
s7.addText("Here's exactly how the cost of doing it manually adds up.", { x: 0.8, y: 0.85, w: 8, h: 0.35, fontSize: 13, fontFace: "Calibri", color: GRAY, margin: 0 });

// Big math equation — the lead responder cost breakdown
s7.addShape(pres.shapes.RECTANGLE, { x: 0.5, y: 1.5, w: 9, h: 1.8, fill: { color: CARD }, shadow: makeShadow() });
s7.addShape(pres.shapes.RECTANGLE, { x: 0.5, y: 1.5, w: 0.08, h: 1.8, fill: { color: RED } });
s7.addText("WITHOUT AI — Manual Lead Response Cost", { x: 0.8, y: 1.55, w: 8.5, h: 0.35, fontSize: 11, fontFace: "Calibri", color: RED, bold: true, charSpacing: 1, margin: 0 });

s7.addText([
  { text: "15 min", options: { bold: true, fontSize: 18, color: WHITE } },
  { text: " per lead  ×  ", options: { fontSize: 14, color: GRAY } },
  { text: "20 leads", options: { bold: true, fontSize: 18, color: WHITE } },
  { text: " per week  =  ", options: { fontSize: 14, color: GRAY } },
  { text: "5 hrs", options: { bold: true, fontSize: 18, color: WHITE } },
  { text: " / week", options: { fontSize: 14, color: GRAY, breakLine: true } },
  { text: "", options: { fontSize: 4, breakLine: true } },
  { text: "5 hrs  ×  ", options: { fontSize: 14, color: GRAY } },
  { text: "$25", options: { bold: true, fontSize: 18, color: WHITE } },
  { text: " / hour  ×  ", options: { fontSize: 14, color: GRAY } },
  { text: "52 weeks", options: { bold: true, fontSize: 18, color: WHITE } },
  { text: "  =  ", options: { fontSize: 14, color: GRAY } },
  { text: "$6,500", options: { bold: true, fontSize: 22, color: RED } },
  { text: " / year", options: { fontSize: 14, color: GRAY } },
], { x: 0.9, y: 2.0, w: 9, h: 1.3, fontFace: "Calibri", paraSpaceAfter: 4 });

// WITH AI block
s7.addShape(pres.shapes.RECTANGLE, { x: 0.5, y: 3.5, w: 9, h: 1.8, fill: { color: CARD }, shadow: makeShadow() });
s7.addShape(pres.shapes.RECTANGLE, { x: 0.5, y: 3.5, w: 0.08, h: 1.8, fill: { color: GREEN } });
s7.addText("WITH AI AGENT — Automated Lead Response Cost", { x: 0.8, y: 3.55, w: 8.5, h: 0.35, fontSize: 11, fontFace: "Calibri", color: GREEN, bold: true, charSpacing: 1, margin: 0 });

s7.addText([
  { text: "20 leads", options: { bold: true, fontSize: 18, color: WHITE } },
  { text: " × ", options: { fontSize: 14, color: GRAY } },
  { text: "~0 min", options: { bold: true, fontSize: 18, color: WHITE } },
  { text: " (AI handles it) + ", options: { fontSize: 14, color: GRAY } },
  { text: "tool cost", options: { bold: true, fontSize: 18, color: WHITE } },
  { text: " (~$50/mo)", options: { fontSize: 14, color: GRAY, breakLine: true } },
  { text: "", options: { fontSize: 4, breakLine: true } },
  { text: "Staff time saved  =  ", options: { fontSize: 14, color: GRAY } },
  { text: "5 hrs/week  →  $5,200 annual savings", options: { bold: true, fontSize: 18, color: GREEN } },
], { x: 0.9, y: 4.0, w: 9, h: 1.3, fontFace: "Calibri", paraSpaceAfter: 4 });

// ============ SLIDE 8 — WORKFLOW BREAKDOWN ============
let s8 = pres.addSlide();
s8.background = { color: BG };
s8.addText("WORKFLOW BREAKDOWN", { x: 0.8, y: 0.3, w: 9, h: 0.5, fontSize: 28, fontFace: "Arial Black", color: WHITE, margin: 0 });
s8.addText("The pipeline that runs automatically, 24/7, behind the scenes.", { x: 0.8, y: 0.85, w: 9, h: 0.35, fontSize: 13, fontFace: "Calibri", color: GRAY, margin: 0 });

// n8n workflow screenshot — image is 2519x1231 (aspect ~2.05)
const n8nImg = img("n8n_live_workflow.png");
const n8nW = 8.8;
const n8nH = n8nW * (1231/2519);
s8.addImage({ data: n8nImg, x: 0.6, y: 1.5, w: n8nW, h: n8nH, shadow: makeShadow() });

s8.addText("Lead arrives → AI classifies → response drafted → CRM logged → response sent. No human touch.", { x: 0.6, y: 1.5 + n8nH + 0.2, w: 8.8, h: 0.4, fontSize: 13, fontFace: "Calibri", color: LGRAY, align: "center", italic: true, margin: 0 });

// ============ SLIDE 8.5 — AND ONE MORE THING: LISTING DESCRIPTIONS ============
let s85 = pres.addSlide();
s85.background = { color: BG };
s85.addText("And One More Thing...", { x: 0.8, y: 0.3, w: 8, h: 0.5, fontSize: 18, fontFace: "Calibri", color: GRAY, italic: true, margin: 0 });
s85.addText("WE DO THIS FOR LISTINGS TOO", { x: 0.8, y: 0.75, w: 9, h: 0.6, fontSize: 26, fontFace: "Arial Black", color: WHITE, margin: 0 });
s85.addText("45 minutes of writing per listing → 10 seconds. Four formats at once.", { x: 0.8, y: 1.3, w: 9, h: 0.35, fontSize: 13, fontFace: "Calibri", color: GRAY, margin: 0 });

const listImg = img("listing.png");
const listW = 8.4;
const listH = listW * (499/1200);
s85.addImage({ data: listImg, x: 0.8, y: 1.75, w: listW, h: listH, shadow: makeShadow() });

s85.addText("Enter property details once → get MLS description, social media post, email blast, and open house announcement.", { x: 0.8, y: 1.75 + listH + 0.2, w: 8.4, h: 0.4, fontSize: 12, fontFace: "Calibri", color: LGRAY, align: "center", margin: 0 });

// ============ SLIDE 9 — THE NUMBERS (ROI Calculator Screenshot) ============
let s9 = pres.addSlide();
s9.background = { color: BG };
s9.addText("THE NUMBERS", { x: 0.8, y: 0.3, w: 9, h: 0.5, fontSize: 28, fontFace: "Arial Black", color: WHITE, margin: 0 });
s9.addText("Plugged into our ROI calculator with your actual numbers:", { x: 0.8, y: 0.85, w: 9, h: 0.35, fontSize: 13, fontFace: "Calibri", color: GRAY, margin: 0 });

// ROI calculator screenshot (2800x1922 ~ 1.46 ratio)
const roiImg = img("roi_calculator_results.png");
const roiH = 3.8;
const roiW = roiH * (2800/1922);
const roiX = (10 - roiW) / 2;
s9.addImage({ data: roiImg, x: roiX, y: 1.3, w: roiW, h: roiH, shadow: makeShadow() });

s9.addText("5 hours/week saved. $10,400 annual savings. 1,980% ROI.", { x: 0.7, y: 1.3 + roiH + 0.15, w: 8.6, h: 0.35, fontSize: 15, fontFace: "Calibri", color: GREEN, bold: true, align: "center", margin: 0 });

// ============ SLIDE 10 — CTA ============
let s10 = pres.addSlide();
s10.background = { color: BG };
s10.addShape(pres.shapes.RECTANGLE, { x: 0, y: 5.525, w: 10, h: 0.1, fill: { color: WHITE } });
s10.addText("Want to see this\nwith your leads?", { x: 0.8, y: 1.0, w: 8, h: 2.0, fontSize: 44, fontFace: "Arial Black", color: WHITE, margin: 0 });
s10.addText("We'll run a free audit on your actual workflows and show you\nexactly how much time and money you'll save.", { x: 0.8, y: 3.0, w: 7, h: 0.8, fontSize: 16, fontFace: "Calibri", color: LGRAY, margin: 0 });
s10.addText("Monican  |  Daniel Weadock  |  Bolton, MA", { x: 0.8, y: 4.8, w: 8, h: 0.4, fontSize: 13, fontFace: "Calibri", color: GRAY, margin: 0 });

// SAVE
pres.writeFile({ fileName: "/Users/danielweadock/Conduit AI/Monican_Demo_Walkthrough.pptx" })
  .then(() => console.log("Demo deck with screenshots saved!"))
  .catch(err => console.error(err));
