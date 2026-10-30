
/**
 * Application entry point for rendering equipment and loan data.
 * @module app
 */

import { dataService } from './dataService.js';

window.addEventListener("DOMContentLoaded", start);

/**
 * Start the application and initialise event listeners.
 */
function start() {
    renderEquipmentList();
    renderActiveLoans();

    // GT-102: Listen for changes to the equipment category via .filter() method.
    const categoryFilter = document.getElementById('category-filter');

    categoryFilter.addEventListener('change', renderEquipmentList);
}

/**
 * GT-103: DOM-based XSS Mitigation
 * Use textContent to display dynamic data safely instead of interpreting it as HTML.
 * This helps prevent malicious input from executing JavaScript in the browser.
 *
 * @param {string} elementName - HTML element name.
 * @param {string} text - Text to display.
 * @param {string} [className] - The CSS class to assign to the element.
 * @returns {HTMLElement} The created element.
 */
function createTextElement(elementName, text, className) {
    const element = document.createElement(elementName);
    element.textContent = text ?? '';

    if (className) {
        element.className = className;
    }

    return element;
}

/**
 * Render the equipment list using safe DOM methods.
 * Equipment names, categories and statuses are displayed as text
 * rather than being interpreted as HTML.
 */
async function renderEquipmentList() {
    const container = document.getElementById('equipment-list');
    const categoryFilter = document.getElementById('category-filter');

    const items = await dataService.getEquipment();
    const selectedCategory = categoryFilter.value;

    // Filter equipment when a specific category is selected in the dropdown menu.
    const filteredItems = selectedCategory === 'all'
    ? items
    : items.filter(item => item.category === selectedCategory);

    const fragment = document.createDocumentFragment();

    filteredItems.forEach(item => {
        const card = document.createElement('li');
        card.classList.add('equipment-card');

        // Apply only recognised status class such as available or loaned.
        if (item.status === 'available' || item.status === 'loaned') {
            card.classList.add(`status-${item.status}`);
        }

        const heading = createTextElement('h3', item.name);
        const badge = createTextElement('span', item.category, 'badge');

        const statusParagraph = document.createElement('p');
        statusParagraph.append(
            document.createTextNode('Status: ')
        );

        const statusText = createTextElement('strong', item.status);
        statusParagraph.append(statusText);

        card.append(heading, badge, statusParagraph);
        fragment.append(card);
    });

    container.replaceChildren(fragment);
}

/**
 * GT-103: Render loan information using safe DOM methods.
 * Borrower names, email addresses and due dates are inserted as text nodes
 * so that user-provided values are not interpreted as HTML.
 */
async function renderActiveLoans() {
    const container = document.getElementById('active-loans-list');
    const loans = await dataService.getLoans();
    const equipment = await dataService.getEquipment();

    if (loans.length === 0) {
        container.replaceChildren(
            createTextElement('p', 'No active loans.')
        );
        return;
    }

    const fragment = document.createDocumentFragment();

    loans.forEach(loan => {
        const item = equipment.find(
            equipmentItem => equipmentItem.id === loan.equipmentId
        );

        const card = document.createElement('div');
        card.classList.add('loan-card');
        card.dataset.loanId = loan.id;

        const heading = createTextElement(
            'h4',
            item ? item.name : 'Unknown Equipment'
        );

        const borrowerParagraph = document.createElement('p');
        const borrowerLabel = createTextElement('strong', 'Borrower:');

        borrowerParagraph.append(
            borrowerLabel,
            document.createTextNode(
                ` ${loan.borrowerName} (${loan.borrowerEmail})`
            )
        );

        const dueDateParagraph = document.createElement('p');
        const dueDateLabel = createTextElement('strong', 'Due Date:');

        dueDateParagraph.append(
            dueDateLabel,
            document.createTextNode(` ${loan.dueDate}`)
        );

        card.append(
            heading,
            borrowerParagraph,
            dueDateParagraph
        );

        fragment.append(card);
    });

    container.replaceChildren(fragment);
}
