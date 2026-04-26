const express=require("express");
const router=express.Router();
const musicController=require("../controllers/music.contoller");

const multer=require("multer");

const authMiddleware=require("../middlewares/auth.middleware");

const upload=multer({
    storage:multer.memoryStorage(),
})

const uploadFile = require("../services/storage.services");
//create music
router.post("/upload",authMiddleware.authArtist,upload.single("file"),musicController.createMusic);

//create album
router.post("/album",authMiddleware.authArtist,musicController.createAlbum);

//get all music
router.get("/",authMiddleware.authUser,musicController.getAllMusics);


//get all albums
router.get("/albums",authMiddleware.authUser,musicController.getAllAlbums);

//get album by id
router.get("/album/:id",authMiddleware.authUser,musicController.getAlbumById);

module.exports=router;