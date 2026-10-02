# Opportunity Ageing & Follow-Up Contract

## Purpose

Prevent opportunities from silently disappearing while avoiding an intimidating task-management system.

## Required dates

- Created
- Last verified/contacted
- Next action due
- Review due
- Quote expiry, when applicable
- Expected delivery, when applicable

## Ageing states

**CURRENT → DUE → STALE → OVERDUE**

These are operational states, not commercial quality ratings.

## Suggested review triggers

- No next action recorded → DATA-QUALITY exception
- Next action date passed → OVERDUE
- Review date passed without verification → STALE
- Quote approaching expiry → FOLLOW-UP
- Supplier/customer response outstanding → WAITING
- Payment or delivery obligation approaching → ATTENTION

Actual thresholds should be configured by opportunity type rather than assumed globally.

## Follow-up rule

A reminder should point to the existing Opportunity ID and next action. It should not create a duplicate opportunity.

## Closure rule

When an opportunity is completed, cancelled, invalidated or deliberately abandoned, record:

- outcome;
- reason;
- financial result where applicable;
- learning;
- whether follow-up/repeat opportunity exists.

**The purpose of ageing is action, not surveillance.**
