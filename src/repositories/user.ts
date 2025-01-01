import { CONFIG } from '@src/config';
import { mongodbConnectionWrapper } from '@src/helpers/connect';
import { convertToError, convertType } from '@src/helpers/types';
import { userModel } from '@src/models/user';
import { IUser } from '@src/types/user';
import { StatusCodes } from 'http-status-codes';
import { Result } from 'sn-types-general';

const baseUrl = CONFIG.User_Repo_DB;

const dbName = CONFIG.User_Repo_DB;

const url = baseUrl + dbName;

async function addUserCB(newUser: IUser) {
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

async function getUserCB(id: number) {
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

async function findUserCB(user: IUser) {
    let result: Result<IUser>;

    try {
        const foundUser = await userModel.find({ ...user }).lean<IUser>();

        if (!user) {
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

const addUser = mongodbConnectionWrapper({ url, cb: addUserCB });
const getUser = mongodbConnectionWrapper({ url, cb: getUserCB });
const findUser = mongodbConnectionWrapper({ url, cb: findUserCB });

export { addUser, getUser, findUser };
