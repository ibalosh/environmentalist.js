import { expect } from 'chai';
import 'mocha';
import {Habitat} from '../src'

describe('Manager', () => {
    const environmentNames: string[] = ['test1', 'test2'];
    let manager: Habitat.Manager;
    let user: Habitat.User;

    beforeEach(() => {
        Habitat.Manager.initEnvironments(environmentNames);
        manager = new Habitat.Manager(new Habitat.ApiResponse());
        user = new Habitat.User('ibalosh', 100);
    });

    describe('API response', () => {
        beforeEach(() => {
            Habitat.Manager.initEnvironments(environmentNames);
            manager = new Habitat.Manager(new Habitat.ApiResponse());
        });

        it('takeEnvironment', () => {
            const environmentToTake: string = environmentNames[0];
            let response: Habitat.ApiResponse = manager.takeEnvironment(environmentToTake, user, false);
            expect(response.message).to.eq(`Environment "${environmentToTake}" taken by "${user.username}".`)
        });
    });

    describe('Slack response', () => {
        beforeEach(() => {
            Habitat.Manager.initEnvironments(environmentNames);
            manager = new Habitat.Manager(new Habitat.SlackResponse());
        });

        it('takeEnvironment', () => {
            const environmentToTake: string = environmentNames[0];
            let response: Habitat.ApiResponse = manager.takeEnvironment(environmentToTake, user, false);
            expect(response.message).to.eq(`{"response_type":"","text":"Environment *${environmentToTake}* taken by *${user.username}*."}`)
        });
    });

    it('getEnvironmentNames', () => {
        expect(manager.getEnvironmentNames()).to.eql(environmentNames);
    });

    describe('initEnvironment', () => {
        it('regular', () => {
            Habitat.Manager.initEnvironments(environmentNames);
            expect(manager.getEnvironmentNames()).to.eql(environmentNames);
        });

        it('overwrite', () => {
            const newEnvironmentNames: string[] = ['test1new', 'test2new'];
            Habitat.Manager.initEnvironments(newEnvironmentNames);
            expect(manager.getEnvironmentNames()).to.eql(newEnvironmentNames);
        });
    });
});