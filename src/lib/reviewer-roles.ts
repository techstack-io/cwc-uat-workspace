export const adminEmail = "dan.collins@clarkwire.com";
export const shaneEmail = "shane.collins@clarkwire.com";
export const mikeEmail = "mike.guidry@clarkwire.com";

export function canReview(email: string) {
  return email === adminEmail || email === mikeEmail;
}
