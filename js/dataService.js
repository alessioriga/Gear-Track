
/**
 * Storage keys used in localStorage for this application.
 * @readonly
 * @enum {string}
 */
const STORAGE_KEYS = {
    EQUIPMENT: 'geartrack_equipment',
    LOANS: 'geartrack_loans'
};

/**
 * Represents an equipment item in the inventory.
 * @typedef {Object} Equipment
 * @property {string} id - Unique equipment identifier.
 * @property {string} name - Human-readable equipment name.
 * @property {string} category - The equipment category, such as Cameras or Laptops.
 * @property {'available'|'loaned'} status - Current availability of the equipment.
 */

/**
 * Represents an equipment loan record.
 * @typedef {Object} Loan
 * @property {string} id - Unique loan identifier.
 * @property {string} equipmentId - The ID of the equipment being loaned.
 * @property {string} borrowerName - Name of the person borrowing the equipment.
 * @property {string} borrowerEmail - Email address of the borrower.
 * @property {string} dueDate - Due date for returning the equipment.
 * @property {'active'|'returned'} status - Current status of the loan.
 */

/**
 * Represents the information required to create a new loan.
 * @typedef {Object} NewLoanData
 * @property {string} equipmentId - The ID of the equipment being loaned.
 * @property {string} borrowerName - Name of the person borrowing the equipment.
 * @property {string} borrowerEmail - Email address of the borrower.
 * @property {string} dueDate - Due date for returning the equipment.
 */

/**
 * The initial equipment list used when localStorage is empty.
 * @type {Equipment[]}
 */
const initialEquipment = [
    { id: 'EQ-101', name: 'Canon EOS R6', category: 'Cameras', status: 'available' },
    { id: 'EQ-102', name: 'Sony FX3', category: 'Cameras', status: 'loaned' },
    { id: 'EQ-103', name: 'Manfrotto Tripod', category: 'Accessories', status: 'available' },
    { id: 'EQ-104', name: 'MacBook Pro 16"', category: 'Laptops', status: 'available' }
];

/**
 * The initial loan list used when localStorage is empty.
 * @type {Loan[]}
 */
const initialLoans = [
    {
        id: 'LN-501',
        equipmentId: 'EQ-102',
        borrowerName: 'Alex Root',
        borrowerEmail: 'alexroot@college.ac.uk',
        dueDate: '2026-08-15',
        status: 'active'
    }
];

/**
 * Seed localStorage with default equipment and loans if none exist yet.
 * This ensures the application has initial data to display on first load.
 */
function seedInitialData() {
    if (!localStorage.getItem(STORAGE_KEYS.EQUIPMENT)) {
        localStorage.setItem(STORAGE_KEYS.EQUIPMENT, JSON.stringify(initialEquipment));
    }

    if (!localStorage.getItem(STORAGE_KEYS.LOANS)) {
        localStorage.setItem(STORAGE_KEYS.LOANS, JSON.stringify(initialLoans));
    }
}

seedInitialData();

/**
 * Provides methods for managing equipment and loan data in localStorage.
 */
export const dataService = {
    /**
     * Load equipment data from localStorage.
     * @returns {Promise<Equipment[]>} Array of equipment items.
     */
    async getEquipment() {
        const data = localStorage.getItem(STORAGE_KEYS.EQUIPMENT);
        return JSON.parse(data) || [];
    },

    /**
     * Load loan data from localStorage.
     * @returns {Promise<Loan[]>} Array of loan records.
     */
    async getLoans() {
        const data = localStorage.getItem(STORAGE_KEYS.LOANS);
        return JSON.parse(data) || [];
    },

    /**
     * GT-101: Save a new loan record and update the equipment status.
     *
     * @param {NewLoanData} loanData - Information about the new loan.
     * @returns {Promise<Loan>} The newly created loan record.
     */
    async saveLoan(loanData) {
        const loans = await this.getLoans();

        // Create a new active loan record.
        const newLoan = {
            id: `LN-${Date.now().toString().slice(-4)}`,
            status: 'active',
            ...loanData
        };

        // Save the new loan to localStorage.
        loans.push(newLoan);
        localStorage.setItem(STORAGE_KEYS.LOANS, JSON.stringify(loans));

        // Find the equipment associated with the new loan.
        const equipment = await this.getEquipment();
        const item = equipment.find(e => e.id === loanData.equipmentId);

        if (item) {
            // Mark the equipment as loaned.
            item.status = 'loaned';
            localStorage.setItem(STORAGE_KEYS.EQUIPMENT, JSON.stringify(equipment));
        }

        return newLoan;
    },

    /**
     * GT-104: Mark an active loan as returned and make its equipment available.
     *
     * @param {string} loanId - ID of the loan being returned.
     * @returns {Promise<boolean>} True if the loan was returned successfully, otherwise false.
     */
    async returnLoan(loanId) {
        const loans = await this.getLoans();

        // Find the active loan matching the provided ID.
        const loan = loans.find(
            loan => loan.id === loanId && loan.status === 'active'
        );

        // Stop if the loan does not exist or has already been returned.
        if (!loan) {
            return false;
        }

        // Find the equipment associated with the loan.
        const equipment = await this.getEquipment();
        const item = equipment.find(
            item => item.id === loan.equipmentId
        );

        // Stop if the associated equipment cannot be found.
        if (!item) {
            return false;
        }

        // Update the loan and equipment statuses.
        loan.status = 'returned';
        item.status = 'available';

        // Save the updated information to localStorage.
        localStorage.setItem(STORAGE_KEYS.LOANS, JSON.stringify(loans));
        localStorage.setItem(STORAGE_KEYS.EQUIPMENT, JSON.stringify(equipment));

        return true;
    }
};
