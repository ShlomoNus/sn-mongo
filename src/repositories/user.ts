import { StatusCodes } from 'http-status-codes';
import { Result } from 'sn-types-general';
import { IUser } from '../types/user';
import { userModel } from '../models/user';
import { convertToError, convertType } from '../helpers/types';
import { mongodbConnectionWrapper } from '../helpers/connect';

class UserRepository {
    private url: string;

    constructor({ baseUrl, dbName }: { baseUrl: string; dbName: string }) {
        this.url = baseUrl + '/' + dbName;
    }

    private async createUserCB(newUser: IUser): Promise<Result<string>> {
        let result: Result<string>;

        try {
            const createdUser = new userModel({ ...newUser });

            await createdUser.save();

            result = {
                status: true,
                payload: 'User created',
                statusCode: StatusCodes.CREATED,
            };
        } catch (error: unknown) {
            const typedError = convertType<Error>(error);

            result = {
                status: false,
                message: typedError.message,
                statusCode: StatusCodes.NOT_FOUND,
            };
        }

        return result;
    }

    private async getUserCB(id: number): Promise<Result<IUser>> {
        let result: Result<IUser>;

        try {
            const user = await userModel.findById(id).lean<IUser>();

            if (!user) {
                throw new Error(`no user with ${id} id`);
            }

            result = {
                status: true,
                payload: user,
                statusCode: StatusCodes.OK,
            };
        } catch (error: unknown) {
            const typedError = convertToError(error);

            result = {
                status: false,
                message: typedError.message,
                statusCode: StatusCodes.BAD_REQUEST,
            };
        }

        return result;
    }

    private async findUserCB(user: Omit<IUser, 'password'>): Promise<Result<IUser>> {
        let result: Result<IUser>;

        try {
            const foundUser = await userModel.find({ ...user }).lean<IUser>();

            if (!foundUser) {
                throw new Error('please check again the provided user info');
            }

            result = {
                status: true,
                payload: foundUser,
                statusCode: StatusCodes.OK,
            };
        } catch (error: unknown) {
            const typedError = convertToError(error);

            result = {
                status: false,
                message: typedError.message,
                statusCode: StatusCodes.BAD_REQUEST,
            };
        }

        return result;
    }

    get createUserRepo() {
        return mongodbConnectionWrapper({ url: this.url, cb: this.createUserCB.bind(this) });
    }

    get getUserRepo() {
        return mongodbConnectionWrapper({ url: this.url, cb: this.getUserCB.bind(this) });
    }

    get findUserRepo() {
        return mongodbConnectionWrapper({ url: this.url, cb: this.findUserCB.bind(this) });
    }
}

export { UserRepository };
