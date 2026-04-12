# Google Sheets Field Mappings
### For the "Append row in sheet" node

Paste each expression into the corresponding column field in the Google Sheets node. **Remove the leading `=` sign** if you paste it — n8n expression mode handles that automatically.

| Column | Expression |
|--------|-----------|
| **Date** | `{{ $now.toFormat('yyyy-MM-dd HH:mm') }}` |
| **Lead Name** | `{{ $json.lead_name }}` |
| **Email** | `{{ $json.lead_email }}` |
| **Phone** | `{{ $json.lead_phone }}` |
| **Source** | `{{ $json.source }}` |
| **Property** | `{{ $json.property_interest }}` |
| **Original Message** | `{{ $json.original_message }}` |
| **Lead Type** | `{{ $json.lead_type }}` |
| **Quality** | `{{ $json.quality }}` |
| **Signals** | `{{ $json.signals }}` |
| **Key Details** | `{{ $json.key_details }}` |
| **Subject** | `{{ $json.draft_response_subject }}` |
| **Draft Response** | `{{ $json.draft_response_body }}` |
| **Internal Notes** | `{{ $json.internal_notes }}` |
| **Next Action** | `{{ $json.suggested_next_action }}` |

## Troubleshooting

**Problem:** Google Sheets shows `#ERROR!` or `=Sarah Chen` in cells

**Cause:** The field was entered as literal text with `=` prefix, and Sheets tried to evaluate it as a formula.

**Fix:** Remove the `=` at the start of each expression field so it becomes `{{ $json.lead_name }}` instead of `={{ $json.lead_name }}`.

**Problem:** Field shows `undefined` below the expression

**Cause:** The `$json.field_name` doesn't exist in the input data from the previous node.

**Fix:** Open the Code in JavaScript node, Execute it, and check the output structure. Verify the field name in the Sheets mapping matches exactly.
