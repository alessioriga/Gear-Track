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

## GT-102 – Equipment Category Filtering

**Reason for prioritisation:**
I chose to work on GT-102 after addressing the security issue in GT-103. Category filtering improves the usability of the application by allowing users to find equipment more easily, especially as the inventory grows. I wanted to introduce this functionality before moving on to the equipment checkout and return processes.

**Status:** Implementation and testing completed.

**Work completed:**
- Added a category dropdown to the Available Equipment section in `index.html`.
- Added an event listener in `app.js` to detect changes to the selected category.
- Used JavaScript's `filter()` method to display equipment matching the selected category.
- Included an All Categories option to display all equipment.
- Kept the safe DOM rendering methods introduced in GT-103.

**Testing:**
- Confirmed that All Categories displays all four equipment items.
- Confirmed that Cameras displays Canon EOS R6 and Sony FX3.
- Confirmed that Accessories displays Manfrotto Tripod.
- Confirmed that Laptops displays MacBook Pro 16".
- Confirmed that the list updates when the dropdown selection changes, without refreshing the page.

**Learning outcomes:**
Learned how to use event listeners and JavaScript's `filter()` method to display data based on a user's selection.

**Next step:** GT-101 – Checkout Form Modal.