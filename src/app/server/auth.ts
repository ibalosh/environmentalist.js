import * as express from "express";
let path = require('path');

function add_basic_auth(app: express.Application, username: string, password: string) {
    function authentication(req:any, res:any, next:any) {
        let authHeader:any = req.headers.authorization;

        if (!authHeader) {
            const err:any = new Error('You are not authenticated!');
            res.setHeader('WWW-Authenticate', 'Basic');
            err.status = 401;
            return next(err)
        }

        const authValues:string[] = Buffer.from(authHeader.split(' ')[1], 'base64').toString().split(':');
        const userFromHeader:string = authValues[0];
        const passFromHeader:string = authValues[1];

        if (userFromHeader === username && passFromHeader === password) {
            // If Authorized user
            next();
        } else {
            let err:any = new Error('You are not authenticated!');
            res.setHeader('WWW-Authenticate', 'Basic');
            err.status = 401;
            return next(err);
        }

    }

    // Authentication of the client
    app.use(authentication)
    app.use(express.static(path.join(__dirname, 'public')));
}

export const setExpressBasicAuth = add_basic_auth;