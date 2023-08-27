import { BaseModel } from "./base.model"

export class User extends BaseModel{
    id: Number
    usrd_code: String
    usrd_name: String
    usrd_user_name: String
    usrd_pwd: String
    usrd_email: String
    usrd_phone: String
    usrd_profile: String
    usrd_active: Boolean
}