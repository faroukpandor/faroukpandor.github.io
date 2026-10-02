# Operational Next-Action Contract

**Status:** Active architecture

The portfolio operating system should always reduce an active opportunity to one clear next action.

## Minimum active-action fields

- Opportunity ID
- Status
- Owner
- Next action
- Due/review date
- Blocker, if any
- Last verified
- Evidence reference
- Commercial exposure, if applicable

## Action states

- **TODAY** — action should happen now.
- **DUE** — action is due.
- **WAITING** — another person/provider/customer must respond.
- **BLOCKED** — a known blocker prevents progress.
- **STALE** — no meaningful verification/action within the defined review window.
- **HOLD** — deliberately paused with a recorded reason.
- **DONE** — action completed; create the next action or close the opportunity.

## Operating rule

Every active opportunity must have either:

1. one explicit next action; or
2. an explicit HOLD/ARCHIVE decision with a reason.

Never create a queue containing multiple competing "next actions". Supporting tasks belong in the detailed enterprise record.

## Daily operating view

The private operational interface should answer only:

1. What needs action today?
2. What am I waiting for?
3. What is blocked?
4. What is becoming stale?
5. What was completed?
6. What needs reconciliation?

## Priority discipline

Do not manufacture urgency from arbitrary scores.

Urgency should come from evidence such as:

- customer deadline;
- quote expiry;
- supplier availability;
- payment obligation;
- delivery commitment;
- compliance deadline;
- agreed follow-up date.

## Resilience

The action queue must remain reconstructable from the canonical opportunity record and exportable as CSV/JSON/plain text.

## Privacy

Private customer, supplier, payment and commercial information does not belong in the public repository.

**Interface rule: one next action for the operator; many supporting controls behind it.**
