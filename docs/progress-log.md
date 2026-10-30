# GearTrack – Development Progress Log

## GT-103 – DOM-based XSS Mitigation

**Reason for prioritisation:**

I decided to start with GT-103 because security is an important part of the application. Before introducing new features, I wanted to make sure that the existing application handled dynamic data safely. Addressing this issue early also helps prevent similar security problems from being introduced into future features.

**Status:** Implementation and testing completed.

**Work completed:**
- Reviewed the existing application and identified unsafe use of `innerHTML` when displaying dynamic data.
- Replaced unsafe rendering with safer DOM methods.
- Used `textContent`, `document.createElement()`, `document.createTextNode()` and `replaceChildren()`.
- Applied the changes to the equipment list and active loans.

**Testing:**
- Tested an equipment name containing malicious HTML and JavaScript.
- Tested a borrower name containing malicious HTML and JavaScript.
- Confirmed that both values appeared as plain text and no JavaScript alert was triggered.
- Restored the original equipment and borrower information.

**Problems encountered:**
- The browser displayed a `favicon.ico` 404 message during testing. This was unrelated to the application and did not affect its functionality.

**Learning outcomes:**
Learned how DOM-based XSS vulnerabilities can occur and how safe DOM methods help prevent malicious input from being executed.

**Next step:** GT-102 – Equipment Category Filtering.