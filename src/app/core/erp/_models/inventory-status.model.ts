import { BaseModel } from "./base.model"

export class InventoryStatus extends BaseModel {
    id: Number
    is_status: String

    is_avail: Boolean
    is_nettable: Boolean
    is_frozen: Boolean
    is_overissue: Boolean
    is_user1: String
    is_user2: String
    is_userid: String
    is_mod_date: String
    is_desc: String
    is_cmtindx: Number
    is__qadc01: String
    is_domain: String
    oid_is_mstr: Number
}
