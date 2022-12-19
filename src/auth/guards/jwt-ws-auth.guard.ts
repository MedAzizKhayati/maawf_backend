import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { UserService } from "../user.service";
import * as jwt from 'jsonwebtoken';
import { Payload } from "../interfaces/payload";
import { WsException } from "@nestjs/websockets";
import { Socket } from "socket.io";

@Injectable()
export class WsGuard implements CanActivate {

    constructor(private userService: UserService) {
    }

    async canActivate(
        context: ExecutionContext,
    ): Promise<boolean> {
        try {
            const client: Socket = context.switchToWs().getClient<Socket>();
            const { headers, query } = client.handshake;
            const bearerToken = (
                headers.authorization ||
                query.authorization as string
            )?.split(' ')[1];

            if (!bearerToken)
                throw new WsException('Unauthorized, make sure to include the token in the Authorization header');

            const decoded = jwt.verify(bearerToken, process.env.JWT_SECRET) as Payload;
            const user = await this.userService.findOne(decoded.id);

            if (!user)
                throw new WsException('User not found');

            context.switchToHttp().getRequest().user = user;
            return Boolean(user);
        } catch (err) {
            throw new WsException(err.message);
        }
    }
}
