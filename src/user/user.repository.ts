import { Inject, Injectable } from "@nestjs/common";
import { Op } from "sequelize";
import { User } from "src/entity/user.model";
import { CreateUserDTO } from "src/user/dto/create-user.dto";
import * as dayjs from 'dayjs'
import * as utc from 'dayjs/plugin/utc';
import * as  timezone from 'dayjs/plugin/timezone';
import locale from 'dayjs/locale/in'

const ISTOffset = 220 * 60 * 1000;

@Injectable()
export class UserRepository{
    
    constructor(@Inject('SEQUELIZE') private database) { 
        dayjs.extend(utc);
        dayjs.extend(timezone);
    }
    
    async deleteUsers() {
        let currentDate = new Date();

        currentDate.setHours(currentDate.getHours() + 5); // Add 5 hours
        currentDate.setMinutes(currentDate.getMinutes() + 30); // Add 30 minutes
        
        currentDate.setMonth(currentDate.getMonth() - 1);
        await this.database.models.User.destroy({
            where: {
                createdAt: {
                    [Op.lte]: currentDate
                }
            }
        })
        
    }
    
    async getAll() : Promise<User[]> {
        const users = await this.database.models.User.findAll({
            attributes: ['username']
        });
        return users;
    }

    async create(user: CreateUserDTO): Promise<void> {
        await this.database.models.User.create({...user});
    }
    async hasUser(username: string): Promise<boolean> {
        if (await this.getUserFor(username)) return true;
        return false;
    }
    async getUserFor(username: string): Promise<User | null> {
        const user = await this.database.models.User.findOne({
            where: {
                username: username
            }
        });
        return user;
    }
}

