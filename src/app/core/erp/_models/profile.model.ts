import { BaseModel } from "./base.model"

export class Profile extends BaseModel {
    id: Number
    usrg_code: String
    usrg_description: String
    usrg_val_st_date: String
    usrg_val_en_date: String
    usrg_menus:String
}