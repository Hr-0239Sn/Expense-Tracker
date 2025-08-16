// export const validateEmail = (email) => {
//   const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  // return RegExp.test(email);
// };



export const validateEmail = (email) => {
  // Check if email is provided and is a string
  if (!email || typeof email !== 'string') return false;
  
  // Trim whitespace and check minimum length
  const trimmedEmail = email.trim();
  if (trimmedEmail.length < 5) return false; // a@b.c is shortest valid
  
  // Test against regex pattern
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(trimmedEmail);
};
