//Express & router
const express = require('express');
const router = express.Router();

const mongoose = require('mongoose');

//-------------------------------------------------------------------

//Models
const Video = require('../models/video');

//-------------------------------------------------------------------

//Libraries
const path = require("path");
const fs = require("fs");

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

    //Video Streaming logic - stream the file

    //Get range from request header
    const range = req.headers.range; //Indicates the part of the content the response should return

    //If the range is invalid, return an error
    if (!range) {
        return res.status(400).send({
            "error": "Invalid range header!"
        });
    }

    //Get video file path and size
    const videoPath = path.join(process.env.CONTENT_DIRECTORY, video.file.filename);
    const videoSize = fs.statSync(videoPath).size;

    //Define chunk size and content start/end
    const chunkSize = process.env.VIDEO_CHUNK_SIZE || 1 * 1e+6; //Use specified size, otherwise, use 1MB
    const start = Number(range.replace(/\D/g, '')); //Delete all non-digits from range header - may not be safe?
    const end = Math.min(start + chunkSize, videoSize - 1); //If you finished the video, you would be oob when you add chunkSize. Therefore, serve only up until the end of the file.

    const contentLength = end - start + 1; //Define the content length header

    //Define headers
    const headers = {
        "Content-Range": `bytes ${start}-${end}/${videoSize}`,
        "Accept-Ranges": "bytes",
        "Content-Length": contentLength,
        "Content-Type": "video/mp4"
    };

    // //Debug
    // console.log({
    //     range,
    //     headers
    // });

    //Write headers to the response
    //206 indicating partial content
    res.writeHead(206, headers);

    //Define video file stream and pipe it into the response
    const videoFileSteam = fs.createReadStream(videoPath, {start, end});
    videoFileSteam.pipe(res);

});

//-------------------------------------------------------------------

module.exports = router;