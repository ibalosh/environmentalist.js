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

        describe('take environment', () => {
            it('regular', () => {
                const environmentToTake: string = environmentNames[0];
                let response: Environmentalist.ApiResponse = manager.takeEnvironment(environmentToTake, user, false);
                expect(response.message).to.eq(`Environment "${environmentToTake}" taken by "${user.username}".`)
            });

            it('already taken', () => {
                const environmentToTake: string = environmentNames[0];
                manager.takeEnvironment(environmentToTake, user, false);
                let response: Environmentalist.ApiResponse = manager.takeEnvironment(environmentToTake, user, false);
                expect(response.message).to.eq(`Can <@${user.id}> take environment test1 <@${user.id}>?`)
            });

            it('not existing', () => {
                const environmentToTake: string = 'test_non';
                let response: Environmentalist.ApiResponse = manager.takeEnvironment(environmentToTake, user, false);
                expect(response.message).to.eq(`Environment "${environmentToTake}" doesn't exist. Available environments are: "${environmentNames.join(", ")}".`)
            });
        });
    });

    describe('Slack response', () => {
        beforeEach(() => {
            Environmentalist.Manager.initEnvironments(environmentNames);
            manager = new Environmentalist.Manager(new Environmentalist.SlackResponse());
        });

        describe('take environment', () => {
            it('regular', () => {
                const environmentToTake: string = environmentNames[0];
                let response: Environmentalist.ApiResponse = manager.takeEnvironment(environmentToTake, user, false);
                expect(response.message).to.eq(`{"response_type":"","text":"Environment *test1* taken by *ibalosh*."}`)
            });

            it('already taken', () => {
                const environmentToTake: string = environmentNames[0];
                manager.takeEnvironment(environmentToTake, user, false);
                let response: Environmentalist.ApiResponse = manager.takeEnvironment(environmentToTake, user, false);
                expect(response.message).to.eq(`{"response_type":"in_channel","text":"Can <@${user.id}> take environment test1 <@${user.id}>?"}`)
            });

            it('not existing', () => {
                const environmentToTake: string = 'test_non';
                let response: Environmentalist.ApiResponse = manager.takeEnvironment(environmentToTake, user, false);
                expect(response.message).to.eq(`{"response_type":"","text":"Environment *${environmentToTake}* doesn't exist. Available environments are: *${environmentNames.join(", ")}*."}`)
            });
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