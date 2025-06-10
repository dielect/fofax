// API configurations and services
export const DEFAULT_API_BASE_URL = 'https://fofa.xmint.cn/api/v1';

// AccountInfo interface definition
export interface AccountInfo {
  error: boolean;
  email: string;
  username: string;
  category: string;
  fcoin: number;
  fofa_point: number;
  remain_free_point: number;
  remain_api_query: number;
  remain_api_data: number;
  isvip: boolean;
  vip_level: number;
  is_verified: boolean;
  avatar: string;
  message: string;
  fofacli_ver: string;
  fofa_server: boolean;
  expiration: string;
}

// Search API interfaces
export interface FofaSearchResponse {
  error: boolean;
  consumed_fpoint: number;
  required_fpoints: number;
  size: number;
  page: number;
  mode: string;
  query: string;
  results: any[][];
  errmsg?: string;
}

export interface FofaSearchParams {
  query: string;
  fields?: string;
  page?: number;
  size?: number;
  full?: boolean;
  apiUrl?: string;
  apiKey?: string;
}

// Default fields to request from API
export const DEFAULT_SEARCH_FIELDS =
[
  "ip",
  "port",
  "protocol",
  "country",
  "country_name",
  "region",
  "city",
  "longitude",
  "latitude",
  "asn",
  "org",
  "host",
  "domain",
  "os",
  "server",
  "icp",
  "title",
  "jarm",
  "header",
  "banner",
  "cert",
  "base_protocol",
  "link",
  "cert.issuer.org",
  "cert.issuer.cn",
  "cert.subject.org",
  "cert.subject.cn",
  "tls.ja3s",
  "tls.version",
  "cert.sn",
  "cert.not_before",
  "cert.not_after",
  "cert.domain",
  "header_hash",
  "banner_hash",
  "banner_fid",
  "product",
  "product_category",
  "version",
  "lastupdatetime",
  "cname"
]
.join(",");

/**
 * Fetches the account information
 */
export async function getAccountInfo(apiUrl?: string, apiKey?: string): Promise<AccountInfo> {
  // Use provided values or get from localStorage
  const baseUrl = apiUrl || getLocalStorageItem('fofax_api_url') || DEFAULT_API_BASE_URL;
  const key = apiKey || getLocalStorageItem('fofax_api_key') || '';
  
  try {
    const response = await fetch(`${baseUrl}/info/my?key=${key}`);
    
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching account info:', error);
    // Return default values in case of error
    return {
      error: true,
      email: "",
      username: "",
      category: "",
      fcoin: 0,
      fofa_point: 0,
      remain_free_point: 0,
      remain_api_query: 0,
      remain_api_data: 0,
      isvip: false,
      vip_level: 0,
      is_verified: false,
      avatar: "",
      message: "Error fetching data",
      fofacli_ver: "",
      fofa_server: false,
      expiration: ""
    };
  }
}

export function toBase64(str: string): string {
  if (typeof window === 'undefined') {
    return Buffer.from(str, 'utf-8').toString('base64'); // Node.js (SSR)
  }
  return btoa(unescape(encodeURIComponent(str))); // Browser
}

// Helper function to safely get localStorage values
function getLocalStorageItem(key: string): string | null {
  if (typeof window !== 'undefined') {
    try {
      return localStorage.getItem(key);
    } catch (error) {
      console.error(`Error reading ${key} from localStorage:`, error);
      return null;
    }
  }
  return null;
}

/**
 * Executes a search query against the FOFA API
 * @param params Search parameters
 * @returns Search results
 */
export async function searchFofa(params: FofaSearchParams): Promise<FofaSearchResponse> {
  try {
    // Base64 encode the query as required by the API
    const qbase64 = toBase64(params.query);
    
    // Get API URL and key from params or localStorage
    const baseUrl = params.apiUrl || getLocalStorageItem('fofax_api_url') || DEFAULT_API_BASE_URL;
    const apiKey = params.apiKey || getLocalStorageItem('fofax_api_key') || '';
    
    // Build the URL with query parameters
    const url = new URL(`${baseUrl}/search/all`);
    url.searchParams.append('key', apiKey);
    url.searchParams.append('qbase64', qbase64);
    
    // Add optional parameters if provided
    if (params.fields) {
      url.searchParams.append('fields', params.fields);
    } else {
      url.searchParams.append('fields', DEFAULT_SEARCH_FIELDS);
    }
    
    if (params.page) {
      url.searchParams.append('page', params.page.toString());
    }
    
    if (params.size) {
      url.searchParams.append('size', params.size.toString());
    }
    
    if (params.full !== undefined) {
      url.searchParams.append('full', params.full.toString());
    }
    
    // Add r_type to get JSON response
    url.searchParams.append('r_type', 'json');
    
    // Execute the API request
    const response = await fetch(url.toString());
    
    if (!response.ok) {
      throw new Error(`Search API request failed with status ${response.status}`);
    }
    
    const data = await response.json();
    
    // Check for API error response even with 200 status
    if (data.error === true) {
      console.error('API returned an error:', data.errmsg);
      return {
        error: true,
        consumed_fpoint: 0,
        required_fpoints: 0,
        size: 0,
        page: 1,
        mode: "error",
        query: params.query,
        results: [],
        errmsg: data.errmsg || "Unknown API error"
      };
    }
    
    return data;
  } catch (error) {
    console.error('Error executing FOFA search:', error);
    // Return an error response
    return {
      error: true,
      consumed_fpoint: 0,
      required_fpoints: 0,
      size: 0,
      page: 1,
      mode: "error",
      query: params.query,
      results: [],
      errmsg: error instanceof Error ? error.message : "Unknown error"
    };
  }
} 