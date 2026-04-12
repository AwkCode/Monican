# Lead Responder — Test Results
### Version: prompt v1 (with prefill technique)
### Model: claude-haiku-4-5-20251001
### Date: 2026-04-06
### Cost per lead: ~$0.0023

## Summary

Tested 9 leads against the v1 prompt. All produced valid JSON. All produced usable responses. Edge cases (Spanish, angry, spam) handled gracefully.

| Lead Type | Pass | Notes |
|-----------|------|-------|
| Standard showing request (Sarah Chen) | ✅ 11/11 | Hit every criterion perfectly |
| First-time buyer | ✅ | Warm tone, asked qualifying questions |
| Urgent cash buyer | ✅ | Detected urgency, offered showing immediately |
| Vague "I want to buy" | ⚠️ | Claude said buyer_inquiry/cool - arguably more correct than my "general/warm" expectation |
| Spanish | ✅ | Responded in natural fluent Spanish |
| Angry/hostile | ✅ | Apologized, offered to help, internal notes flagged for caution |
| SEO spam | ✅ | Empty response body, correctly identified as spam |
| Military relocation | ⚠️ | Missed `out_of_state` signal (didn't infer from area code) |
| Just browsing | ⚠️ | Classified as buyer_inquiry/cool instead of general/cool |

## What Works Well

1. **Personalization** — Always uses first name, references specific properties, addresses stated concerns
2. **Time slot offers** — Consistently offers exact 3 time slots for showing requests
3. **Multilingual** — Spanish was excellent, no prompting needed beyond "respond in same language"
4. **Edge case handling** — Spam and angry detection both work as designed
5. **JSON output reliability** — Prefill trick (assistant message starting with `{`) eliminates markdown wrapping 100% of the time
6. **School district mention** — Whenever schools are mentioned, the Nashoba district line appears correctly

## Known Issues to Fix in v2

1. **Phone area code detection** — Should infer out_of_state from non-MA area codes (254 = TX, 512 = TX, etc.)
2. **General vs buyer_inquiry boundary** — Currently leans heavily toward buyer_inquiry. May want to redefine "general" as truly intent-less.
3. **internal_notes wording** — Doesn't always include the exact keywords my tests expect (e.g., "angry") even when handling correctly

## Next Steps

1. Sign up for n8n Cloud (free tier)
2. Build the workflow:
   - Webhook trigger
   - Anthropic node (paste this prompt as system message)
   - Google Sheets node (log every lead)
   - Optional Gmail node (send response)
3. Test in n8n with the same 9 leads
4. Run remaining 41 test cases for robustness validation
5. Export and save as deployable template

## Pricing for Clients

At $0.0023 per lead with claude-haiku-4-5:
- 100 leads/month: $0.23 in API costs
- 500 leads/month: $1.15
- 1000 leads/month: $2.30

So even for the busiest agency, AI costs are ~$3/month. The client pays for the workflow infrastructure ($0-50/mo for n8n), Daniel pays for or passes through the API costs. Total tool stack for the client: ~$30-100/mo.
