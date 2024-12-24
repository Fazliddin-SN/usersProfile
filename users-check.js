function validationCheck(users) {
  let errors = [];
  users.map((user) => {
    if (!user.username || user.username.length < 3) {
      errors.push("username should consist of at at least 3 character");
    } else if (!user.fullname || user.fullname.length < 8) {
      errors.push("Fullname should consist of at at least 8 character");
    } else if (!user.email || !user.email.includes("@")) {
      errors.push("invalid email address");
    } else if (
      !user.gender.includes("male") ||
      user.gender.includes("female")
    ) {
      errors.push("invalid gender type");
    }
  });
  return errors;
}

module.exports = validationCheck;
