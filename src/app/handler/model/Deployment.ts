export interface Hash<T> {
    [key: string]: T;
}


export class RepoDepoyments {
    public static transformDeployments(deployments: Deployment[]):Hash<Deployment[]> {
        let repoDeployments:Hash<Deployment[]> = {};
        deployments.map((deployment:Deployment) => {
            if (repoDeployments[deployment.repo] === undefined) {
                repoDeployments[deployment.repo] = [deployment];
            } else {
                repoDeployments[deployment.repo].push(deployment);
            }
        });

        return repoDeployments;
    }
}

/**
 * Release model.
 */
export class Deployment {
    public product:string;
    public serviceFormatted: string;
    public service:string;
    public sha:string;
    public shortSha: string;
    public branch:string;
    public timestamp:string;
    public environment:string;
    public user:string;
    public release:string;
    public repo:string;

    constructor(product: string, sha:string, branch: string, timestamp:string, service:string, environment:string,
                user:string, release:string, repo:string) {
        this.product = product;
        this.sha = sha;
        this.shortSha = sha.substring(0,8);
        this.branch = branch;
        this.timestamp = timestamp;
        this.service = service;
        this.environment = environment;
        this.user = user;
        this.release = release;
        this.repo = repo;
        this.serviceFormatted = this.formatServiceName(service, repo);
        this.inspectReleaseName(release);
    }

    private formatServiceName(service: string, repo: string):string {
        return repo && !service?.includes(repo) ? `${repo}-${service}` : service;
    }

    private inspectReleaseName(release: string):void {
        const pattern:string = '(\\d{4}.\\d{2}.\\d{2}.\\d+)-(\\S+)-(.{8}$)'
        const result:RegExpMatchArray|null = release.match(new RegExp(pattern));

        if (result !== null) {
            this.shortSha = this.shortSha || result[3]
            this.branch = this.branch || result[2]
        }

    }
}

