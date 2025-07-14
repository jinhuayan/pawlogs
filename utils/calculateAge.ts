export const  calculateAge = (dob: string | Date): string => {
  const birthDate = new Date(dob);
  const today = new Date();

  let years = today.getFullYear() - birthDate.getFullYear();
  let months = today.getMonth() - birthDate.getMonth();
  let days = today.getDate() - birthDate.getDate();

  if (days < 0) {
    months--;
    const prevMonth = new Date(today.getFullYear(), today.getMonth(), 0);
    days += prevMonth.getDate(); // days in previous month
  }

  if (months < 0) {
    years--;
    months += 12;
  }

  // ✅ Format output
 if (years >= 1) {
    return `${years}y${months}m`;
  } else if (months >= 1) {
    return `${months}m`;
  } else {
    return `${days}d`;
  }
};