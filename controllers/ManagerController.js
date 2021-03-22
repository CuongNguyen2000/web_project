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
            .then((article) => {
              demo["rejectArticle"] = article;
              Article.find({ faculty_id: faculty._id, status: true })
                .exec()
                .then((article) => {
                  demo["acceptArticle"] = article;
                  res.render("managerViews/manager_detail_statistic", {
                    info: info,
                    faculty: faculty,
                    demo: demo,
                  });
                });
            });
        });
    });
};

const downloadFile = (req, res, next) => {
  var a = req.body.check;
  if (!a) {
    res.send(
      '<script>alert("You need to choose at least one file to download")</script>'
    );
  } else {
    var output = fs.createWriteStream("public/fileDownload.zip");
    var archive = archiver("zip");
    output.on("close", () => {
      console.log(archive.pointer() + " total bytes");
      console.log(
        "Archiver has been finalized and the output file descriptor has closed"
      );
    });
    archive.on("error", (err) => {
      throw err;
    });

    archive.pipe(output);
    for (var n = 1; n < a.length; n++) {
      var file = "public/uploads/" + a[n];
      archive.append(fs.createReadStream(file), { name: file });
    }
    archive.finalize();
    res.redirect("/managers/downloadFile");
  }
};

module.exports = {
  GetManagerHome,
  getListArticles_manager,
  getStatistics_manager,
  getDetailStatistics,
  downloadFile,
};
