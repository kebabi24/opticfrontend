import {BaseModel} from './base.model'

export class Location extends BaseModel{
    id: Number
    loc_loc: String
    loc__qad01: Boolean
    loc_date: Date
    loc_perm: Boolean
    loc__qadc01: String
    loc__qadc02: String
    loc_project: String
    loc_site: String
    loc_status: String
    loc_user1: String
    loc_user2: String
    loc_single: Boolean
    loc_type: String
    loc_desc: String
    loc_cap: Number
    loc_cap_um: String
    loc_phys_addr: String
    loc_xfer_ownership: Boolean
    loc_domain: String
    oid_loc_mstr: Number

}