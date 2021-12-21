const changelog = require('mongodb-changelog');
const bycryptjs = require("bcryptjs");


const mongoUrl = process.env.MONGODB_URL;
const config = {mongoUrl: mongoUrl};

const tasks = [
    {
        name: 'initDB',
        operation: () => Promise.resolve(true   )
    },
    {
        name: 'create Roles',
        operation: (db) => {
            const roles = db.collection('roles');
            return roles.insertMany([{role: 'ADMIN'}, {role: 'USER'}]);
        }
    },
    {
        name: 'createUsers',
        operation: async (db) => {
            const users = db.collection('users');
            const roles = db.collection('roles');
            const adminRole = await roles.find({role: 'ADMIN'}).toArray();
            const adminPassword = await bycryptjs.hash('12345678', 12);
            return users.insertOne({username: 'admin', password: adminPassword, role: adminRole[0]._id});
        }
    }
]

changelog(config, tasks);
