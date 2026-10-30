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
};

// Update an existing link
const updateLink = async (req, res) => {
  const { id } = req.params;
  const link = await updateLinkMethod(id, req.user.id, req.body);

  return sendSuccess(res, {
    message: "Link updated successfully",
    data: link,
    extra: {
      link,
    },
  });
};

// Delete a link
const removeLink = async (req, res) => {
  const { id } = req.params;
  const link = await removeLinkMethod(id, req.user.id);

  return sendSuccess(res, {
    message: "Link removed successfully",
    data: link,
    extra: {
      link,
      msg: "Link removed successfully",
    },
  });
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
};
