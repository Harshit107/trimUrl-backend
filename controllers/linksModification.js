<<<<<<< HEAD
require("dotenv").config();
const Links = require("../models/links");
const CustomError = require("../errors/custom-error");
const ShortUniqueId = require("short-unique-id");
const isValidURL = require("../modules/validation");
const { handleCreateNewLink } = require('../controllers/linksHandler.js')
const { StatusCodes } = require("http-status-codes");
const UsersData = require("../models/user");




// Get all the links objects
const getLinks = async (req, res) => {
  const user = await UsersData.findById(req.user._id)
    .populate("MyLinks")
    .exec();
  res.status(StatusCodes.OK).json({ message: user.MyLinks });
};

/* -------------------------------------------------------------------------- */
/*                             Create a new entry                           */
/* -------------------------------------------------------------------------- */


const createLink = async (req, res) => {

  const dataToCreateLink = await handleCreateNewLink(req);
  dataToCreateLink.user_id = req.user._id;
  const entry = await Links.create(dataToCreateLink);

  if (!entry)
    throw new CustomError(
      "Could not create the entry. Please try again later",
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  res.status(StatusCodes.CREATED).json({ message: entry });

=======
const { container } = require("../container");
const { sendSuccess, sendCreated, sendList } = require("../utils/response");

// ============================================================================
// Decoupled Business Methods (Can be called by ANY route, microservice, or script)
// ============================================================================

/**
 * Core business method to create a short link for any user
 * @param {string} userId - ID of the user creating the link
 * @param {Object} data - { originalUrl, urlId, shortLink }
 */
const createShortLinkMethod = async (userId, data) => {
  const linkService = container.getLinkService();
  return await linkService.createLink(userId, data);
};

/**
 * Core business method to get all links for any user
 * @param {string} userId
 * @param {Object} [options]
 */
const getUserLinksMethod = async (userId, options = {}) => {
  const linkService = container.getLinkService();
  return await linkService.getUserLinks(userId, options);
};

/**
 * Core business method to get a single link
 * @param {string} id - Link UUID
 * @param {string} userId
 */
const getSingleLinkMethod = async (id, userId) => {
  const linkService = container.getLinkService();
  return await linkService.getLinkById(id, userId);
};

/**
 * Core business method to update an existing short link
 * @param {string} id - Link UUID
 * @param {string} userId
 * @param {Object} data - Update payload
 */
const updateLinkMethod = async (id, userId, data) => {
  const linkService = container.getLinkService();
  return await linkService.updateLink(id, userId, data);
};

/**
 * Core business method to delete a link
 * @param {string} id - Link UUID
 * @param {string} userId
 */
const removeLinkMethod = async (id, userId) => {
  const linkService = container.getLinkService();
  return await linkService.deleteLink(id, userId);
};

// ============================================================================
// HTTP Controller Handlers (Thin adapters over the business methods)
// ============================================================================

// Get all links for the authenticated user (sorted newest first)
const getLinks = async (req, res) => {
  const result = await getUserLinksMethod(req.user.id);

  return sendList(res, {
    items: result.links,
    message: "User links retrieved successfully",
    extra: {
      links: result.links,
      count: result.count,
    },
  });
};

// Get a single link by ID
const getSingleLink = async (req, res) => {
  const { id } = req.params;
  const link = await getSingleLinkMethod(id, req.user.id);

  return sendSuccess(res, {
    message: "Link details retrieved successfully",
    data: link,
    extra: {
      link,
    },
  });
};

// Create a new short link (supports auto-generated ID or custom alias)
const createLink = async (req, res) => {
  const link = await createShortLinkMethod(req.user.id, req.body);

  return sendCreated(res, {
    message: "Short link created successfully",
    data: link,
    extra: {
      link,
    },
  });
>>>>>>> main
};

// Update an existing link
const updateLink = async (req, res) => {
  const { id } = req.params;
  const link = await updateLinkMethod(id, req.user.id, req.body);

<<<<<<< HEAD
  if (!urlId || !newUrl)
    throw new CustomError(
      "Data entry incomplete. Please enter complete data. ",
      StatusCodes.BAD_REQUEST
    );

  if (!isValidURL(newUrl))
    throw new CustomError("Please enter valid URL", StatusCodes.BAD_REQUEST);

  let urlObj = await Links.findOneAndUpdate(
    { urlId: urlId },
    { originalUrl: newUrl },
    { new: true, runValidators: true }
  );

  if (!urlObj)
    throw new CustomError(
      `Could not update the entry with the id ${urlId}. Please try again later!`,
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  res.status(StatusCodes.OK).json({ message: urlObj });
};

// Update the existing url with new data
const updateUrlId = async (req, res) => {
  const urlId = req.body.urlId;
  const newUrlId = req.body.newUrlId;

  if (!urlId || !newUrlId)
    throw new CustomError(
      "Data entry incomplete. Please enter complete data. ",
      StatusCodes.BAD_REQUEST
    );

  const isUrlExist = await Links.findOne({ urlId: newUrlId });
  console.log(isUrlExist);
  if (isUrlExist)
    throw new CustomError(`URL Id already exists.`, StatusCodes.BAD_REQUEST);

  let urlObj = await Links.findOneAndUpdate(
    { urlId },
    { urlId: newUrlId },
    { new: true, runValidators: true }
  );

  if (!urlObj)
    throw new CustomError(
      `Could not update the entry with the id ${urlId}. Please try again later!`,
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  res.status(StatusCodes.OK).json({ message: urlObj });
};

// Lookup and delete the entry corresponding to the requested object Id.
=======
  return sendSuccess(res, {
    message: "Link updated successfully",
    data: link,
    extra: {
      link,
    },
  });
};

// Delete a link
>>>>>>> main
const removeLink = async (req, res) => {
  const { id } = req.params;
  const link = await removeLinkMethod(id, req.user.id);

<<<<<<< HEAD
  if (!urlId)
    throw new CustomError(
      "No url Id entered. Please enter an id. ",
      StatusCodes.BAD_REQUEST
    );

  const urlObj = await Links.findOneAndDelete({ urlId });
  if (!urlObj)
    throw new CustomError(
      `Could not delete the entry with the id ${urlId}. Please try again later. `,
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  res
    .status(StatusCodes.ACCEPTED)
    .json({
      message:
        `Removed the entry with original url ${urlObj.originalUrl} and short url ${urlObj.shortenedUrl}}`
    });
=======
  return sendSuccess(res, {
    message: "Link removed successfully",
    data: link,
    extra: {
      link,
      msg: "Link removed successfully",
    },
  });
>>>>>>> main
};

module.exports = {
  // Decoupled service methods
  createShortLinkMethod,
  getUserLinksMethod,
  getSingleLinkMethod,
  updateLinkMethod,
  removeLinkMethod,

  // HTTP Controllers
  getLinks,
  getSingleLink,
  createLink,
  updateLink,
  removeLink,
<<<<<<< HEAD
  updateUrlId,
=======
>>>>>>> main
};
