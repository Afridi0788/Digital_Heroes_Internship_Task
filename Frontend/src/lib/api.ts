/**
 * API configuration for Page Pulse
 * Supports both built-in Next.js API routes and external Spring Boot backend
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";

export const API_ENDPOINTS = {
  audit: `${API_BASE_URL}/api/audit`,
  history: `${API_BASE_URL}/api/history`,
  health: `${API_BASE_URL}/api/health`,
};

export default API_ENDPOINTS;
