
export const handleError = (error) => {
  let errorMessage = 'An unexpected error occurred';
  
  if (error.response) {
    // Server errors
    errorMessage = error.response.data.message || error.message;
    console.error('Server Error:', errorMessage);
  } else if (error.request) {
    // Network errors
    errorMessage = 'Network error occurred. Please check your connection.';
    console.error('Network Error:', error.message);
  } else {
    // Other errors
    errorMessage = error.message;
    console.error('Error:', error.message);
  }
  
  return Promise.reject({ message: errorMessage });
};