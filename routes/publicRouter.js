<<<<<<< HEAD
const express = require('express');
const CustomError = require('../errors/custom-error');
const Link = require('../models/links');

const router = express.Router();

router.get('/:id', async (req, res) => {
    const urlId = req.params.id;
    const urlData = await Link.findOne({ urlId })
    if (!urlData) 
        throw new CustomError('Invalid Url, Please check your URL', 404)
    
    res.status(302).redirect(urlData.originalUrl);
=======
const express = require("express");
const { StatusCodes } = require("http-status-codes");
const { container } = require("../container");
const router = express.Router();

router.get("/:id", async (req, res) => {
  const urlId = req.params.id;
  const linkService = container.getLinkService();

  const { destination } = await linkService.resolveAndIncrementClick(urlId);
>>>>>>> main

  return res.status(StatusCodes.MOVED_TEMPORARILY).redirect(destination);
});

module.exports = router;