
/**
 * Utility functions for project service
 */

/**
 * Encodes file content for storage
 */
export function encodeFileContent(content?: string): Uint8Array | null {
  if (!content) return null;
  return new TextEncoder().encode(content);
}

/**
 * Decodes file content from storage
 */
export function decodeFileContent(content: any): string {
  // If content is missing, return empty string
  if (!content) return '';
  
  try {
    // Handle both ArrayBuffer and string content formats
    if (typeof content === 'string') {
      return content;
    } else {
      // Handle binary content
      const buffer = content.buffer || content;
      return new TextDecoder().decode(buffer);
    }
  } catch (e) {
    console.error(`Error decoding content:`, e);
    return ''; // Default to empty content on error
  }
}
