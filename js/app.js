
/**
 * Application entry point for rendering equipment and loan data.
 * @module app
 */
import { dataService } from './dataService.js';

window.addEventListener("DOMContentLoaded", start);

/**
 * Render the equipment and loans.
 */
function start() {
    renderEquipmentList();
    renderActiveLoans();
}

function createTextElement(elementName, text, className) {
    const element = document.createElement(elementName);
    element.textContent = text ?? '';

    if (className) {
        element.className = className;
    }

    return element;
}
/**
 * Render the equipment list into the page.
 * This loads all equipment items from localStorage via dataService,
 * then creates DOM elements.
 */
async function renderEquipmentList() {
    const container = document.getElementById('equipment-list');
    const items = await dataService.getEquipment();

    const fragment = document.createDocumentFragment();

    items.forEach(item => {
        const card = document.createElement('li');
        card.classList.add('equipment-card');
        //Apply only recognised status class such as available or loaned
        if (item.status === 'available' || item.status === 'loaded') {
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
        fragment.append(card)
    });

    container.replaceChildren(fragment);
}

/**
 * Render the list of active loans into the page.
 * It also looks up the equipment name for each loan.
 */
async function renderActiveLoans() {
    const container = document.getElementById('active-loans-list');
    const loans = await dataService.getLoans();
    const equipment = await dataService.getEquipment();

    if (loans.length === 0) {
        container.innerHTML = '<p>No active loans.</p>';
        return;
    }

    container.innerHTML = loans.map(loan => {
        const item = equipment.find(e => e.id === loan.equipmentId);
        return `
    <div class="loan-card" data-loan-id="${loan.id}">
        <h4>${item ? item.name : 'Unknown Equipment'}</h4>
        <p><strong>Borrower:</strong> ${loan.borrowerName} (${loan.borrowerEmail})</p>
        <p><strong>Due Date:</strong> ${loan.dueDate}</p>
    </div>
    `;
    }).join('');
}
