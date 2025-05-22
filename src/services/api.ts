// src/services/api.ts
import axios from "axios";

// Define an interface for the expected product structure from Open Food Facts API
// This is a simplified version; you might want to expand it based on the data you need.
export interface NutrientLevels {
  fat?: string;
  salt?: string;
  "saturated-fat"?: string;
  sugars?: string;
}

export interface Nutriments {
  energy_value?: number; // Example: in kJ
  energy_unit?: string;
  proteins_100g?: number;
  fat_100g?: number;
  sugars_100g?: number;
  salt_100g?: number;
  sodium_100g?: number;
  carbohydrates_100g?: number;
  fiber_100g?: number;
  // Add other nutriments you care about, check API response for exact keys
  // Values might be per 100g or per serving, ensure you know which one
  sugars_serving?: number;
  salt_serving?: number;
  sodium_serving?: number;
}

export interface Product {
  product_name?: string;
  product_name_en?: string;
  brands?: string;
  ingredients_text?: string;
  nutriments: Nutriments;
  nutrient_levels?: NutrientLevels;
  image_url?: string;
  // Add any other fields you need
}

export interface OpenFoodFactsResponse {
  status: number; // 1 if product found, 0 otherwise
  status_verbose: string;
  product?: Product;
  code: string; // The barcode scanned
}

const API_BASE_URL = "https://world.openfoodfacts.org/api/v2";

/**
 * Fetches product information from the Open Food Facts API using a barcode.
 * @param barcode The barcode string to look up.
 * @returns A Promise that resolves to the API response.
 */
export const fetchProductInfoByBarcode = async (
  barcode: string
): Promise<OpenFoodFactsResponse> => {
  try {
    // Construct the API URL
    const apiUrl = `${API_BASE_URL}/product/${barcode}.json`;
    console.log(`Fetching product info from: ${apiUrl}`);

    // Make the GET request using axios
    const response = await axios.get<OpenFoodFactsResponse>(apiUrl);

    // axios throws an error for non-2xx status codes, so we mostly get here on success.
    // However, Open Food Facts API might return 200 OK but with status: 0 if product not found.
    console.log("API Response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching product info from API:", error);
    // Handle different types of errors (network error, API error response)
    if (axios.isAxiosError(error)) {
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error("API Error Response Data:", error.response.data);
        console.error("API Error Response Status:", error.response.status);
        // You could return a custom error object or re-throw a more specific error
        // For Open Food Facts, a 404 might mean product not found, which they also handle with status:0 in a 200 response.
        // So, we might want to return a structure similar to a successful "not found" response.
        return {
          status: 0,
          status_verbose: `Product not found or API error: ${error.response.status}`,
          code: barcode,
        };
      } else if (error.request) {
        // The request was made but no response was received
        console.error("API No Response:", error.request);
        throw new Error("Network error or no response from server.");
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error("API Request Setup Error:", error.message);
        throw new Error(`Error setting up API request: ${error.message}`);
      }
    }
    // Fallback for non-Axios errors
    throw new Error(
      "An unexpected error occurred while fetching product data."
    );
  }
};
