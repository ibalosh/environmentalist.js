import { expect } from 'chai';
import 'mocha';
import * as Environmentalist from '../src'

describe('Manager', () => {
    const environmentNames: string[] = ['test1', 'test2'];
    let manager: Environmentalist.Manager;
    let user: Environmentalist.User;

    beforeEach(() => {
        Environmentalist.Manager.clearEnvironmentsStateFile();
        Environmentalist.Manager.initEnvironments(environmentNames, false);
        manager = new Environmentalist.Manager(new Environmentalist.ApiResponse());
        user = new Environmentalist.User('ibalosh', '100');
    });

    describe('API response', () => {
        beforeEach(() => {
            Environmentalist.Manager.initEnvironments(environmentNames, false);
            manager = new Environmentalist.Manager(new Environmentalist.ApiResponse());
        });

        describe('takeEnvironment', () => {
            it('regular', () => {
                const environmentToTake: string = environmentNames[0];
                let response: Environmentalist.ApiResponse = manager.takeEnvironment(environmentToTake, user, false);
                expect(response.message).to.eq(`Environment "${environmentToTake}" taken by "${user.username}".`)
            });

            describe('already taken', () => {
                it('call by same user', () => {
                    const environmentToTake: string = environmentNames[0];
                    manager.takeEnvironment(environmentToTake, user, false);

                    let response: Environmentalist.ApiResponse = manager.takeEnvironment(environmentToTake, user, false);
                    expect(response.message).to.eq(`Environment "${environmentToTake}" taken by "${user.username}".`)
                });

                it('call by different user', () => {
                    const environmentToTake: string = environmentNames[0];
                    manager.takeEnvironment(environmentToTake, user, false);

                    const userOther = new Environmentalist.User('john', '200');
                    let response: Environmentalist.ApiResponse = manager.takeEnvironment(environmentToTake, userOther, false);
                    expect(response.message).to.eq(`Environment "${environmentToTake}" already taken by "${user.username}".`)
                });
            });

            it('force', () => {
                const environmentToTake: string = environmentNames[0];
                manager.takeEnvironment(environmentToTake, user, false);
                let response: Environmentalist.ApiResponse = manager.takeEnvironment(environmentToTake, user, true);
                expect(response.message).to.eq(`Environment "${environmentToTake}" taken by "${user.username}".`)
            });

            it('not existing', () => {
                const environmentToTake: string = 'test_non';
                let response: Environmentalist.ApiResponse = manager.takeEnvironment(environmentToTake, user, false);
                expect(response.message).to.eq(`Environment "${environmentToTake}" doesn't exist. Available environments are: "${environmentNames.join(", ")}".`)
            });
        });

        describe('freeEnvironment', () => {
            it('regular', () => {
                const environmentToTake: string = environmentNames[0];
                manager.takeEnvironment(environmentToTake, user, false);
                let response: Environmentalist.ApiResponse = manager.freeEnvironment(environmentToTake, user);
                expect(response.message).to.eq(`Environment "${environmentToTake}" freed by "${user.username}".`)
            });

            it('not existing environment', () => {
                const environmentToTake: string = 'not_existing';
                let response: Environmentalist.ApiResponse = manager.freeEnvironment(environmentToTake, user);
                expect(response.message).to.eq(`Environment "${environmentToTake}" doesn't exist. Available environments are: "${environmentNames.join(", ")}".`)
            });

            it('non owner', () => {
                const environmentToTake: string = environmentNames[0];
                const otherUser: Environmentalist.User = new Environmentalist.User('john', '200');
                manager.takeEnvironment(environmentToTake, user, false);
                let response: Environmentalist.ApiResponse = manager.freeEnvironment(environmentToTake, otherUser);
                expect(response.message).to.eq(`Environment "${environmentToTake}" can only be freed by user "${user.username}".`)
            });
        });

        describe('environmentStatus', () => {
            it('regular', () => {
                const environmentToTake: string = environmentNames[0];
                manager.takeEnvironment(environmentToTake, user, false);
                let response: Environmentalist.ApiResponse = manager.environmentStatus();
                let message: Environmentalist.Environment[] = JSON.parse(response.message);
                expect(message.length).to.eq(2);
            });
        });
    });

    describe('Slack response', () => {
        beforeEach(() => {
            Environmentalist.Manager.initEnvironments(environmentNames, false);
            manager = new Environmentalist.Manager(new Environmentalist.SlackResponse());
        });

        describe('takeEnvironment', () => {
            it('regular', () => {
                const environmentToTake: string = environmentNames[0];
                let response: Environmentalist.ApiResponse = manager.takeEnvironment(environmentToTake, user, false);
                expect(response.message).to.eq(`{"response_type":"","text":"Environment *test1* taken by *ibalosh*."}`)
            });

            describe('already taken', () => {
                it('call by same user', () => {
                    const environmentToTake: string = environmentNames[0];
                    manager.takeEnvironment(environmentToTake, user, false);

                    let response: Environmentalist.ApiResponse = manager.takeEnvironment(environmentToTake, user, false);
                    expect(response.message).to.eq(`{"response_type":"","text":"Environment *${environmentToTake}* taken by *${user.username}*."}`)
                });

                it('call by different user', () => {
                    const environmentToTake: string = environmentNames[0];
                    manager.takeEnvironment(environmentToTake, user, false);

                    const userOther = new Environmentalist.User('john', '200');
                    let response: Environmentalist.ApiResponse = manager.takeEnvironment(environmentToTake, userOther, false);
                    expect(response.message).to.eq(`{"response_type":"in_channel","text":"Can <@${userOther.id}> take environment ${environmentToTake} <@${user.id}>?"}`)
                });

            });

            it('force', () => {
                const environmentToTake: string = environmentNames[0];
                manager.takeEnvironment(environmentToTake, user, false);
                let response: Environmentalist.ApiResponse = manager.takeEnvironment(environmentToTake, user, true);
                expect(response.message).to.eq(`{"response_type":"","text":"Environment *test1* taken by *ibalosh*."}`)
            });

            it('not existing', () => {
                const environmentToTake: string = 'test_non';
                let response: Environmentalist.ApiResponse = manager.takeEnvironment(environmentToTake, user, false);
                expect(response.message).to.eq(`{"response_type":"","text":"Environment *${environmentToTake}* doesn't exist. Available environments are: *${environmentNames.join(", ")}*."}`)
            });
        });

        describe('freeEnvironment', () => {
            it('regular', () => {
                const environmentToTake: string = environmentNames[0];
                manager.takeEnvironment(environmentToTake, user, false);
                let response: Environmentalist.ApiResponse = manager.freeEnvironment(environmentToTake, user);
                expect(response.message).to.eq(`{"response_type":"","text":"Environment *${environmentToTake}* freed by *${user.username}*."}`)

            });

            it('not existing environment', () => {
                const environmentToTake: string = 'not_existing';
                let response: Environmentalist.ApiResponse = manager.freeEnvironment(environmentToTake, user);
                expect(response.message).to.eq(`{"response_type":"","text":"Environment *${environmentToTake}* doesn't exist. Available environments are: *${environmentNames.join(", ")}*."}`)
            });

            it('non owner', () => {
                const environmentToTake: string = environmentNames[0];
                const otherUser: Environmentalist.User = new Environmentalist.User('john', '200');
                manager.takeEnvironment(environmentToTake, user, false);
                let response: Environmentalist.ApiResponse = manager.freeEnvironment(environmentToTake, otherUser);
                expect(response.message).to.eq(`{"response_type":"","text":"Environment *${environmentToTake}* can only be freed by user *${user.username}*."}`)
            });
        });

        describe('environmentStatus', () => {
            it('regular', () => {
                const environmentToTake: string = environmentNames[0];
                manager.takeEnvironment(environmentToTake, user, false);
                let response: Environmentalist.ApiResponse = manager.environmentStatus();
                let message: any = JSON.parse(response.message);
                expect(message.attachments.length).to.eq(2);
                expect(message.text).to.eq('Environments status');
            });
        });
    });

    it('getEnvironmentNames', () => {
        expect(manager.getEnvironmentNames()).to.eql(environmentNames);
    });

    describe('initEnvironment', () => {
        it('regular', () => {
            Environmentalist.Manager.initEnvironments(environmentNames, false);
            expect(manager.getEnvironmentNames()).to.eql(environmentNames);
        });

        it('empty', () => {
            Environmentalist.Manager.initEnvironments([], false);
            expect(manager.getEnvironmentNames()).to.eql([]);
        });

        it('overwrite', () => {
            const newEnvironmentNames: string[] = ['test1new', 'test2new'];
            Environmentalist.Manager.initEnvironments(newEnvironmentNames, false);
            expect(manager.getEnvironmentNames()).to.eql(newEnvironmentNames);
        });
    });
});