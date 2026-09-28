# Architecture

`rmz-revolut-spending` is a local TypeScript CLI for processing exported Revolut statement CSV files. It does not connect to Revolut or send statement data over the network.

## Components and flow

- `src/cli.ts` parses the command, date limits, and output format; it reads the selected CSV file and coordinates parsing, filtering, and output.
- `src/csv.ts` parses quoted CSV fields and serializes tabular results.
- `src/revolut.ts` maps statement columns into typed transactions, selects completed negative-amount transactions within the inclusive date range, and aggregates totals independently by currency.
- The CLI emits transaction rows or spending summaries as JSON or CSV. It keeps no database, cache, or persistent output.

Input CSV supports the statement's completed/started date, description, amount, currency, state, category, and type columns. Refunds and credits are not netted against outflows; totals are grouped by currency.

Run `npm test` for the parser, filtering, summary, and CLI tests. `npm run build` compiles the executable to `dist/`.
