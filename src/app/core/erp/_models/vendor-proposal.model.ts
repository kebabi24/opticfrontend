
import { BaseModel } from "./base.model"

export class VendorProposal extends BaseModel{
    id: Number
    vp_nbr: String
    vp_vend: String
    vp_rqm_nbr: String
    vp_vend_lead: Number
    vp_date: String
    vp_q_date: String
    vp_comment: String
    vp_pr_list: String
    vp_user1: String
    vp_user2: String
    vp_curr: String
    vp_ex_rate: Number
    vp_ex_rate2: Number
    vp_bkage_amt: Number
    vp_duty_amt: Number
    vp_duty_type: String
    vp_frt_amt: Number
    vp_sch_pct: Number
    vp_appr_date: String
    vp_pay_meth: String
    vp_userid: String
    vp_mod_date: String
    vp_pkg_code: String
    vp_ins_rqd: Boolean
    vp_rcpt_stat: String
    vp_tp_use_pct: Boolean
    vp_tp_pct: Number
    vp_total_price: Number
    vp_domain: String
}