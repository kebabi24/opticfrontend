import { BaseModel } from './base.model'

export class Requisition extends BaseModel {
    id: Number
    rqm_nbr: String
    rqm_req_date: String
    rqm_rqby_userid: String
    rqm_end_userid: String
    rqm_ship: String
    rqm_cmtindx: String
    rqm_reason: String
    rqm_eby_userid: String
    rqm_status: String
    rqm_print: Boolean
    rqm_due_date: String
    rqm_need_date: String
    rqm_vend: String
    rqm_acct: String
    rqm_sub: String
    rqm_cc: String
    rqm_project: String
    rqm_fix_pr: Boolean
    rqm_curr: String
    rqm_ex_rate: Number
    rqm_ent_date: String
    rqm_site: String
    rqm_lang: String
    rqm_disc_pct: Number
    rqm_bill: String
    rqm_contact: String
    rqm_ln_fmt: Boolean
    rqm_type: String
    rqm_pr_list: String
    rqm_ent_ex: Number
    rqm_rtdto_purch: Boolean
    rqm_partial: Boolean
    rqm_buyer: String
    rqm_job: String
    rqm_category: String
    rqm_fix_rate: Number
    rqm_rmks: String
    rqm_direct: Boolean
    rqm_apr_cmtindx: Number
    rqm_rtto_userid: String
    rqm_prev_userid: String
    rqm_fob: String
    rqm_shipvia: String
    rqm_email_opt: String
    rqm_entity: String
    rqm_pent_userid: String
    rqm_total: Number
    rqm_max_total: Number
    rqm_pr_list2: String
    rqm_rtto_date: String
    rqm_rtto_time: Number
    rqm_open: Boolean
    rqm_prev_rtp: Boolean
    rqm_cls_date: String
    rqm_aprv_stat: String
    rqm_ex_rate2: String
    rqm_ex_ratetype: String
    rqm_exru_seq: Number
    rqm_domain: String
    oid_rqm_mstr: Number
}