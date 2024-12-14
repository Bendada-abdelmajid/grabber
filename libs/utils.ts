import { OrderStatus, Timestamp } from "./types";

export const generateUniqueId = () => {
  const timestamp = Date.now(); // Current time in milliseconds
  const randomPart = Math.random().toString(36).substr(2, 9); // Random string of 9 characters
  return `${timestamp}-${randomPart}`;
};

export const formatCardNumber = (cardNumber: string): string => {
  return cardNumber.replace(/(\d{4})(?=\d)/g, "$1   ");
};
export const formatPrice = (
  amount: number,
  currency: string = "USD",
  locale: string = "en-US"
): string => {
  try {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency,
    }).format(amount);
  } catch (error) {
    console.error("Error formatting price:", error);
    return amount.toFixed(2); // Fallback formatting
  }
};



export const formatDate = (
  d: Timestamp,
  showTime: boolean = false,
  minute: number = 0
): string => {
  if (!d || typeof d.seconds !== "number") return "Invalid date"; // Validate input

  // Convert seconds to milliseconds and create a Date object
  const date = new Date(d.seconds * 1000);

  // Add optional minutes if provided
  if (minute) date.setMinutes(date.getMinutes() + minute);

  // Extract year, month, and day
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Ensure 2-digit month
  const day = String(date.getDate()).padStart(2, "0"); // Ensure 2-digit day

  if (!showTime) return `${day}/${month}/${year}`;

  // Extract and format time
  const hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";
  const formattedHours = hours % 12 || 12; // Convert to 12-hour format

  return `${day}/${month}/${year} at ${formattedHours}:${minutes} ${ampm}`;
};
