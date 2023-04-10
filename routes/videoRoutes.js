//Express & router
const express = require('express');
const router = express.Router();

const mongoose = require('mongoose');

//-------------------------------------------------------------------

//Models
const Video = require('../models/video');

//-------------------------------------------------------------------

//routes

router.get("/metadata", (req, res) => {
    return res.status(200).send({
        "msg": "No video ID was provided. To use this feature, please provide a valid video ID."
    });
});
router.get("/metadata/:videoId", async (req, res) => {
    
    //If the provided ID is not a valid ObjectId, return an error
    if (!mongoose.Types.ObjectId.isValid(req.params.videoId)) {
        return res.status(400).send({
            "error": "Invalid video ID!"
        });
    }

    //Check if a video exists with the provided ID
    let video = await Video.findById(req.params.videoId);

    //If the video does not exist, return an error
    if (!video) {
        return res.status(400).send({
            "error": "A video with that ID does not exist!"
        });
    }

    //Return the video metadata
    return res.status(200).send({
        video
    });
});

router.get("/file", (req, res) => {
    return res.status(200).send({
        "msg": "No video file ID was provided. To use this feature, please provide a valid video file ID."
    });
});

router.get("/file/:videoId", async (req, res) => {

    //If the provided ID is not a valid ObjectId, return an error
    if (!mongoose.Types.ObjectId.isValid(req.params.videoId)) {
        return res.status(400).send({
            "error": "Invalid video ID!"
        });
    }

    //Check if a video exists with the provided ID
    let video = await Video.findById(req.params.videoId);

    //If the video does not exist, return an error
    if (!video) {
        return res.status(400).send({
            "error": "A video with that ID does not exist!"
        });
    }

    //Stream video file
    
    return res.status(200).send({
        "msg": "OK"
    });

});

//-------------------------------------------------------------------

module.exports = router;