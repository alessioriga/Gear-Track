/**
 * Application entry point for rendering equipment and loan data.
 * @module app
 */

import { dataService } from "./dataService.js";

window.addEventListener("DOMContentLoaded", start);

/**
 * Initialise the application by rendering equipment and active loans
 * and registering event listeners for user interactions.
 */
function start() {
  renderEquipmentList();
  renderActiveLoans();

  // GT-102: Get the category filter used to filter equipment.
  const categoryFilter = document.getElementById("category-filter");

  // GT-101: Get the checkout form and modal controls.
  const cancelButton = document.getElementById("cancel-checkout");
  const checkoutModal = document.getElementById("checkout-modal");
  const checkoutForm = document.getElementById("checkout-form");

  // GT-102: Update the equipment list when the selected category changes.
  categoryFilter.addEventListener("change", renderEquipmentList);

  // GT-101: Close the checkout modal without saving a loan.
  cancelButton.addEventListener("click", () => {
    checkoutModal.close();
  });

  // GT-101: Handle the checkout form submission.
  checkoutForm.addEventListener("submit", handleCheckout);
}

/**
 * GT-103: DOM-based XSS Mitigation.
 * Create an HTML element and insert dynamic content safely using textContent.
 * This prevents user-provided text from being interpreted as HTML.
 *
 * @param {string} elementName - HTML element name.
 * @param {string} text - Text to display.
 * @param {string} [className] - Optional CSS class to assign to the element.
 * @returns {HTMLElement} The created element.
 */
function createTextElement(elementName, text, className) {
  const element = document.createElement(elementName);
  element.textContent = text ?? "";

  if (className) {
    element.className = className;
  }

  return element;
}

function isLoanOverdue(dueDate) {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  const todayString = `${year}-${month}-${day}`;
  return dueDate < todayString;
}

/**
 * Render the equipment list using safe DOM methods.
 * GT-102: Filter equipment based on the selected category.
 * GT-101: Display a Checkout button for available equipment.
 * GT-103: Display dynamic equipment information safely.
 * GT-104: Reflect equipment availability after a loan is returned.
 *
 * @returns {Promise<void>}
 */
async function renderEquipmentList() {
  const container = document.getElementById("equipment-list");
  const categoryFilter = document.getElementById("category-filter");

  const items = await dataService.getEquipment();
  const selectedCategory = categoryFilter.value;

  // GT-102: Filter equipment by category or display all items.
  const filteredItems =
    selectedCategory === "all"
      ? items
      : items.filter((item) => item.category === selectedCategory);

  const fragment = document.createDocumentFragment();

  filteredItems.forEach((item) => {
    const card = document.createElement("li");
    card.classList.add("equipment-card");

    // GT-103: Apply only recognised equipment status classes.
    if (item.status === "available" || item.status === "loaned") {
      card.classList.add(`status-${item.status}`);
    }

    const heading = createTextElement("h3", item.name);
    const badge = createTextElement("span", item.category, "badge");

    const statusParagraph = document.createElement("p");
    statusParagraph.append(document.createTextNode("Status: "));

    const statusText = createTextElement("strong", item.status);
    statusParagraph.append(statusText);

    card.append(heading, badge, statusParagraph);

    // GT-101: Display the Checkout button only for available equipment.
    if (item.status === "available") {
      const checkoutButton = document.createElement("button");
      checkoutButton.type = "button";
      checkoutButton.textContent = "Checkout";
      checkoutButton.classList.add("checkout-button");

      // Open the checkout modal for the selected equipment.
      checkoutButton.addEventListener("click", () => {
        openCheckoutModal(item.id);
      });

      card.append(checkoutButton);
    }

    fragment.append(card);
  });

  // GT-103: Replace the existing content with safely created DOM elements.
  container.replaceChildren(fragment);
}

/**
 * Render active loan information using safe DOM methods.
 * GT-103: Display borrower details as text rather than HTML.
 * GT-104: Exclude returned loans and provide a Mark Returned button.
 * GT-105: Highlight overdue loans and update the overdue counter.
 *
 * @returns {Promise<void>}
 */
