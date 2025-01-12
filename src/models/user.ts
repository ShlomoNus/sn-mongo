import { model, Schema, Model } from 'mongoose';
import { IUser } from '../types/user';

const userSchema = new Schema<IUser>({
    username: { type: 'String', required: true },
    password: { type: 'String', required: true },
    email: { type: 'String', required: true, unique: true },
});

interface IUserModel extends Model<IUser> {
    findByTitle(title: string): Promise<IUser | null>;
}

userSchema.statics.findByEmail = async function findByEmail(email: string): Promise<IUser | null> {
    return this.findOne({ email }).exec();
};

userSchema.virtual('userData').get(function getUserData(this: IUser) {
    return `name is ${this.username}, email ${this.email}`;
});

userSchema.index({ email: 1 });

export const userModel = model<IUser, IUserModel>('User', userSchema);
