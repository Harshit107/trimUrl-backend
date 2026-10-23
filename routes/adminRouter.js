const express = require("express");
const adminAuthMiddleware = require("../middleware/adminAuthMiddleware");
const {
  createShortLinkMethod,
  getUserLinksMethod,
  getSingleLinkMethod,
  updateLinkMethod,
  removeLinkMethod,
} = require("../controllers/linksModification");
const { sendSuccess, sendCreated, sendList } = require("../utils/response");

const router = express.Router();

// Apply Super Admin / Ecosystem API Key protection to all admin routes
router.use(adminAuthMiddleware);

/**
 * @route   GET /api/v1/admin/links
 * @desc    Get all short links created under the Super Admin account
 * @access  Protected by ADMIN_API_KEY
 */
router.get("/", async (req, res) => {
  const targetUserId = req.query.userId || req.user.id;
  const result = await getUserLinksMethod(targetUserId);

  return sendList(res, {
    items: result.links,
    message: "Admin links retrieved successfully",
    extra: {
      links: result.links,
      count: result.count,
      adminUser: req.user.email,
    },
  });
});

/**
 * @route   POST /api/v1/admin/links
 * @desc    Create a short link headless from any application without user login
 * @access  Protected by ADMIN_API_KEY
 */
router.post("/", async (req, res) => {
  // Can create for the default Super Admin, or optionally for a specific userId if provided
  const targetUserId = req.body.userId || req.user.id;
  const link = await createShortLinkMethod(targetUserId, req.body);

  return sendCreated(res, {
    message: "Short link created successfully via Super Admin API",
    data: link,
    extra: {
      link,
      creator: req.user.email,
    },
  });
});

/**
 * @route   GET /api/v1/admin/links/:id
 * @desc    Get single link details by link ID
 * @access  Protected by ADMIN_API_KEY
 */
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  const targetUserId = req.query.userId || req.user.id;
  const link = await getSingleLinkMethod(id, targetUserId);

  return sendSuccess(res, {
    message: "Link details retrieved successfully",
    data: link,
    extra: {
      link,
    },
  });
});

/**
 * @route   PATCH /api/v1/admin/links/:id
 * @desc    Update a short link
 * @access  Protected by ADMIN_API_KEY
 */
router.patch("/:id", async (req, res) => {
  const { id } = req.params;
  const targetUserId = req.body.userId || req.user.id;
  const link = await updateLinkMethod(id, targetUserId, req.body);

  return sendSuccess(res, {
    message: "Link updated successfully via Super Admin API",
    data: link,
    extra: {
      link,
    },
  });
});

/**
 * @route   DELETE /api/v1/admin/links/:id
 * @desc    Delete a short link
 * @access  Protected by ADMIN_API_KEY
 */
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  const targetUserId = req.query.userId || req.user.id;
  const link = await removeLinkMethod(id, targetUserId);

  return sendSuccess(res, {
    message: "Link deleted successfully via Super Admin API",
    data: link,
    extra: {
      link,
      msg: "Link deleted successfully",
    },
  });
});

module.exports = router;
