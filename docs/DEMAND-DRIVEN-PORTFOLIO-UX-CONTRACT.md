# Demand-Driven Portfolio UX Contract

**Status:** Canonical

## Principle

The portfolio is broad internally but focused externally.

**User demand determines what the interface reveals.**

## Customer journey

**Need → Clarify → Match → Act → Confirm**

The first interaction should ask the visitor to describe or choose a need, not choose an enterprise.

## Progressive disclosure

Reveal information in this order:

1. Need
2. Minimum clarification
3. Relevant options
4. Appropriate capability/destination
5. Delivery details
6. Evidence, economics and technical detail only when relevant

Do not expose the full portfolio architecture at first contact.

## Enterprise boundary

Enterprise names are destinations, not customer-facing prerequisites.

The user can be routed to MOKORO, General Dealer/commercial operations, AgriSage360, research, EverythingCity or provider/referral operations after their requirement is understood.

## Fallback

Every demand interface must support free-text or "Something else" so the taxonomy does not become a cage.

## Conversion principle

A successful first interaction does not require a sale. It requires a usable requirement and a clear next action.

## Anti-complexity rules

- No unnecessary account creation.
- No long first-contact forms.
- No internal IDs in the first interaction.
- No internal workflow terminology unless useful.
- No requirement to understand enterprise ownership or routing.
- No duplicate forms where an existing canonical intake can be reused.

## Resilience

The demand layer must remain usable without mandatory AI, paid APIs, databases or SaaS.

## Acceptance test

A new visitor should be able to start without knowing what Farouk's enterprises are called.
