var User = require('../models/user');
/*
 Description: Get users
 Method: GET
 Output: JSON
 */
module.exports.get_users = function (req, res) {
    var perPage = req.query.perPage
        , page = req.query.page - 1 > 0 ? req.query.page - 1 : 0
        , filters = JSON.parse(req.query.filters);


    var findQuery = User.find().select('_id pseudo email type role');
    var countQuery = User.count();

    findQuery.limit(perPage)
        .skip(perPage * page);

    if (filters.pseudo) {
        findQuery.where('pseudo', new RegExp('.*' + filters.pseudo + '.*', "i"));
        countQuery.where('pseudo', new RegExp('.*' + filters.pseudo + '.*', "i"));

    }

    if (filters.email) {
        findQuery.where('email', new RegExp('.*' + filters.email + '.*', "i"));
        countQuery.where('email', new RegExp('.*' + filters.email + '.*', "i"));
    }

    if (filters.type) {
        findQuery.where('type', new RegExp('.*' + filters.type + '.*', "i"));
        countQuery.where('type', new RegExp('.*' + filters.type + '.*', "i"));
    }

    if (filters.role) {
        findQuery.where('role', new RegExp('.*' + filters.role + '.*', "i"));
        countQuery.where('role', new RegExp('.*' + filters.role + '.*', "i"));
    }


    findQuery.exec(function (err, docs) {
        countQuery.exec(function (err, count) {
            res.json({
                users: docs
                , page: page
                , pages: count / perPage
                , total: count
            })
        });
    });
};

/*
 Description: Get users
 Method: DELETE
 Output: JSON
 */
module.exports.delete_user = function (req, res) {
    User.findOneAndRemove({'_id':req.query._id}).exec(function (err) {
        if (err) {
            res.send(err);
            return null;
        }
        res.send(200);
    });
};

/*
 Description: Get users
 Method: DELETE
 Output: JSON
 */
module.exports.update_user = function (req, res) {
    User.update({_id: req.body.params._id}, {role: req.body.params.role}, {}, function (err, doc) {
        if (err) {
            res.send(err);
        }
        res.send(200);
    });
};
