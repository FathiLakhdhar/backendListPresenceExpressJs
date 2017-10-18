var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var md5 = require('md5');
var configKnex = require('../knexfile');
var knex = require('knex')(configKnex.development);
var isEmpty = require('lodash/isEmpty');
var Validator = require('validator');


/** POST SIGNUP */

router.post('/signup', function (req, res, next) {
    const { firstname, surname, email, password, age, gender } = req.body;
    
    const {errors, isValid} = validateForm(req.body);

    if (isValid) {
        knex('users').insert({
            firstname,
            surname,
            email,
            pwd: md5(password),
            age,
            gender,
            isActive: 0,
            registeredAt: new Date(),
        }, 'user_id').then(
            ids => {
                console.log('user_id : ',ids);
                knex('users_has_roles').insert({
                    user_id: ids[0],
                    role_id: 'ROLE_ANONYMOUS'
                }).then(
                    ()=> res.json({ action: 'SIGNUP_ACTION', success: true }),
                    ()=> res.status(500).json({ action: 'SIGNUP_ACTION', success: false, errors: { form: 'Invalid roles' } })  
                );
            },
            err => res.status(500).json({ action: 'SIGNUP_ACTION', success: false, errors: { form: 'Invalid Credentials' } })
            );
    } else {
        res.status(400).json({ action: 'SIGNUP_ACTION', success: false, errors });
    }

});


function validateForm(f) {
    let errors = {};

    if (Validator.isEmpty(f.firstname))
        errors.firstname = 'This field is required';
    if (Validator.isEmpty(f.surname))
        errors.surname = 'This field is required';
    if (!Validator.isEmail(f.email))
        errors.email = 'Email is invalid';
    if (Validator.isEmpty(f.password)){
        errors.password = 'This field is required';
    }else
        if (!Validator.isLength(f.password, { min: 8, max: 20 }))
            errors.password = 'Password is invalid {min:8, max:20} charater';
    if (Validator.isEmpty(f.age)){
        errors.age = 'This field is required';
    }else 
        if(!Validator.isNumeric(f.age))
            errors.age = 'Age is invalid';

    return { errors, isValid: isEmpty(errors) };
}




/** POST LOGIN */

router.post('/login', function (req, res, next) {
    const { email, password } = req.body;
    const crypted_password = md5(password);

    const isExist = false;

    knex.first().from('users')
    .join('users_has_roles', 'users.user_id', '=', 'users_has_roles.user_id')
    .where({
        email,
        pwd: crypted_password
    }).then(
        (user) => {
            console.log(user);
            if(user){
                res.json({
                    success: true,
                    errors: {},
                    token: jwt.sign(
                        { 
                            firstname: user.firstname,
                            surname: user.surname,
                            email: user.email, 
                            password: user.pwd,
                            isActive: user.isActive,
                            age: user.age,
                            gender: user.gender,
                            registeredAt: user.registeredAt,
                            role: user.role_id

                        },
                        'secrettokenkey'
                    ),
                });
            }else{
                res.status(401);
                res.json({ errors: { form: 'Invalid Credentials' } });
            }
        }
        ).catch(
        err => console.log(err)
        );

});

module.exports = router;