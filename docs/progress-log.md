# GearTrack – Development Progress Log

## GT-103 – DOM-based XSS Mitigation

**Reason for implementation order:**

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

**Reason for implementation order:**

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

## GT-101 – Checkout Form Modal

**Reason for implementation order:**

I decided to work on GT-101 after completing the security improvements and category filtering features. The checkout functionality is an important part of the application because it allows department staff to create new equipment loans. Implementing this feature before the return process also provides the functionality needed to test the complete loan management workflow.

**Status:** Implementation and functional testing completed.

**Work completed:**

- Added a Checkout button for equipment marked as available.
- Created a modal form using the HTML `<dialog>` element.
- Added fields for Borrower Name, Borrower Email and Return Date.
- Implemented a Cancel button to close the modal without saving any data.
- Connected the form submission to `dataService.saveLoan()`.
- Updated the Equipment List and Active Loans sections automatically after a successful checkout.
- Preserved the safe DOM rendering methods introduced in GT-103.

**Testing:**

- Confirmed that the Checkout button appears only for available equipment.
- Confirmed that clicking Checkout opens the modal form.
- Confirmed that the Cancel button closes the modal.
- Tested the checkout form and confirmed that submitting it successfully creates a loan.
- Confirmed that the selected equipment changes from available to loaned.
- Confirmed that the new loan appears in the Active Loans section without refreshing the page.

**Problems encountered:**

- An incorrect `addEventListener()` statement prevented the form submission handler from being registered.
- Part of the checkout logic was initially placed outside the `handleCheckout()` function, causing a `ReferenceError`.
- Corrected the event listener and moved the checkout logic inside the appropriate function.

**Learning outcomes:**

I learned how to create and control an HTML modal using JavaScript, handle form submissions with event listeners and use asynchronous functions to save data. I also improved my understanding of JavaScript function scope and how browser Developer Tools can help identify and resolve errors.

**Next step:** GT-104 – Return Equipment Flow.

## GT-104 – Return Equipment Flow

**Reason for implementation order:**

I decided to implement GT-104 after completing the other mandatory tickets because the return functionality builds on the checkout process introduced in GT-101. By implementing checkout first, I was able to establish how loans are created and how equipment availability is updated. This made it easier to develop and test the return process.

**Status:** Implementation and functional testing completed.

**Work completed:**

- Added a `returnLoan(loanId)` method to `dataService.js`.
- Used the method to update a loan's status from `active` to `returned`.
- Updated the associated equipment status from `loaned` to `available`.
- Added a Mark Returned button to each active loan card.
- Updated the Active Loans section to display only loans with an `active` status.
- Refreshed the Equipment List and Active Loans sections after a successful return without reloading the page.
- Preserved the existing checkout, category filtering and safe DOM rendering functionality.

**Testing:**

- Confirmed that active loan cards display a Mark Returned button.
- Clicked Mark Returned and confirmed that the loan disappeared from the Active Loans section.
- Confirmed that the associated equipment became available for checkout again.
- Refreshed the browser and verified that the updated information was preserved in `localStorage`.

**Problems encountered:**

No significant problems were encountered during implementation or testing. During the code review, a redundant status check was identified and removed because the Active Loans section already filters out returned loans.

**Learning outcomes:**

I learned how to update related records in `localStorage` and maintain consistency between equipment and loan information. I also improved my understanding of filtering data based on its status and updating multiple interface sections after a user action.

**Next step:** Implement the remaining optional feature tickets.

## GT-105 – Overdue Loan Highlight & Notification

**Reason for selection:**

I selected GT-105 as one of the optional tickets because it improves the application's ability to manage equipment loans. Highlighting overdue loans helps department staff identify equipment that has not been returned on time and makes important information easier to recognise.

**Status:** Implementation and testing completed.

**Work completed:**

- Added an `isLoanOverdue()` function to compare loan due dates with the current date.
- Used the `YYYY-MM-DD` date format to compare dates consistently.
- Added the `.overdue` CSS class to active loan cards when their due dates have passed.
- Used a red border and a light red background to highlight overdue loans.
- Added an overdue counter to the Active Loans panel.
- Updated the counter dynamically whenever the active loans are rendered.
- Preserved the existing checkout and return functionality.

**Testing:**

- Confirmed that the overdue counter displays the correct number of overdue loans.
- Confirmed that overdue loan cards are highlighted with a red border and background.
- Verified that loans which are not overdue retain their normal appearance.
- Confirmed that returning an overdue loan removes it from Active Loans and automatically updates the counter.

**Problems encountered:**

No significant problems were encountered during implementation or testing. The existing CSS file already contained styling for overdue loans, so only the comment needed correcting and the overdue counter styling had to be added.

**Learning outcomes:**

I learned how to compare dates in JavaScript, apply CSS classes conditionally and update a status counter based on application data. I also improved my understanding of how visual feedback can help users identify important information.

**Next step:** GT-107 – Department Usage Stats Dashboard.