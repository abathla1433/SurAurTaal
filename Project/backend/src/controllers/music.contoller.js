const musicModel = require("../models/music.model");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const albumModel=require("../models/album.model");

const uploadFile = require("../services/storage.services");

async function createMusic(req, res) {


    // 📦 Main logic block
    try {
        const {title} = req.body;
        const file = req.file;


        if (!file) {
            return res.status(400).json({
                message: "Music file is required"
            });
        }

        const result = await uploadFile(file.buffer.toString("base64"));

        const music = await musicModel.create({
            title,
            uri: result.url,
            artist: req.user.id
        });

        return res.status(201).json({
            message: "Music created successfully",
            music: {
                id: music._id,
                title: music.title,
                uri: music.uri,
                artist: music.artist
            }
        });

    } catch (err) {
        return res.status(500).json({
            message: "Failed to upload music",
            error: err.message
        });
    }
}

async function createAlbum(req,res){
    try{
        const {title,musics}=req.body;
        const album = await albumModel.create({
            title,
            musics:musics,
            artist:req.user.id
        });
        res.status(201).json({
            "message":"album creeated successfully",
            album:{
                id:album._id,
                title:album.title,
                musics:album.musics,
                artist:album.artist
            }
        });

    }catch(err){
        return res.status(500).json({
            message:"Failed to create album",
            error:err.message
        });
    }

}

async function getAllMusics(req,res){
    try{
        const musics=await musicModel.find().populate("artist","username role email");
        res.status(200).json({
            "message":"musics fetched successfully",
            musics:musics
        })
    }catch(err){

    }
}

async function getAllAlbums(req,res){
    try{
        const albums=await albumModel.find().select("title artist").populate("artist","username email");
        res.status(200).json({
            "message":"albums fetched successfully",
            albums:albums
        })
    }catch(err){
        return res.status(500).json({
            "message":"Failed to fetch albums"
        })
    }
}

async function getAlbumById(req,res){
    try{
        const {id}=req.params;
        const album=await albumModel.findById(id);
        if(!album){
            return res.status(404).json({
                "message":"album not found"
            });
        }
        res.status(200).json({
            "message":"album fetched successfully",
            "album":album
        })
    }catch(err){
        return res.status(500).json({
            "message":"Failed to fetch album"
        })
    }
}

module.exports = { createMusic, createAlbum,getAllMusics,getAllAlbums, getAlbumById };   