# Product requirements

## Outcome

Process locally exported Revolut CSV statements into filtered transaction lists and spending summaries, and extract category totals from saved Revolut spending breakdown HTML.

## Requirements

- **PRD-001 - Import statement CSV:** Parse quoted CSV safely, use completed date or fall back to started date, and reject missing required columns, dates, or invalid amounts.
  **Verification:** `tests/revolut.test.ts` tests prefixed `PRD-001`.
- **PRD-002 - Select spending:** Include only completed negative-amount transactions within inclusive date bounds; do not count credits, refunds, or pending transactions as spending.
  **Verification:** `tests/revolut.test.ts::PRD-002: selects only completed negative transactions within inclusive date bounds`.
- **PRD-003 - Summarize by currency:** Report counts and absolute spending totals independently for each currency in stable sorted order.
  **Verification:** `tests/revolut.test.ts::PRD-003: summarizes totals by currency in sorted currency order`.
- **PRD-004 - CLI outputs:** Provide transaction and summary commands with JSON or CSV output, and reject invalid options or dates.
  **Verification:** `tests/cli.test.ts` tests prefixed `PRD-004`.
- **PRD-005 - Extract HTML category breakdown:** Parse a local Revolut spending breakdown HTML file into category labels and non-negative numeric RON amounts, excluding the displayed minus sign, transaction counts, and percentages. Support JSON and CSV output, and report an error when no category breakdown can be parsed.
  **Verification:** `tests/spending-html.test.ts` and `tests/cli.test.ts` tests prefixed `PRD-005`.
