import { expect } from 'chai';
import 'mocha';
import * as model from "../src/model";

describe('Manager', () => {

    const environmentNames = require("./../environments.json");

    describe('takeEnvironment', () => {
        it('already taken', () => {
            const username: string = 'ibalosh';
            const userId: number = 123;
            const environmentName = environmentNames[0];
            const manager: model.Manager = new model.Manager(environmentNames);
            const user: model.User = new model.User(username, userId);

            manager.takeEnvironment(environmentName, user);
            expect(() => manager.takeEnvironment(environmentNames[0], user)).to.throw(/Environment.*is already taken./)
        });

        it('non existing', () => {
            const username: string = 'ibalosh';
            const userId: number = 123;
            const manager: model.Manager = new model.Manager(environmentNames);
            const user: model.User = new model.User(username, userId);

            expect(() => manager.takeEnvironment('non-existing', user)).to.throw(/Environment.* doesn't exist.*/)
        });
    });

});