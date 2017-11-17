var mongoose = require('mongoose');
/*var MovieSchema = new mongoose.Schema({
                                        movietitle: String,
                                        });
mongoose.model('Movie', MovieSchema);*/
var PlaylistSchema = new mongoose.Schema({
                                         title: String,
                                         upvotes: Number,
                                         movies: [{movietitle: String}],
                                      });

PlaylistSchema.methods.upvote = function(cb) {
    this.upvotes += 1;
    this.save(cb);
};

mongoose.model('Playlist', PlaylistSchema);
