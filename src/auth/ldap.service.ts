import { Logger } from "@nestjs/common";
import { Client, createClient, SearchOptions } from "ldapjs";
import { User } from "./entities/user.entity";

export class LdapService {
    private readonly ldapBaseDN = process.env.LDAP_BASE_DN;
    private readonly ldapDN = process.env.LDAP_DN;
    private readonly ldapPassword = process.env.LDAP_PASSWORD;
    private readonly ldapHost = process.env.LDAP_HOST;
    private ldapClient: Client;
    private logger: Logger = new Logger("LdapService");
    private isConnecteed = false;
    private error: any = null;

    constructor() {
        this.establishConnection();
    }

    private establishConnection() {
        this.ldapClient = createClient({
            url: [this.ldapHost],
            reconnect: true
        });

        this.ldapClient.bind(
            this.ldapDN,
            this.ldapPassword,
            (err) => {
                if (err) {
                    this.error = err;
                    return this.logger.error("LDAP bind failed", err);
                }
                this.isConnecteed = true;
                this.logger.log("LDAP bind successful");
            });
    }

    search({ filter, scope, attributes }: SearchOptions) {
        return new Promise((resolve, reject) => {
            this.ldapClient.search(this.ldapBaseDN, { filter, scope, attributes }, (err, res) => {
                if (err)
                    return reject(err);

                const entries = [];
                res.on('searchEntry', (entry) => {
                    entries.push(entry.object);
                });
                res.on('end', () => {
                    resolve(entries);
                });
            });
        });
    }

    getUsers(): Promise<Array<any>> {
        return this.search({ filter: '(objectClass=person)', scope: 'sub' }) as Promise<Array<any>>;
    }

    getUser(email: string): Promise<any> {
        return new Promise((resolve, reject) => {
            this.ldapClient.search(this.ldapBaseDN, { filter: `(mail=${email})`, scope: 'sub' }, (err, res) => {
                if (err)
                    return reject(err);

                let user: any;
                res.on('searchEntry', (entry) => {
                    user = entry.object;
                });
                res.on('end', () => {
                    user.certificate = user.uid;
                    resolve(user);
                });
            });
        });
    }

    addUser(user: User, certificate: string) {
        const userDN = `cn=${user.email},${this.ldapBaseDN}`;
        const userEntry = {
            cn: user.profile.firstName + " " + user.profile.lastName,
            sn: user.profile.lastName,
            mail: user.email,
            uid: certificate,
            objectClass: ['top', 'person', 'organizationalPerson', 'inetOrgPerson']
        };

        return new Promise((resolve, reject) => {
            this.ldapClient.add(userDN, userEntry, (err) => {
                if (err)
                    return reject(err);
                resolve("User added successfully");
            });
        });
    }

    removeUser(email: string) {
        const userDN = `cn=${email},${this.ldapBaseDN}`;

        return new Promise((resolve, reject) => {
            this.ldapClient.del(userDN, (err) => {
                if (err)
                    return reject(err);
                resolve("User removed successfully");
            });
        });
    }
}