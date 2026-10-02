# Simple Interface Contract

The public interface follows one rule:

> **You see simplicity. The system carries the complexity.**

## Primary user journey

1. Tell me what you need.
2. Capture the requirement.
3. Understand/verify it.
4. Find or assemble the right resource.
5. Coordinate delivery.
6. Confirm outcome.

## Public UI rules

- Avoid enterprise jargon on first contact.
- Do not expose internal IDs, evidence states, financial controls or workflow statuses unless useful to the visitor.
- Use plain-language choices.
- Keep the number of primary choices small.
- Reveal detail progressively.
- Never require a visitor to know which enterprise they need.
- Use the portfolio architecture behind the interface to route the request.

## Internal complexity

The operational layer may still track:

Opportunity → Customer → Requirement → Provider/Supplier → Evidence → Quote → Cost → Compliance → Fulfilment → Outcome.

That complexity belongs in the operating system, not the visitor's first screen.

## Accessibility and resilience

- Native HTML links/details where possible.
- Keyboard accessible.
- Responsive.
- No mandatory JavaScript.
- No mandatory external SaaS.
- Meaningful text remains available without visual decoration.

## Acceptance test

A first-time visitor should understand within seconds:

**What can I ask for? What happens next? How do I start?**
