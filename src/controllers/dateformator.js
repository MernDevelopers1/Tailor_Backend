module.exports.dateformator = (date) => {
  if (date) {
   console.log("Date:", date); // Assuming 'date' is the input date string

const dateobj = new Date(date); // Create a Date object from the input date string

const Year = dateobj.getFullYear(); // Get the full year (4 digits)
const day = dateobj.getDate(); // Get the day of the month (1-31)
const month = dateobj.getMonth() + 1; // Get the month (0-11) and add 1 to make it (1-12)

// Format the date in the desired format (dd/mm/yyyy)
const formattedDate = `${day}/${month}/${Year}`;
console.log(formattedDate);

return formattedDate; // Return the formatted date string

  }
};
