# Security policy

## Supported versions

Simplicity is deployed continuously from `main`. Only the latest code on `main`, and the live site at [simplicity.akadeepesh.com](https://simplicity.akadeepesh.com), receive security fixes.

## Reporting a vulnerability

**Please do not open a public issue, discussion or pull request for security problems.**

Report it privately through GitHub: open the [Security tab](https://github.com/akadeepesh/Simplicity/security) and choose **Report a vulnerability** ([direct link](https://github.com/akadeepesh/Simplicity/security/advisories/new)).

Please include:

- what the issue is and what an attacker could do with it,
- steps or a proof of concept to reproduce it,
- the affected URL, route or file, if you know it,
- any ideas you have for a fix.

## What to expect

- An acknowledgement within **3 working days**.
- An initial assessment within **7 days**, with regular updates after that.
- Once a fix ships, a public advisory that credits you, unless you prefer to stay anonymous.

## Scope

In scope:

- the code in this repository,
- the live site at `simplicity.akadeepesh.com`: authentication, authorisation between users, stored content (XSS and sanitiser bypasses), Server Actions and API routes.

Out of scope:

- vulnerabilities in third-party services (Vercel, Neon, GitHub, Google); report those to the vendor,
- denial-of-service or load testing against the live site,
- social engineering, spam, or automated scanner output without a demonstrated impact,
- missing headers or best-practice suggestions with no concrete exploit.

## Safe harbour

If you act in good faith, stay within scope, avoid accessing or changing other people's data, and give us reasonable time to fix the issue before disclosing it, we will not pursue legal action and will work with you to understand and resolve the problem.
