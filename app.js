//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

mongoose.set('strictQuery', true);

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/wikidb", {
  useNewUrlParser: true
});

const articleSchema = {
    title: String,
    content: String
};
  
const Article = mongoose.model("Article", articleSchema);

//TODO
app.route("/articles")

.get(function(req,res){
    Article.find(function(err, foundArticles){
        if(!err){
            //console.log(foundArticles);
            res.send(foundArticles);
        }else{
            res.send(err);
        }
    });
})

.post(function(req,res){
    // console.log(req.body.title);
    // console.log(req.body.content);

    const newArticle = new Article({
        title : req.body.title,
        content : req.body.content
    });

    newArticle.save(function(err){
        if(!err){
            res.send("successfully added new article");
        }else{
            res.send(err);
        }
    });
})

.delete(function(req,res){
    Article.deleteMany(function(err){
        if(!err){
            res.send("successfully deleted all articles");
        }else{
            res.send(err);
        }
    });
});

//target specific articles

app.route("/articles/:articleTitle")

.get(function(req, res){
    const articleTitle = req.params.articleTitle;
    Article.findOne({title: articleTitle}, function(err, article){
      if (article){
        //const jsonArticle = JSON.stringify(article);
        res.send(article);
      } else {
        res.send("No article with that title found.");
      }
    });
  })

.put(function(req,res){
    Article.findOneAndUpdate(
        {title: req.params.articleTitle},
        {
            title: req.body.title, 
            content: req.body.content
        },
        {overwrite: true},
        function(err){
            if(!err){
                res.send("update succesfully");
            }else{
                res.send(err);
            }

        }
    )
})

.patch(function(req,res){
    Article.findOneAndUpdate(
        {title: req.params.articleTitle},
        {$set : req.body},
        function(err){
            if(!err){
                res.send("succesfully updated");
            }else{
                res.send(err);
            }
        }
    );
})

.delete(function(req,res){
    Article.findOneAndDelete(
        {title: req.params.articleTitle},
        function(err){
            if(!err){
                res.send("succesfully deleted");
            }else{
                res.send(err);
            }
        }
    );
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});