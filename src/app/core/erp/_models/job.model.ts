import { BaseModel } from "./base.model"

export class Job extends BaseModel {
    id: Number
    jb_code: String

    jb_desc: Boolean
    jb_domain: String
    oid_jb_mstr: Number
}