async function renderActiveLoans() {
  const container = document.getElementById("active-loans-list");

  // GT-104: Retrieve only active loans, excluding returned equipment.
  const loans = (await dataService.getLoans()).filter(
    (loan) => loan.status === "active",
  );

  const equipment = await dataService.getEquipment();

  const overdueCount = loans.filter((loan) =>
    isLoanOverdue(loan.dueDate),
  ).length;

  const overdueCounter = document.getElementById("overdue-counter");
  overdueCounter.textContent = `${overdueCount} Overdue Loans`;

  // Display a message when no active loans remain.
  if (loans.length === 0) {
    container.replaceChildren(createTextElement("p", "No active loans."));
    return;
  }

  const fragment = document.createDocumentFragment();

  loans.forEach((loan) => {
    // Find the equipment associated with the loan.
    const item = equipment.find(
      (equipmentItem) => equipmentItem.id === loan.equipmentId,
    );

    const card = document.createElement("div");
    card.classList.add("loan-card");
    card.dataset.loanId = loan.id;

    if (isLoanOverdue(loan.dueDate)) {
        card.classList.add("overdue");
    }

    const heading = createTextElement(
      "h4",
      item ? item.name : "Unknown Equipment",
    );

    const borrowerParagraph = document.createElement("p");
    const borrowerLabel = createTextElement("strong", "Borrower:");

    borrowerParagraph.append(
      borrowerLabel,
      document.createTextNode(` ${loan.borrowerName} (${loan.borrowerEmail})`),
    );

    const dueDateParagraph = document.createElement("p");
    const dueDateLabel = createTextElement("strong", "Due Date:");

    dueDateParagraph.append(
      dueDateLabel,
      document.createTextNode(` ${loan.dueDate}`),
    );

    card.append(heading, borrowerParagraph, dueDateParagraph);

    // GT-104: Create a return button for each active loan.
    const returnButton = document.createElement("button");
    returnButton.type = "button";
    returnButton.textContent = "Mark Returned";
    returnButton.classList.add("return-button");

    // Return the selected equipment when the button is clicked.
    returnButton.addEventListener("click", () => {
      handleReturn(loan.id);
    });

    card.append(returnButton);
    fragment.append(card);
  });

  // Update the Active Loans section without reloading the page.
  container.replaceChildren(fragment);
}

/**
 * GT-101: Open the checkout modal for the selected equipment.
 * Store the equipment ID and reset the form before displaying it.
 *
 * @param {string} equipmentId - ID of the equipment being checked out.
 * @returns {void}
 */
function openCheckoutModal(equipmentId) {
  const modal = document.getElementById("checkout-modal");
  const form = document.getElementById("checkout-form");

  // Store the selected equipment ID for the form submission.
  form.dataset.equipmentId = equipmentId;

  // Clear any previously entered borrower details.
  form.reset();

  modal.showModal();
}

/**
 * GT-101: Handle checkout form submission.
 * Save the loan and refresh the equipment and active loans sections
 * without reloading the page.
 *
 * @param {SubmitEvent} event - The checkout form submission event.
 * @returns {Promise<void>}
 */
async function handleCheckout(event) {
  // Prevent the page from reloading when submitting the form.
  event.preventDefault();

  const form = event.currentTarget;
  const modal = document.getElementById("checkout-modal");

  // Collect the borrower details and selected equipment ID.
  const loanData = {
    equipmentId: form.dataset.equipmentId,
    borrowerName: document.getElementById("borrower-name").value.trim(),
    borrowerEmail: document.getElementById("borrower-email").value.trim(),
    dueDate: document.getElementById("return-date").value,
  };

  try {
    // GT-101: Save the loan and update the equipment status.
    await dataService.saveLoan(loanData);

    // Close the modal and clear the form after a successful checkout.
    modal.close();
    form.reset();

    // Refresh both sections without reloading the page.
    await renderEquipmentList();
    await renderActiveLoans();
  } catch (error) {
    console.error("Unable to save the loan:", error);
    alert("The checkout could not be completed. Please try again.");
  }
}

/**
 * GT-104: Handle the return of an active equipment loan.
 * Update the loan and equipment statuses through dataService,
 * then refresh both sections without reloading the page.
 *
 * @param {string} loanId - ID of the loan being returned.
 * @returns {Promise<void>}
 */
async function handleReturn(loanId) {
  try {
    // Mark the loan as returned and make the equipment available.
    const success = await dataService.returnLoan(loanId);

    // Stop if the loan could not be returned.
    if (!success) {
      alert("The loan could not be returned.");
      return;
    }

    // Refresh both sections to reflect the updated statuses.
    await renderEquipmentList();
    await renderActiveLoans();
  } catch (error) {
    // Report any errors encountered during the return process.
    console.error("Unable to return the loan:", error);
    alert("An error occurred while returning the equipment.");
  }
}
