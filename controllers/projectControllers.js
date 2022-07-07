const Project = require("../models/project");
const BigPromise = require("../middlewares/bigPromise");
const cloudinary = require("cloudinary").v2;
const customError = require("../utils/customErrors");

exports.getAllProjects = BigPromise(async (req, res, next) => {
    const projects = await Project.find();

  res.status(200).json({
    success: true,
    projects,
  });
});

exports.getOneProject = BigPromise(async (req, res, next) => {
  const project = await Project.findById(req.params.id);
  if (!project) {
    return next(new customError("No Project found with this id", 404));
  }
  res.status(200).json({
    success: true,
    project,
  });
});

exports.addAndUpdateReview = BigPromise(async (req, res, next) => {
  const { rating, comment, projectId } = req.body;
  const review = {
    user: req.user._id,
    name: req.user.name,
    rating: Number(rating),
    comment,
  };
  const project = await Project.findById(projectId);
  const alreadyReviewed = project.reviews.find(
    // Run for every review in project db
    // rev.user is objectId stored in DB which we are converting into sting as it was `bson()` format.
    (rev) => rev.user.toString() === req.user._id.toString()
  );
  // user already review then `if` part will run as "alreadyReviewed" will not be null.
  if (alreadyReviewed) {
    project.reviews.forEach((reviews) => {
      if (reviews.user.toString() === req.user._id.toString()) {
        (reviews.comment = comment), (reviews.rating = rating);
      }
    });
  } else {
    project.reviews.push(review);
  }
  //saving
  await project.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
    project,
  });
});

exports.deleteReview = BigPromise(async (req, res, next) => {
  const { projectId } = req.query;
  const project = await Project.findById(projectId);

  // filter will not pass the specific review we get by the condition and others will be returned.
  // so eventually we deleted it.
  const reviews = project.reviews.filter((rev) => {
    rev.user.toString() !== req.user._id.toString();
  });
  //Updating the reviews
  await Project.findByIdAndUpdate(
    projectId,
    {
      reviews,
    },
    {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    }
  );

  res.status(200).json({
    success: true,
    project,
  });
});

exports.getAllProjectReviews = BigPromise(async (req, res, next) => {
  const project = await Project.findById(req.params.id);
  if (!project) return next(new CustomErrors('Project not found!', 401));
  res.status(200).json({
    success: true,
    reviews: project.reviews,
  });
});

// Admin controllers
exports.addProject = BigPromise(async (req, res, next) => {
  let filesArray = [];
  console.log("req.body", req.body);
  console.log("req.files", req.files);
  if (!req.files) {
    return next(new customError("Add files too", 404));
  } else {
      const result = await cloudinary.uploader.upload(
        req.files.file.tempFilePath,
        {
          folder: "projects",
          resource_type:"auto",
        }
      );
      filesArray.push({
        id: result.public_id,
        secure_url: result.secure_url,
      });
    }
  req.body.files = filesArray; // Overwriting the files with filesArray
  req.body.user = req.user.id; // added user property from req.user.id which we are getting from loggedInUser
  const project = await Project.create(req.body);

  res.status(200).json({
    success: true,
    project,
  });
});

exports.getStudentAllProjects = BigPromise(async (req, res, next) => {
  const allProjects = await Project.find().populate("user", "name email");
  let Projects = allProjects;
  if (req.user.role === 'user') {
    Projects = allProjects.filter(
      (project) => req.user.id.toString() === project.user._id.toString()
    );
  }
  res.status(200).json({
    success: true,
    user: req.user,
    Projects,
  });
});

exports.updateProjectAdmin = BigPromise(async (req, res, next) => {
  let project = await Project.findById(req.params.id);
  if (!project) {
    return next(new customError("No Project found with this id", 404));
  }

  const newData = {
    name: req.body.name,
    files: [],
  };
  if (!newData.name && newData.price && newData.stock && newData.files)
    return next(new customError("Provide detail to update", 400));

  if (req.files) {
    for (let index = 0; index < project.files.length; index++) {
      // delete existing files from cloudinary
      const result = await cloudinary.uploader.destroy(
        project.files[index].id
      );
    }
    for (let index = 0; index < req.files.files.length; index++) {
      // uploaded new files updated by user
      const filesUpload = await cloudinary.uploader.upload(
        req.files.files[index].tempFilePath,
        {
          folder: "projects",
        }
      );
      newData.files.push({
        id: filesUpload[index].public_id,
        secure_url: filesUpload[index].secure_url,
      });
    }
  }
  project = await Project.findByIdAndUpdate(req.params.id, newData, {
    new: true,
    runValidators: true,
    useFindAndModify: false, // For precautions, we turned off the 'useFindAndModify' as it is not needed
  });
  res.status(200).json({
    success: true,
    project,
  });
});

exports.deleteProjectAdmin = BigPromise(async (req, res, next) => {
  const project = await Project.findById(req.params.id);
  if (!project) return next(new customError("Project doesn't exist", 404));

  for (let index = 0; index < project.files.length; index++) {
    // deleting projects existing files from cloudinary
    const result = await cloudinary.uploader.destroy(project.files[index].id);
  }

  await project.remove();

  res.status(200).json({
    success: true,
  });
});
