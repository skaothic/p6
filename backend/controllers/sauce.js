const Sauce = require('../models/sauce');

const fs = require('fs');

const sauce = require('../models/sauce');


exports.createSauce = (req, res) => {
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;
    const sauce = new Sauce({
        ...sauceObject,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });
    sauce.save()
        .then(() => res.status(201).json({ message: 'Objet enregistré !' }))
        .catch(error => res.status(400).json({ error }))
};

exports.getOneSauce = (req, res) => {
    Sauce.findOne({
        _id: req.params.id
    }).then(
        (sauce) => {
            res.status(200).json(sauce);
        }
    ).catch(
        (error) => {
            res.status(404).json({
                error: error
            });
        }
    );
};

exports.modifySauce = (req, res) => {
    const sauceObject = req.file ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : {...req.body };
    Sauce.updateOne({ _id: req.params.id }, {...sauceObject, _id: req.params.id })
        .then(() => res.status(200).json({ message: 'Objet modifié !' }))
        .catch(error => res.status(400).json({ error }));
};

exports.deleteSauce = (req, res) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => {
            const filename = sauce.imageUrl.split('/images/')[1];
            fs.unlink(`images/${filename}`, () => {
                Sauce.deleteOne({ _id: req.params.id })
                    .then(() => res.status(200).json({ message: 'Objet supprimé !' }))
                    .catch(error => res.status(400).json({ error }));
            });
        })
        .catch(error => res.status(500).json({ error }));
};

exports.getAllSAuce = (req, res) => {
    Sauce.find().then(
        (sauces) => {
            res.status(200).json(sauces);
        }
    ).catch(
        (error) => {
            res.status(400).json({
                error: error
            });
        }
    );
};

exports.likeSauce = (req, res) => {
    let like = req.body.like
    let whoLiked = req.body.userId
    Sauce.findOne({ _id: req.params.id })
        .then((sauce) => {
            if (like === 1) {
                if (!sauce.usersLiked.includes(whoLiked)) {
                    sauce.likes++;
                    sauce.usersLiked.push(whoLiked);
                    sauce.save()
                        .then(() => res.status(200).json({ message: 'Sauce likée' }))
                        .catch((error) => res.status(400).json({ error }));
                } else {
                    res.status(403).json({ message: "vous avez déja donné votre avis" })
                        .catch((error) => res.status(403).json({ error }))
                }
            } else if (like === -1) {
                if (!sauce.usersDisliked.includes(whoLiked)) {
                    sauce.usersDisliked.push(whoLiked)
                    sauce.dislikes++;
                    sauce.save()
                        .then(() => res.status(200).json({ message: 'Sauce dislikée' }))
                        .catch((error) => res.status(400).json({ error }));
                } else {
                    res.status(403).json({ message: "vous avez déja donné votre avis" })
                        .catch((error) => res.status(400).json({ error }));
                }
            } else if (like === 0) {
                if (sauce.usersLiked.includes(whoLiked)) {
                    sauce.usersLiked.pull(whoLiked)
                    sauce.likes--
                        sauce.save()
                        .then(() => res.status(200).json({ message: "like supprimé" }))
                        .catch((error) => res.status(400).json({ error }));

                } else if (sauce.usersDisliked.includes(whoLiked)) {
                    sauce.usersDisliked.pull(whoLiked)
                    sauce.dislikes--;
                    sauce.save()
                        .then(() => res.status(200).json({ message: "Sauce undislikée" }))
                        .catch((error) => res.status(400).json({ error }));

                } else {
                    res.status(403).json({ message: "En attente d'opinion" })
                        .catch((error) => res.status(400).json({ error }));
                }
            }
        })
        .catch((error) => res.status(500).json({ error }))
}