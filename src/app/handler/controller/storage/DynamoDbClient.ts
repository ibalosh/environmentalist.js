import {DynamoDB, QueryCommand, QueryCommandOutput} from "@aws-sdk/client-dynamodb"
import {Deployment} from "../../model/Deployment";
import {Environment} from "../../model/Environment";
import {StorageClient} from "./StorageClient";

export abstract class DynamoDbClient extends StorageClient {
    public tableName: string;

    protected constructor(tableName: string) {
        super();
        try {
            this.configuration = {region: 'us-east-2'};
            this.tableName = tableName;
            this.client = new DynamoDB(this.configuration);
        } catch (error: any) {
            throw error;
        }
    }

    protected async executeQuery(queryCommand: QueryCommand): Promise<QueryCommandOutput> {
        try {
            return await this.client.send(queryCommand);
        } catch (error: any) {
            throw error;
        }
    }
}

export class EnvironmentalistDBClient extends DynamoDbClient {
    public constructor(tableName: string) {
        super(tableName);
    }

    public async retrieveEnvironmentData():Promise<Environment[]> {
        let queryCommand = this.createEnvironmentStatusQuery();
        let response:any = await this.executeQuery(queryCommand);
        return this.formatEnvironmentStatusResponse(response);
    }

    public saveEnvironmentData(environments: Environment[]):void {
        this.client.putItem(
            { TableName: this.tableName,
                Item: {
                    "pk": {S: `ENVIRONMENT#statuses`},
                    "sk": {S: `ENVIRONMENTS#Postmark`},
                    "environment_state": {S: JSON.stringify(environments)}
                }
            });
    }

    public async retrieveDeploymentStatusData(filterEnvironment: string):Promise<Deployment[]> {
        let queryCommand = this.createDeploymentStatusQuery(filterEnvironment);
        let response:any = await this.executeQuery(queryCommand);
        return this.formatDeploymentStatusesResponse(response, filterEnvironment);

    }

    private formatDeploymentStatusesResponse(response: QueryCommandOutput, environment:string): Deployment[] {
        return response.Items?.map((item:any) => {
            const service = item.sk?.S?.split("#")[1];
            const repo = item.repo?.S;
            return new Deployment(
                item.product?.S || "",
                item.git_sha?.S || "",
                item.branch?.S || "",
                item.timestamp?.S || "",
                service || "",
                environment || "",
                item.user?.S || "",
                item.release?.S || "",
                repo || ""
            ) as Deployment;
        }) || [];
    }

    private formatEnvironmentStatusResponse(response: QueryCommandOutput): Environment[] {
        let results:any[] = [];

        response.Items?.map((data:any) => {
            results.push(this.formatEnvironmentData(data.environment_state.S));
        });

        return results[0];
    }

    private formatEnvironmentData(data: string): Environment[] {
        const savedEnvironments: Environment[] = JSON.parse(data);
        const environments:Environment[] = [];

        savedEnvironments.forEach(env => {
            environments.push(new Environment(env.name, env.taken, env.takenAt, env.takenBy));
        });
        return environments;
    }

    private createEnvironmentStatusQuery():QueryCommand {
        return new QueryCommand({
            TableName : this.tableName,
            KeyConditionExpression: "pk = :pk AND begins_with (sk, :type)",
            ExpressionAttributeValues: {
                ":pk": { S: `ENVIRONMENT#statuses` },
                ":type": { S: "ENVIRONMENTS#Postmark" }
            }
        });
    }

    private createDeploymentStatusQuery(environment: string):QueryCommand {
        return new QueryCommand({
            TableName : this.tableName,
            KeyConditionExpression: "pk = :pk AND begins_with (sk, :type)",
            ExpressionAttributeValues: {
                ":pk": { S: "ENVIRONMENT#" + environment },
                ":type": { S: "SERVICE" }
            },
        });
    }
}