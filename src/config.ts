import { cleanEnv, str, url } from 'envalid';
import { loadEnvFiles } from './helpers/vars';

loadEnvFiles();

export const CONFIG = cleanEnv(process.env, {
    User_Repo_Url: url({ devDefault: 'mongodb://127.0.0.1:27017/' }),
    User_Repo_DB: str({ devDefault: 'user' }),
});
