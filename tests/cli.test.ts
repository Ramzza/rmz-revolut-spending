import assert from "node:assert/strict";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import { run } from "../src/cli.js";

const statement = [
  "Started Date,Completed Date,Description,Amount,Currency,State,Category,Type",
  "2025-01-01,2025-01-01,Groceries,-10.00,EUR,COMPLETED,Groceries,Card Payment",
  "2025-01-02,,Pending,-2.00,EUR,PENDING,Shopping,Card Payment",
].join("\n");

async function withStatement(action: (path: string) => Promise<void>): Promise<void> {
  const directory = await mkdtemp(join(tmpdir(), "rmz-revolut-spending-"));
  const path = join(directory, "statement.csv");
  try {
    await writeFile(path, statement);
    await action(path);
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
}

test("PRD-004: CLI outputs transactions as JSON by default", async () => {
  await withStatement(async (path) => {
    const result = JSON.parse(await run(["transactions", path])) as Array<{ description: string }>;
    assert.deepEqual(result.map(({ description }) => description), ["Groceries"]);
  });
});

test("PRD-004: CLI filters date range and outputs transaction CSV", async () => {
  await withStatement(async (path) => {
    const result = await run([
      "transactions", path, "--from", "2025-01-01", "--to", "2025-01-01", "--format", "csv",
    ]);
    assert.equal(result, "date,description,amount,currency,category,type\n2025-01-01,Groceries,-10,EUR,Groceries,Card Payment");
  });
});

test("PRD-004: CLI outputs summary JSON and CSV", async () => {
  await withStatement(async (path) => {
    const json = JSON.parse(await run(["summary", path])) as Array<{ totalSpent: number }>;
    assert.equal(json[0].totalSpent, 10);
    assert.equal(
      await run(["summary", path, "--format", "csv"]),
      "currency,transactionCount,totalSpent\nEUR,1,10",
    );
  });
});

test("PRD-004: CLI rejects invalid commands, options, and date ranges", async () => {
  await withStatement(async (path) => {
    await assert.rejects(run([]), /Usage:/);
    await assert.rejects(run(["other", path]), /Usage:/);
    await assert.rejects(run(["transactions", path, "--from"]), /Missing value for --from/);
    await assert.rejects(run(["transactions", path, "--nope"]), /Unknown option/);
    await assert.rejects(run(["transactions", path, "--format", "xml"]), /must be json or csv/);
    await assert.rejects(run(["transactions", path, "--from", "2025-02-30"]), /valid calendar date/);
    await assert.rejects(
      run(["transactions", path, "--from", "2025-02-01", "--to", "2025-01-01"]),
      /must be on or before/,
    );
  });
});
