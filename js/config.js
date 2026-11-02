/*
 * ============================================================
 *  PHOENIX FINANCIAL SERVICES: WEBSITE SETTINGS
 *  This is the only file you need to edit for day-to-day changes.
 *  (On GitHub: open this file, click the pencil icon, edit, Commit.)
 * ============================================================
 */
window.PHOENIX_CONFIG = {
  companyName: "Phoenix Financial Services",

  // Phone numbers: 10 digits, no spaces, no +91
  generalPhone: "7074501503",     // general enquiries (Call)
  whatsappNumber: "7074501503",   // general enquiries (WhatsApp)
  grievancePhone: "8670843143",   // complaints & grievances only

  email: "servicesphoenixfinancial@gmail.com",
  address: "10th Floor, 10ES2, East Tower, Mani Casadona, International Financial Hub (CBD), New Town, Chakpachuria, West Bengal 700160",
  businessHours: "Mon – Sat: 9:30 AM – 6:30 PM",

  /*
   * WHERE FORM SUBMISSIONS GO
   * Option A (recommended): Google Sheet. Follow google-apps-script/Code.gs,
   *   then paste your Web app URL (ends in /exec) between the quotes below.
   * Option B (works straight away): if googleSheetUrl is left empty, every form
   *   is emailed to emailForwardTo via FormSubmit.co. The very first submission
   *   sends an "Activate Form" email to that address. Click it once, and all
   *   later submissions arrive in the inbox.
   */
  googleSheetUrl: "",
  emailForwardTo: "servicesphoenixfinancial@gmail.com",

  // Show the "Welcome" details popup when someone opens the website
  showEntryPopup: true,
  // Allow visitors to close the entry popup without filling it (true / false)
  entryPopupSkippable: false,
};
