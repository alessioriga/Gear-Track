/**
 * Storage keys used in localStorage for this application.
 * @readonly
 * @enum {string}
 */
const STORAGE_KEYS = {
  EQUIPMENT: "geartrack_equipment",
  LOANS: "geartrack_loans",
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
 * Includes 15 equipment items across three categories.
 * @type {Equipment[]}
 */
const initialEquipment = [
  // Cameras
  { id: "EQ-101", name: "Canon EOS R6", category: "Cameras", status: "available" },
  { id: "EQ-102", name: "Sony FX3", category: "Cameras", status: "loaned" },
  { id: "EQ-105", name: "Nikon Z6 III", category: "Cameras", status: "loaned" },
  { id: "EQ-106", name: "Panasonic GH6", category: "Cameras", status: "available" },
  { id: "EQ-107", name: "Sony A7 IV", category: "Cameras", status: "loaned" },

  // Accessories
  { id: "EQ-103", name: "Manfrotto Tripod", category: "Accessories", status: "available" },
  { id: "EQ-108", name: "DJI RS 4", category: "Accessories", status: "loaned" },
  { id: "EQ-109", name: "Rode VideoMic Pro+", category: "Accessories", status: "available" },
  { id: "EQ-110", name: "Godox SL60W", category: "Accessories", status: "loaned" },
  { id: "EQ-111", name: "Zoom H6", category: "Accessories", status: "available" },

  // Laptops
  { id: "EQ-104", name: 'MacBook Pro 16"', category: "Laptops", status: "available" },
  { id: "EQ-112", name: "Dell XPS 15", category: "Laptops", status: "loaned" },
  { id: "EQ-113", name: "Lenovo ThinkPad X1", category: "Laptops", status: "available" },
  { id: "EQ-114", name: "HP ZBook", category: "Laptops", status: "available" },
  { id: "EQ-115", name: "ASUS ProArt", category: "Laptops", status: "available" },
];

/**
 * The initial loan history used when localStorage is empty.
 * Includes returned, active and overdue loans for demonstration purposes.
 * All borrower details are fictional.
 *
 * @type {Loan[]}
 */
const initialLoans = [
  // Cameras
  { id: "LN-501", equipmentId: "EQ-102", borrowerName: "Alex Root", borrowerEmail: "alex.root@example.com", dueDate: "2026-08-15", status: "active" },
  { id: "LN-502", equipmentId: "EQ-101", borrowerName: "Jamie Reed", borrowerEmail: "jamie.reed@example.com", dueDate: "2026-01-20", status: "returned" },
  { id: "LN-503", equipmentId: "EQ-105", borrowerName: "Taylor Smith", borrowerEmail: "taylor.smith@example.com", dueDate: "2026-02-12", status: "returned" },
  { id: "LN-504", equipmentId: "EQ-106", borrowerName: "Jordan Lee", borrowerEmail: "jordan.lee@example.com", dueDate: "2026-03-18", status: "returned" },
  { id: "LN-505", equipmentId: "EQ-107", borrowerName: "Casey Morgan", borrowerEmail: "casey.morgan@example.com", dueDate: "2026-04-10", status: "returned" },
  { id: "LN-506", equipmentId: "EQ-102", borrowerName: "Sam Turner", borrowerEmail: "sam.turner@example.com", dueDate: "2026-05-14", status: "returned" },
  { id: "LN-507", equipmentId: "EQ-101", borrowerName: "Robin Clark", borrowerEmail: "robin.clark@example.com", dueDate: "2026-06-22", status: "returned" },
  { id: "LN-508", equipmentId: "EQ-106", borrowerName: "Morgan White", borrowerEmail: "morgan.white@example.com", dueDate: "2026-07-08", status: "returned" },
  { id: "LN-509", equipmentId: "EQ-105", borrowerName: "Avery Brown", borrowerEmail: "avery.brown@example.com", dueDate: "2026-08-19", status: "returned" },
  { id: "LN-510", equipmentId: "EQ-107", borrowerName: "Riley Adams", borrowerEmail: "riley.adams@example.com", dueDate: "2026-09-25", status: "returned" },
  { id: "LN-511", equipmentId: "EQ-105", borrowerName: "Charlie Evans", borrowerEmail: "charlie.evans@example.com", dueDate: "2026-11-08", status: "active" },
  { id: "LN-512", equipmentId: "EQ-107", borrowerName: "Drew Wilson", borrowerEmail: "drew.wilson@example.com", dueDate: "2026-11-25", status: "active" },

  // Accessories
  { id: "LN-513", equipmentId: "EQ-103", borrowerName: "Blake Harris", borrowerEmail: "blake.harris@example.com", dueDate: "2026-02-05", status: "returned" },
  { id: "LN-514", equipmentId: "EQ-108", borrowerName: "Harper Green", borrowerEmail: "harper.green@example.com", dueDate: "2026-03-11", status: "returned" },
  { id: "LN-515", equipmentId: "EQ-109", borrowerName: "Quinn Walker", borrowerEmail: "quinn.walker@example.com", dueDate: "2026-04-16", status: "returned" },
  { id: "LN-516", equipmentId: "EQ-110", borrowerName: "Parker Hall", borrowerEmail: "parker.hall@example.com", dueDate: "2026-06-03", status: "returned" },
  { id: "LN-517", equipmentId: "EQ-111", borrowerName: "Cameron Scott", borrowerEmail: "cameron.scott@example.com", dueDate: "2026-08-12", status: "returned" },
  { id: "LN-518", equipmentId: "EQ-103", borrowerName: "Finley King", borrowerEmail: "finley.king@example.com", dueDate: "2026-09-17", status: "returned" },
  { id: "LN-519", equipmentId: "EQ-108", borrowerName: "Rowan Hill", borrowerEmail: "rowan.hill@example.com", dueDate: "2026-11-02", status: "active" },
  { id: "LN-520", equipmentId: "EQ-110", borrowerName: "Skyler Young", borrowerEmail: "skyler.young@example.com", dueDate: "2026-11-28", status: "active" },

  // Laptops
  { id: "LN-521", equipmentId: "EQ-104", borrowerName: "Elliot Baker", borrowerEmail: "elliot.baker@example.com", dueDate: "2026-03-09", status: "returned" },
  { id: "LN-522", equipmentId: "EQ-112", borrowerName: "Reese Carter", borrowerEmail: "reese.carter@example.com", dueDate: "2026-05-21", status: "returned" },
  { id: "LN-523", equipmentId: "EQ-113", borrowerName: "Alex Parker", borrowerEmail: "alex.parker@example.com", dueDate: "2026-07-15", status: "returned" },
  { id: "LN-524", equipmentId: "EQ-115", borrowerName: "Jamie Foster", borrowerEmail: "jamie.foster@example.com", dueDate: "2026-09-30", status: "returned" },
  { id: "LN-525", equipmentId: "EQ-112", borrowerName: "Taylor Cooper", borrowerEmail: "taylor.cooper@example.com", dueDate: "2026-11-20", status: "active" },
];

/**
 * Seed localStorage with default equipment and loans if none exist yet.
 * This ensures the application has initial data to display on first load.
 */
function seedInitialData() {
  if (!localStorage.getItem(STORAGE_KEYS.EQUIPMENT)) {
    localStorage.setItem(
      STORAGE_KEYS.EQUIPMENT,
      JSON.stringify(initialEquipment),
    );
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
      status: "active",
      ...loanData,
    };

    // Save the new loan to localStorage.
    loans.push(newLoan);
    localStorage.setItem(STORAGE_KEYS.LOANS, JSON.stringify(loans));

    // Find the equipment associated with the new loan.
    const equipment = await this.getEquipment();
    const item = equipment.find((e) => e.id === loanData.equipmentId);

    if (item) {
      // Mark the equipment as loaned.
      item.status = "loaned";
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
      (loan) => loan.id === loanId && loan.status === "active",
    );

    // Stop if the loan does not exist or has already been returned.
    if (!loan) {
      return false;
    }

    // Find the equipment associated with the loan.
    const equipment = await this.getEquipment();
    const item = equipment.find((item) => item.id === loan.equipmentId);

    // Stop if the associated equipment cannot be found.
    if (!item) {
      return false;
    }

    // Update the loan and equipment statuses.
    loan.status = "returned";
    item.status = "available";

    // Save the updated information to localStorage.
    localStorage.setItem(STORAGE_KEYS.LOANS, JSON.stringify(loans));
    localStorage.setItem(STORAGE_KEYS.EQUIPMENT, JSON.stringify(equipment));

    return true;
  },

  /**
   * GT-107: Calculate department equipment usage statistics.
   * Calculate inventory totals, loan percentages, overdue items
   * and equipment usage by category.
   *
   * @returns {Promise<{
   *   totalItems: number,
   *   currentlyLoaned: number,
   *   overdueItems: number,
   *   categoryUsage: Array<{
   *     category: string,
   *     totalLoans: number,
   *     activeLoans: number
   *   }>
   * }>} The calculated department statistics.
   */
  async getStats() {
    const equipment = await this.getEquipment();
    const loans = await this.getLoans();

    // GT-107: Count all equipment items in the inventory.
    const totalItems = equipment.length;

    // Count equipment items currently marked as loaned.
    const loanedItems = equipment.filter(
      (item) => item.status === "loaned",
    ).length;

    // Calculate the percentage of equipment currently loaned.
    // Prevent division by zero when the inventory is empty.
    const currentlyLoaned =
      totalItems === 0 ? 0 : Math.round((loanedItems / totalItems) * 100);

    // Get today's local date in YYYY-MM-DD format.
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");

    const todayString = `${year}-${month}-${day}`;

    // Count active loans with a due date earlier than today.
    const overdueItems = loans.filter(
      (loan) => loan.status === "active" && loan.dueDate < todayString,
    ).length;

    // GT-107: Get all unique equipment categories.
    const categories = [...new Set(equipment.map((item) => item.category))];

    // GT-107: Calculate total and active loans for each category.
    const categoryUsage = categories.map((category) => {
      // Find all loans associated with this equipment category.
      const categoryLoans = loans.filter((loan) => {
        const item = equipment.find((item) => item.id === loan.equipmentId);

        return item?.category === category;
      });

      // Count all loans, including returned loans.
      const totalLoans = categoryLoans.length;

      // Count only loans that are currently active.
      const activeLoans = categoryLoans.filter(
        (loan) => loan.status === "active",
      ).length;

      return {
        category,
        totalLoans,
        activeLoans,
      };
    });

    return {
      totalItems,
      currentlyLoaned,
      overdueItems,
      categoryUsage,
    };
  },
};
