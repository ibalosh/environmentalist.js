import { expect } from 'chai';
import 'mocha';
import {Environmentalist} from '../src'

describe('Manager', () => {
    const environmentNames: string[] = ['test1', 'test2'];
    let manager: Environmentalist.Manager;
    let user: Environmentalist.User;

    beforeEach(() => {
        Environmentalist.Manager.initEnvironments(environmentNames);
        manager = new Environmentalist.Manager(new Environmentalist.ApiResponse());
        user = new Environmentalist.User('ibalosh', '100');
    });

    describe('API response', () => {
        beforeEach(() => {
            Environmentalist.Manager.initEnvironments(environmentNames);
            manager = new Environmentalist.Manager(new Environmentalist.ApiResponse());
        });

        it('takeEnvironment', () => {
            const environmentToTake: string = environmentNames[0];
            let response: Environmentalist.ApiResponse = manager.takeEnvironment(environmentToTake, user, false);
            expect(response.message).to.eq(`Environment "${environmentToTake}" taken by "${user.username}".`)
        });
    });

    describe('Slack response', () => {
        beforeEach(() => {
            Environmentalist.Manager.initEnvironments(environmentNames);
            manager = new Environmentalist.Manager(new Environmentalist.SlackResponse());
        });

        it('takeEnvironment', () => {
            const environmentToTake: string = environmentNames[0];
            let response: Environmentalist.ApiResponse = manager.takeEnvironment(environmentToTake, user, false);
            expect(response.message).to.eq(`{"response_type":"","text":"Environment *${environmentToTake}* taken by *${user.username}*."}`)
        });
    });

    it('getEnvironmentNames', () => {
        expect(manager.getEnvironmentNames()).to.eql(environmentNames);
    });

    describe('initEnvironment', () => {
        it('regular', () => {
            Environmentalist.Manager.initEnvironments(environmentNames);
            expect(manager.getEnvironmentNames()).to.eql(environmentNames);
        });

        it('overwrite', () => {
            const newEnvironmentNames: string[] = ['test1new', 'test2new'];
            Environmentalist.Manager.initEnvironments(newEnvironmentNames);
            expect(manager.getEnvironmentNames()).to.eql(newEnvironmentNames);
        });
    });
});