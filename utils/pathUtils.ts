export const convertToWebPath = (path: string): string => {
  if (!path) return '';
  
  // If already a web path or URL, return as is
  if (path.startsWith('/') || path.startsWith('http')) {
    return path;
  }
  
  // Handle absolute paths
  if (path.includes('/public/')) {
    return '/' + path.split('/public/').pop();
  }
  
  // Handle paths that include 'images/'
  if (path.includes('/images/')) {
    return '/' + path.split('/images/').pop();
  }
  
  // For other cases, assume it's relative to /images/
  return `/images/${path}`;
}; 