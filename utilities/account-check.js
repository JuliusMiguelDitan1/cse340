const jwt = require("jsonwebtoken");

const checkEmployeeOrAdmin = (req, res, next) => {
  const token = req.cookies.jwt;

  if (!token) {
    req.flash("error", "You must be logged in to access that page.");
    return res.status(401).render("account/login", { title: "Login", errors: req.flash() });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.account_type === "Employee" || decoded.account_type === "Admin") {
      res.locals.accountData = decoded;
      return next();
    } else {
      req.flash("error", "You do not have permission to access that page.");
      return res.status(403).render("account/login", { title: "Login", errors: req.flash() });
    }
  } catch (err) {
    req.flash("error", "Authentication failed. Please log in again.");
    return res.status(403).render("account/login", { title: "Login", errors: req.flash() });
  }
};

module.exports = { checkEmployeeOrAdmin };
