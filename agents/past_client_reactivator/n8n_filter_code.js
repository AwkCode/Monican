// n8n Code Node — Past Client Filter Logic
// Place this AFTER the Google Sheets "Get rows" node and BEFORE the Claude Anthropic node.
//
// It takes all past clients and filters down to only those who should be contacted this week,
// based on birthday, home-aversary, or dormancy rules.

const TODAY = new Date();
const DAYS_WINDOW = 14; // look ahead 14 days for birthdays & anniversaries
const DORMANT_DAYS = 180; // 6+ months since last contact
const MAX_DRAFTS_PER_WEEK = 10; // cap so Eileen isn't overwhelmed

function parseDate(s) {
  if (!s || typeof s !== 'string') return null;
  const d = new Date(s);
  return isNaN(d.getTime()) ? null : d;
}

function daysBetween(a, b) {
  const ms = (b.getTime() - a.getTime());
  return Math.floor(ms / (1000 * 60 * 60 * 24));
}

function thisYearOf(date) {
  // Given a date from a previous year, return the same month/day in the current year
  const d = new Date(date);
  d.setFullYear(TODAY.getFullYear());
  return d;
}

function daysUntilThisYear(anniversaryDate) {
  const thisYear = thisYearOf(anniversaryDate);
  return daysBetween(TODAY, thisYear);
}

// Get all rows from the previous node (Google Sheets)
const clients = $input.all().map(item => item.json);

const candidates = [];

for (const client of clients) {
  const firstName = (client['First Name'] || '').trim();
  const lastName = (client['Last Name'] || '').trim();
  if (!firstName || !client['Email']) continue; // skip incomplete rows

  const closingDate = parseDate(client['Closing Date']);
  const birthday = parseDate(client['Birthday']);
  const lastContacted = parseDate(client['Last Contacted']);

  let reason = null;
  let daysUntilEvent = null;
  let yearsSinceClosing = null;
  let priority = 99; // lower = higher priority

  // Check 1: Birthday in next 14 days (highest priority)
  if (birthday) {
    const daysUntilBday = daysUntilThisYear(birthday);
    if (daysUntilBday >= 0 && daysUntilBday <= DAYS_WINDOW) {
      reason = 'birthday';
      daysUntilEvent = daysUntilBday;
      priority = 1;
    }
  }

  // Check 2: Home-aversary in next 14 days
  if (!reason && closingDate) {
    const yearsSince = TODAY.getFullYear() - closingDate.getFullYear();
    if (yearsSince >= 1) {
      const daysUntilAnniv = daysUntilThisYear(closingDate);
      if (daysUntilAnniv >= 0 && daysUntilAnniv <= DAYS_WINDOW) {
        reason = 'home_aversary';
        daysUntilEvent = daysUntilAnniv;
        yearsSinceClosing = yearsSince;
        // Prioritize milestone years: 1, 3, 5, 10, 15, 20, 25
        priority = [1, 3, 5, 10, 15, 20, 25].includes(yearsSince) ? 2 : 3;
      }
    }
  }

  // Check 3: Dormant (6+ months since last contact)
  if (!reason && lastContacted) {
    const daysSilent = daysBetween(lastContacted, TODAY);
    if (daysSilent > DORMANT_DAYS) {
      reason = 'dormant';
      daysUntilEvent = 0;
      priority = 4;
      client['__days_silent'] = daysSilent;
    }
  }

  if (reason) {
    yearsSinceClosing = yearsSinceClosing || (
      closingDate ? TODAY.getFullYear() - closingDate.getFullYear() : 0
    );

    candidates.push({
      first_name: firstName,
      last_name: lastName,
      email: client['Email'],
      phone: client['Phone'] || '',
      property_address: client['Property Address'] || '',
      transaction_type: client['Transaction Type'] || '',
      closing_date: client['Closing Date'] || '',
      birthday: client['Birthday'] || '',
      tags: client['Tags'] || '',
      notes: client['Notes'] || '',
      reason: reason,
      days_until_event: daysUntilEvent,
      days_since_last_contact: client['__days_silent'] || 0,
      years_since_closing: yearsSinceClosing,
      _priority: priority,
      _row_number: client.row_number || null, // track for later updating
    });
  }
}

// Sort by priority (birthdays first, then milestone anniversaries, then regular, then dormant)
candidates.sort((a, b) => a._priority - b._priority);

// Cap at MAX_DRAFTS_PER_WEEK to avoid overwhelming Eileen
const selected = candidates.slice(0, MAX_DRAFTS_PER_WEEK);

// Return as n8n items array (one item per client to draft)
return selected.map(c => ({ json: c }));
