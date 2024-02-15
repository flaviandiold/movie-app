import { Inject, Injectable } from "@nestjs/common";
import { Op } from "sequelize";
import { Session } from "src/entity/session.model";
import { CreateSessionDTO } from "src/user/dto/create-session.dto";

@Injectable()
export class AuthRepository{
    constructor(@Inject('SEQUELIZE') private database){}
    async countFor(sessionId: string): Promise<number> {
        const count = this.database.models.Session.count({
            where: {
                sessionId,
                active: true
            }
        });
        return count;
    }
    
    
    async destroySessionForId(sessionId: string) {
        await this.database.models.Session.destroy({
            where: {
                sessionId: sessionId
            }
        });
    }
    
    async getSessionActiveFor(sid: string) {
        const session = await this.database.models.Session.findOne({
            where: {
                sessionId: sid,
                active: true,
                expiryDate: {
                    [Op.gt] : new Date(Date.now())
                }
          }
        })
        return session;
    }
    async createSession(session: CreateSessionDTO) {
        const now = new Date(Date.now());
        const entry = await this.database.models.Session.create({ ...session, active: true, expiryDate: new Date(now.setDate(now.getDate() + 1))});
        return entry;
    }
    async logout(id: number) {
        const result = await this.database.models.Session.update({
            active:false
        }, {
            where: {
                userId: id,
                active: true,
            },
            returning: true
        });
        return result[1];
    }

}