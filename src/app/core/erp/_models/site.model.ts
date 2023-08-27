import { BaseModel } from "./base.model"

export class Site extends BaseModel{
    id: Number
    si_site: String
    si_desc: String
    si_entity: String
    si_default: Boolean
    si_status: String
    si_auto_loc: Boolean
    si_user1: String
    si_user2: String
    si_gl_set: String
    si_db: String
    si_xfer_acct: String
    si_cur_set: String
    si_xfer_cc: String
    si_git_acct: String
    si_git_cc: String
    si_canrun: String
    si_ext_vd: Boolean
    si_btb_vend: String
    si_git_sub: String
    si_xfer_sub: String
    si_decl: String
    si_xfer_ownership: Boolean
    si_git_location: String
    si_domain: String
    si_type: String
    oid_si_mstr: Number

}