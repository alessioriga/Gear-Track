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

## GT-107 – Department Usage Stats Dashboard

**Reason for selection:**

I selected GT-107 as my second optional ticket because I wanted to improve how equipment usage information is presented. The existing application displayed equipment and active loans, but it did not provide an overview of department statistics. I also wanted to explore how charts could make this information easier to understand.

**Status:** Implementation and functional testing completed.

**Work completed:**

- Added a `getStats()` method to `dataService.js` to calculate department usage statistics.
- Calculated the total number of equipment items, percentage currently loaned and number of overdue items.
- Added three summary cards to display these statistics.
- Used JavaScript's `filter()`, `map()` and `Set` to calculate equipment usage by category.
- Added a table displaying total and active loans for each category.
- Integrated Chart.js to display the same statistics using a bar chart.
- Added a segmented toggle to switch between List and Chart views.
- Updated the dashboard automatically after equipment checkout and return actions.
- Used safe DOM methods when creating and updating the table.

**Testing:**

- Confirmed that all three summary cards displayed the expected values.
- Verified that the category table displayed the correct total and active loan counts.
- Confirmed that the bar chart displayed the same data as the table.
- Tested switching between List and Chart without refreshing the page.
- Confirmed that returning equipment updated the dashboard statistics automatically.
- Verified that the existing checkout, return, category filtering and overdue highlighting features continued to work.

**Problems encountered:**

- The dashboard layout initially placed the category usage section beside the equipment list, leaving unused space below. I corrected this by updating the CSS grid layout so that the category usage section spans the full dashboard width.
- Additional styling was needed to ensure the inactive List or Chart view remained hidden.

**Learning outcomes:**

I learned how to calculate statistics from existing application data and present them using different visualisations. I also gained experience integrating Chart.js, updating an existing chart instance and using CSS Grid to organise a responsive dashboard.

**Next step:** Expand the initial equipment and loan data to support more realistic testing.

## Additional Improvement – Equipment Inventory and Loan History

**Reason for implementation:**

After completing GT-107, I noticed that the original dataset contained only four equipment items and one loan. I decided to expand the initial data to make the application more realistic and provide a better demonstration of the dashboard statistics.

**Status:** Implementation and testing completed.

**Work completed:**

- Expanded the initial equipment inventory from 4 to 15 items.
- Maintained the existing Cameras, Accessories and Laptops categories.
- Added 25 fictional loan records, including 19 returned loans and 6 active loans.
- Used fictional borrower names and example email addresses.
- Updated the equipment statuses to match the active loan records.
- Kept the additional data inside `dataService.js` rather than introducing a separate file.
- Created a backup of the previous `localStorage` data before loading the new dataset.
- Reset the GearTrack storage entries to allow the application to load the updated initial data.

**Testing:**

- Confirmed that the application displayed 15 equipment items.
- Verified that the dashboard showed 40% of equipment currently loaned before additional testing.
- Confirmed that the category statistics displayed 12 loans for Cameras, 8 for Accessories and 5 for Laptops.
- Verified that six active loans appeared in the Active Loans section.
- Confirmed that three loans were identified as overdue on 12 November 2026.
- Returned the Sony A7 IV and confirmed that the currently loaned percentage decreased from 40% to 33%.
- Verified that the total number of loans remained unchanged while the number of active camera loans decreased.

**Problems encountered:**

The initial data was not updated automatically because `seedInitialData()` only populates `localStorage` when the relevant storage entries do not exist. I used the browser Developer Tools to remove the existing GearTrack storage entries after creating a backup, allowing the updated data to be loaded.

**Learning outcomes:**

I improved my understanding of how initial data is stored and loaded using `localStorage`. I also learned why equipment availability must remain consistent with active loan records and how a larger dataset can help identify issues that may not appear with only a few records.

**Next step:** Improve the visual consistency of the application.

## Additional Improvement – Buttons and Checkout Form Styling

**Reason for implementation:**

After completing the functional requirements, I wanted to improve the visual consistency of the application. The existing action buttons and checkout form did not fully match the appearance of the updated dashboard.

**Status:** Implementation and testing completed.

**Work completed:**

- Updated the Checkout button to use the application's primary colour.
- Styled the Mark Returned button in green and the Cancel button in grey.
- Added consistent padding, font sizes and rounded corners to action buttons.
- Improved the checkout modal's spacing, width, border and background.
- Styled the form labels and input fields for better readability.
- Added hover effects and visible keyboard focus indicators.
- Added support for reduced-motion preferences.
- Preserved the existing checkout and return functionality without modifying the JavaScript logic.

**Testing:**

- Confirmed that the updated buttons displayed correctly.
- Verified that the checkout modal opened and remained centred.
- Checked that the form fields and labels were readable.
- Confirmed that the Cancel button closed the modal.
- Verified that the Confirm Checkout button continued to work.
- Tested keyboard navigation and checked that focus indicators were visible.

**Problems encountered:**

No significant problems were encountered. The styling improvements were implemented within the existing `components.css` file without introducing additional dependencies.

**Learning outcomes:**

I improved my understanding of how CSS can create a consistent user interface without changing application behaviour. I also developed a better awareness of accessibility considerations, particularly keyboard focus indicators and reduced-motion preferences.
