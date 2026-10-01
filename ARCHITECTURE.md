# Architecture

`rmz-revolut-spending` is a local TypeScript CLI for processing exported Revolut statement CSV files and spending breakdown HTML files. It does not connect to Revolut or send statement data over the network.

## Components and flow

- `src/cli.ts` parses the command, date limits, and output format; it reads the selected CSV or HTML file and coordinates parsing and output.
- `src/csv.ts` parses quoted CSV fields and serializes tabular results.
- `src/revolut.ts` maps statement columns into typed transactions, selects completed negative-amount transactions within the inclusive date range, and aggregates totals independently by currency.
- `src/spending-html.ts` extracts category labels and non-negative numeric RON amounts from the transaction-breakdown buttons in local Revolut spending HTML.
- The CLI emits transaction rows, spending summaries, or category totals as JSON or CSV. It keeps no database, cache, or persistent output.

Input CSV supports the statement's completed/started date, description, amount, currency, state, category, and type columns. The `categories` command reads local HTML files and omits transaction counts, percentages, and the displayed minus sign. Refunds and credits are not netted against outflows; CSV totals are grouped by currency.

Run `npm test` for the CSV and HTML parsers, filtering, summaries, and CLI tests. `npm run build` compiles the executable to `dist/`.
