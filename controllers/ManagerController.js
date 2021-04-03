var AppUser = require("../models/AppUserModel");
var Manager = require("../models/ManagerModel");
var Article = require("../models/ArticlesModel");
var Faculty = require("../models/FacultyModel");
var fs = require("fs");
const archiver = require("archiver");

const GetManagerHome = (req, res, next) => {
  Manager.findOne({ account_id: req.session.userId })
    .exec()
    .then((info) => {
      console.log(info);
      AppUser.findOne({ _id: req.session.userId })
        .exec()
        .then((user) => {
          res.render("managerViews/manager_home", {
            title: "Manager's Homepage",
            data: {
              user: user,
              info: info,
            },
          });
        })
        .catch((err) => {
          res.send(err);
        });
    })
    .catch((err) => {
      res.send(err);
    });
};

const getUpdateAccount = (req, res, next) => {
  let user = {};
  const _id = req.params.id;
  const { msg } = req.query;

  AppUser.findOne({ _id: _id })
    .exec()
    .then((value) => {
      user = {
        _id: _id,
        username: value.username,
      };
      Manager.findOne({ account_id: _id })
        .exec()
        .then((info) => {
          res.render("managerViews/update_account", {
            err: msg,
            title: "Change password",
            data: {
              _id: _id,
              info: info,
              user: user,
            },
          });
        })
        .catch((err) => {
          console.log(err);
          res.redirect("/managers/home");
        });
    })
    .catch((err) => {
      console.log(err);
      res.redirect("/managers/home");
    });
};

const updateAccount = async (req, res, next) => {
  const { pwd, _id } = req.body;
  const newValue = {};
  if (pwd) newValue.password = pwd;

  await AppUser.findOne({ _id: _id }).exec(async (err, user) => {
    if (err) {
      return console.log(err);
    } else if (pwd.length < 4) {
      const msg = "Password must be at least 4 characters !!!";
      return res.redirect(`/managers/update_account/${_id}?msg=${msg}`);
    } else {
      AppUser.findOneAndUpdate(
        { _id: _id },
        { $set: newValue },
        { new: true },
        (err, data) => {
          if (err) {
            console.log(err);
            return res.render("managerViews/update_account");
          } else {
            console.log(data);
            return res.redirect("/managers/home");
          }
        }
      );
    }
  });
};

const getListArticles_manager = (req, res, next) => {
  const _id = req.query.faculty_id;
  let query = {};
  if (_id) {
    query.faculty_id = _id;
  }
  Manager.findOne({ account_id: req.session.userId })
    .exec()
    .then((info) => {
      Faculty.find({})
        .exec()
        .then((faculty) => {
          Article.find({ ...query })
            .populate("topic_id")
            .populate("faculty_id")
            .populate("author")
            .exec((err, items) => {
              if (err) {
                console.log(err);
                res.status(500).send("An error occurred", err);
              } else {
                console.log(items);
                res.render("managerViews/manager_list_articles", {
                  title: "List of Student's Articles",
                  faculty: faculty,
                  items: items,
                  info: info,
                });
              }
            });
        });
    });
};

const getStatistics_manager = (req, res, next) => {
  Manager.findOne({ account_id: req.session.userId })
    .exec()
    .then((info) => {
      Faculty.find({})
        .populate("amountArticle")
        .exec()
        .then((faculties) => {
          res.render("managerViews/manager_statistics", {
            title: "Dashboard to view statistics",
            info: info,
            faculty: faculties,
          });
        });
    });
};

const getDetailStatistics = (req, res, next) => {
  const _id = req.params.id;
  let demo = {};
  Manager.findOne({ account_id: req.session.userId })
    .exec()
    .then((info) => {
      Faculty.findOne({ _id: _id })
        .exec()
        .then((faculty) => {
          Article.find({ faculty_id: faculty._id, status: false })
            .populate("topic_id")
            .populate("author")
            .exec()
            .then((rejectArticle) => {
              demo["rejectArticle"] = rejectArticle;
              Article.find({ faculty_id: faculty._id, status: true })
                .populate("topic_id")
                .populate("author")
                .exec()
                .then((acceptArticle) => {
                  demo["acceptArticle"] = acceptArticle;
                  Article.find({
                    faculty_id: faculty._id,
                    comments: { $exists: true, $ne: [] },
                  })
                    .populate("topic_id")
                    .populate("author")
                    .exec()
                    .then((article_commentExist) => {
                      demo["commentExist"] = article_commentExist;
                      Article.find({
                        faculty_id: faculty._id,
                        comments: { $exists: true, $size: 0 },
                      })
                        .populate("topic_id")
                        .populate("author")
                        .exec()
                        .then((article_noComment) => {
                          demo["noComment"] = article_noComment;
                          // console.log(demo);
                          res.render("managerViews/manager_detail_statistic", {
                            title: "Details of statistics",
                            info: info,
                            faculty: faculty,
                            demo: demo,
                          });
                        });
                    });
                });
            });
        });
    });
};

const downloadFile = async (req, res, next) => {
  var a = req.body.check;
  if (!a) {
    res.send(
      '<script>alert("You need to choose at least one file to download")</script>',
    );
  } else {
    var output = fs.createWriteStream("./public/fileDownload.zip");
    var archive = archiver("zip", {
      zlib: { level: 9 },
    });

    // listen for all archive data to be written
    // 'close' event is fired only when a file descriptor is involved
    output.on("close", () => {
      console.log(archive.pointer() + " total bytes");
      console.log(
        "Archiver has been finalized and the output file descriptor has closed"
      );
    });
    output.on("end", function () {
      console.log("Data has been drained");
    });
    archive.on("error", (err) => {
      throw err;
    });

    archive.pipe(output);
    for (var i = 1; i < a.length; i++) {
      var file = "public/uploads/" + a[i];
      console.log("file name: ", file);
      archive.append(fs.createReadStream(file), { name: a[i] });
    }
    await archive.finalize();
    res.redirect("/managers/downloadFile");
  }
};

module.exports = {
  GetManagerHome,
  getUpdateAccount,
  updateAccount,
  getListArticles_manager,
  getStatistics_manager,
  getDetailStatistics,
  downloadFile,
};
