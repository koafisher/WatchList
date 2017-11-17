var express = require('express');
var mongoose = require('mongoose');
var router = express.Router();
var Playlist = mongoose.model('Playlist');

router.get('/playlists', function(req, res, next) {
           Playlist.find(function(err, playlists){
                         console.log(playlists);
                        if(err){ return next(err); }
                        res.json(playlists);
                        });
});

router.post('/playlists', function(req, res, next) {
            var playlist = new Playlist(req.body);
            playlist.save(function(err, playlist){
                         if(err){ return next(err); }
                         res.json(playlist);
                         });
});

router.param('playlist', function(req, res, next, id) {
             var query = Playlist.findById(id);
             query.exec(function (err, playlist){
                        if (err) { return next(err); }
                        if (!playlist) { return next(new Error("can't find playlist")); }
                        req.playlist = playlist;
                        return next();
                        });
});

router.get('/playlists/:playlist', function(req, res) {
           res.json(req.playlist);
});

router.get('http://www.omdbapi.com/?apikey=9bcfe30a&?t=' + req.movie, function(req, res) {
           res.sendStatus(200);
           
});

router.put('/playlists/:playlist/upvote', function(req, res, next) {
           req.playlist.upvote(function(err, playlist){
                              if (err) { return next(err); }
                              res.json(playlist);
                              });
});

router.delete('/playlists/:playlist', function(req, res) {
              console.log("in Delete");
              req.playlist.remove();
              res.sendStatus(200);
});

module.exports = router;
