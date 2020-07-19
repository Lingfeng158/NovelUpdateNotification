/* Copyright G. Hemingway, 2020 - All rights reserved */
"use strict";

const Joi = require("@hapi/joi");
const mongoose = require("mongoose");

module.exports = app=>{

    /**
     * Create a new novel
     * @param {req.body.novel_name}: name of novel
     * @param {req.body.novel_initial_url}: original url of the novel
     * @param {req.body.novel_link}: external link to read the novel
     */
    app.post("/v1/novel", async (req, res)=>{
        if(!req.session.user){
            res.status(401).send({error:"unauthorized"});
        }else{
            let data;
            try{
                //validate user input
                let schema = Joi.object().keys({
                    novel_name: Joi.string()
                        .required(),
                    novel_initial_url: Joi.string()
                        .required(),
                    novel_link: Joi.string()
                        .required()
                });
                data = await schema.validateAsync(req.body);
            }catch (e) {
                const message = e.details[0].message;
                console.log(`Game.create validation failure: ${message}`);
                return res.status(400).send({ error: message });
            }

            try{
                let newNovel = new app.models.Novel(data);
                await newNovel.save();

                const update = {$push:{novels:newNovel._id}};
                await app.models.User.findByIdAndUpdate(req.session.user._id, update);
                res.status(200).send({id:newNovel._id});
            }catch(err){
                console.log(`new novel entry creation failed with error: ${err}`);
                res.status(401).send({error:err});
            }
        }
    });

    app.get('/v1/novel/:novelID', async (req, res)=>{
        if(!req.session.user){
            res.status(401).send({error:"Unauthorized"});
        }else{
            try{
                let novel =await app.models.Novel.findOne({_id:req.params.novelID});
                res.status(200).send(novel);
            }catch (e) {
                res.status(400).send({error:e});
            }
        }

    });

    app.put('/v1/novel/:novelID', async (req, res)=>{
        if(!req.session.user){
            res.status(401).send({error:"Unauthorized"});
        }else{
            try{
                let schema = Joi.object().keys({
                    novel_name: Joi.string()
                        .required(),
                    novel_initial_url: Joi.string()
                        .required(),
                    novel_link: Joi.string()
                        .required()
                });
                let data = await schema.validateAsync(req.body);
                let query = {novel_name:data.novel_name, novel_initial_url:data.novel_initial_url, novel_link:data.novel_link};
                let novel =await app.models.Novel.findOneAndUpdate({_id:req.params.novelID}, query);
                res.status(200).send();
            }catch (e) {
                res.status(400).send({error:e});
            }
        }

    });

    app.delete('/v1/novel/:novelID', async (req, res)=>{

        if(!req.session.user){
            res.status(401).send({error:"unauthorized"});
        }else{
            try{
                await app.models.Novel.deleteOne({_id:req.params.novelID});
                let request = {$pull: {"novels":req.params.novelID}}
                let user = await app.models.User.findOneAndUpdate({username:req.session.user.username}, request, {new:true}).populate("novels").exec();
                // let user = await app.models.User.findOne({username:req.session.user.username}).populate("novels").exec();
                // console.log(user);
                if(user){
                    res.status(200).send({
                        novels:user.novels
                    });
                }else{
                    res.status(400).send({
                        error:"User not found"
                    });
                }

                // res.status(400).send({error:"testing"});

            }catch(err){
                console.log(`new novel entry creation failed with error: ${err}`);
                res.status(400).send({error:err});
            }



        }
    });
}