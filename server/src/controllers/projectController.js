const AWS = require('aws-sdk');
const { getProjectModel } = require('../database');
const { getRewardModel } = require('../database');

/**
 * Filter Body
 * @param req the HTTP Request object
 * @returns {Object} An object with only the parameters we need from the request body
 */
const filterBody = (req) => {
  return {
    title: req.body.title,
    creator: req.body.creator,
    subtitle: req.body.subtitle,
    category: req.body.category,
    subcategory: req.body.subcategory,
    location: req.body.location,
    heroImage: req.body.heroImage,
    heroVideo: req.body.heroVideo,
    launchDate: req.body.launchDate,
    campaignDuration: req.body.campaignDuration,
    budget: req.body.budget,
    fundingGoal: req.body.fundingGoal
  };
};

/**
 * Get Search Query
 * @param req The HTTP Request object
 * @returns {{}} A query object containing either the id or title of a project - depending on
 * which was provided in the request.
 */
const getSearchQuery = (req) => {
  const searchQuery = {};
  if (req.id) {
    searchQuery.id = req.id;
  }

  if (req.name) {
    searchQuery.title = req.name;
  }

  return searchQuery;
};

/**
 * Get Image
 * @param id The id of the project to fetch the user for
 * @returns {Promise<PromiseResult<S3.GetObjectOutput, AWSError>>}
 */
const getImage = (id) => {
  const s3 = new AWS.S3();
  return s3
    .getObject({
      Bucket: 'fec-zayers-reward-service',
      Key: `${id}.png`
    })
    .promise();
};

/**
 * Get User Image
 * @param req The HTTP Request Object
 * @param res The HTTP Response Object
 */
module.exports.getUserImage = (req, res) => {
  getImage(req.id)
    .then((image) => {
      const buf = Buffer.from(image.Body);
      const base64 = buf.toString('base64');
      const html = `<img src="data:image/jpeg;base64,${base64}" alt="user avatar"/>`;
      res.status(200).send(html);
    })
    .catch((err) => res.status(400).send(err));
};

/**
 * Get All Projects
 * @param req The HTTP Request Object
 * @param res The HTTP Response Object
 */
module.exports.getAllProjects = (req, res) => {
  const ProjectModel = getProjectModel();
  const rewardModel = getRewardModel();

  ProjectModel.findAll({
    include: [
      {
        model: rewardModel
      }
    ]
  })
    .then((projects) => {
      res.status(200).json(projects);
    })
    .catch((err) => {
      res.status(400).send(err);
    });
};

/**
 * Get One Project
 * @param req The HTTP Request Object
 * @param res The HTTP Response Object
 */
module.exports.getOneProject = (req, res) => {
  const ProjectModel = getProjectModel();
  const rewardModel = getRewardModel();
  const searchQuery = getSearchQuery(req);
  ProjectModel.findAll({
    where: searchQuery,
    include: [
      {
        model: rewardModel
      }
    ]
  })
    .then((projects) => {
      res.status(200).json(projects);
    })
    .catch((err) => {
      res.status(400).json(err);
    });
};

/**
 * Create One Project
 * @param req The HTTP Request Object
 * @param res The HTTP Response Object
 */
module.exports.createOneProject = (req, res) => {
  const ProjectModel = getProjectModel();
  ProjectModel.sync({ force: false })
    .then(() => {
      return ProjectModel.create(filterBody(req));
    })
    .then((project) => {
      res.status(200).send(project);
    })
    .catch((err) => {
      res.status(400).send(err);
    });
};

/**
 * Update One Project
 * @param req The HTTP Request Object
 * @param res The HTTP Response Object
 */
module.exports.updateOneProject = (req, res) => {
  const ProjectModel = getProjectModel();
  const searchQuery = getSearchQuery(req);
  const params = filterBody(req);
  ProjectModel.update(params, { where: searchQuery }).then(() => {
    res.status(200).json(params);
  });

  // Errors from 'update' don't seem to be sent to the catch block - even if the database is closed.
};

/**
 * Delete One Project
 * @param req The HTTP Request Object
 * @param res The HTTP Response Object
 */
module.exports.deleteOneProject = (req, res) => {
  const ProjectModel = getProjectModel();
  const searchQuery = getSearchQuery(req);
  ProjectModel.destroy({ where: searchQuery })
    .then(() => {
      res.status(200).json(searchQuery);
    })
    .catch((err) => {
      res.status(400).send(err);
    });
};
