var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var privateKey = require('../private.key');
var configKnex = require('../knexfile');
var knex = require('knex')(configKnex.development);


router.post('/newlpt', (req, res, next) => {
    let authorization = req.headers.authorization.split(" ")[1];
    jwt.verify(authorization, privateKey, function (err, decoded) {
        if (err) {
            res.status(403).json(err);
        } else {//verify true
            const { email } = decoded;
            knex('users').first().where({ email })
                .then(resp => {
                    const { lp, date, time1, time2 } = req.body;
                    let list = [];
                    lp.forEach(function (element) {
                        list.push({
                            isPresent: element.isPresent,
                            user_id: element.id,
                            datePresence: date,
                            timePresenceStart: time1,
                            timePresenceEnd: time2,
                            responsable_id: resp.user_id
                        });
                    }, this);
                    console.log(list);
                    return knex.insert(list, 'presence_id').into('presences');
                }
                ).then(ids => res.json({ success: true }))
                .catch(e => res.status(403).json(e));

        }
    });

})


router.get('/getUsersByRole', (req, res) => {
    let { role } = req.query;
    knex.select('users.user_id as id', 'firstname', 'surname', 'email').from('users')
        .join('users_has_roles', 'users.user_id', '=', 'users_has_roles.user_id')
        .where({
            role_id: role
        }).then(
        r => res.json(r),
        e => res.status(403).json(e)
        );

})

module.exports = router;