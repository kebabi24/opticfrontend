import { BaseModel } from "./base.model"

export class Reason extends BaseModel{
    id: Number
        rsn_ref: String
        rsn_desc: String
        rsn_type: String
        rsn_domain:  String
}