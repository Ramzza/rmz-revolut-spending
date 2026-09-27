# rmz-revolut-spending

A local TypeScript CLI for extracting completed outflows from Revolut CSV
account statements and summarizing spend by currency. Your statement stays on
your machine; the tool does not connect to Revolut or transmit your data.

## Requirements

Node.js 22 or later.

```sh
npm install
npm run build
```

Export an account statement as CSV from Revolut, then run:

```sh
npm start -- transactions ./statement.csv
npm start -- summary ./statement.csv

# Optional inclusive date limits (YYYY-MM-DD):
npm start -- transactions ./statement.csv --from 2025-01-01 --to 2025-01-31

# JSON output is the default; CSV is also supported:
npm start -- transactions ./statement.csv --format csv
```

The `transactions` command outputs completed, negative-amount rows only.
Positive credits and non-completed transactions (such as pending or reverted
items) are excluded. The `summary` command totals those outflows by currency;
it does not combine different currencies or net refunds against purchases.
Date filtering uses the completed date when present and otherwise the started
date. The importer recognizes Revolut statement columns such as `Completed
Date`, `Started Date`, `Description`, `Amount`, `Currency`, `State`, `Category`,
and `Type`.

## Account access

Revolut personal accounts do not expose a general-purpose personal transaction
API for this CLI to use directly. For personal accounts, export the statement
from the Revolut app or website and pass its CSV file to the tool. Do not give
the CLI your Revolut password or upload statement files to this repository.
Direct automated access for personal accounts requires an Open Banking
provider. Revolut's Business API is a separate product and is not used here.

## Development

```sh
npm test
npm run build
```
