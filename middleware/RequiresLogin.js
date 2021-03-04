const isAdmin = (req, res, next) => {
  if (req.session && req.session.isAdmin === true && req.session.userId) {
    return next();
  } else {
    const msg =
      "You must be logged in with admin permission to view this page.";
    return res.redirect(`/users/login?msg=${msg}`);
  }
};

const isCoordinator = (req, res, next) => {
  if (req.session && req.session.isCoordinator === true && req.session.userId) {
    return next();
  } else {
    const msg =
      "You must be logged in with Marketing Coordinator permission to view this page.";
    return res.redirect(`/users/login?msg=${msg}`);
  }
};

const isStudent = (req, res, next) => {
  if (req.session && req.session.isStudent === true && req.session.userId) {
    return next();
  } else {
    const msg =
      "You must be logged in with student permission to view this page.";
    return res.redirect(`/users/login?msg=${msg}`);
  }
};

const isManager = (req, res, next) => {
  if (req.session && req.session.isManager === true && req.session.userId) {
    return next();
  } else {
    const msg =
      "You must be logged in with Manager permission to view this page.";
    return res.redirect(`/users/login?msg=${msg}`);
  }
};

const isGuest = (req, res, next) => {
  if (req.session && req.session.isGuest === true && req.session.userId) {
    return next();
  } else {
    const msg =
      "You must be logged in with Guest permission to view this page.";
    return res.redirect(`/users/login?msg=${msg}`);
  }
};

module.exports = { isAdmin, isCoordinator, isStudent, isManager, isGuest };
