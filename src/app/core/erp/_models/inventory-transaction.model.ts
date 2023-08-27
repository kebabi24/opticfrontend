import { BaseModel } from "./base.model"

export class InventoryTransaction extends BaseModel {
    id: number   
    tr_part: String
    tr_date: Date
    tr_per_date: Date
    ld_lot: String
    tr_type: String
    tr_loc: String
    tr_loc_begin: number
    tr_begin_qoh: number
    tr_qty_req: number
    tr_qty_chg: number
    tr_qty_short: number
    tr_um: String
    tr_um_conv: number
    tr_last_date: Date
    tr_nbr: String
    tr_so_job: String
    tr_ship_type: String
    tr_addr: String
    tr_rmks: String
    tr_xdr_acct: String
    tr_xcr_acct: String
    tr_mtl_std: number
    tr_lbr_std: number
    tr_bdn_std: number
    tr_price: number
    tr_trnbr: number
    tr_gl_amt: number
    tr_xdr_cc: String
    tr_xcr_cc: String
    tr_lot: String
    tr_sub_std: number
    tr_gl_date: Date
    tr_qty_loc: number
    tr_userid: String
    tr_serial: String
    tr_effdate: String
    tr_prod_line: String
    tr_xslspsn1: String
    tr_xslspsn2: String
    tr_xcr_proj: String
    tr_xdr_proj: String
    tr_line: number
    tr_user1: String
    tr_user2: String
    tr_curr: String
    tr_ex_rate: number
    tr_rev: String
    tr_time: number
    tr_ovh_std: number
    tr_site: String
    tr_status: String
    tr_grade: String
    tr_expire: String
    tr_assay: number
    tr_xgl_ref: String
    tr__chr01: String
    tr__chr02: String
    tr__chr03: String
    tr__chr04: String
    tr__chr05: String
    tr__chr06: String
    tr__chr07: String
    tr__chr08: String
    tr__chr09: String
    tr__chr10: String
    tr__chr11: String
    tr__chr12: String
    tr__chr13: String
    tr__chr14: String
    tr__chr15: String
    tr__dte01: Date
    tr__dte02: Date
    tr__dte03: Date
    tr__dte04: Date
    tr__dte05: Date
    tr__dec01: number
    tr__dec02: number
    tr__dec03: number
    tr__dec04: number
    tr__dec05: number
    tr__log01: boolean
    tr__log02: boolean
    tr_ref: String
    tr_msg: number
    tr_program: String
    tr_ord_rev: number
    tr_ref_site: String
    tr_ref_loc: String
    tr_for: String
    tr_rsn_code: String
    tr_daycode: String
    tr_vend_date: Date
    tr_vend_lot: String
    tr_slspsn: String
    tr_fsm_type: String
    tr_upd_isb: boolean
    tr_auto_install: boolean
    tr_ca_int_type: String
    tr_covered_amt: number
    tr_batch: String
    tr_fcg_code: String
    tr_fsc_code: String
    tr_sa_nbr: String
    tr_sv_code: String
    tr_eng_area: String
    tr_sys_prod: String
    tr_svc_type: String
    tr_ca_opn_date: String
    tr_cprice: number
    tr_eng_code: String
    tr_wod_op: number
    tr_enduser: String
    tr_ship_inv_mov: String
    tr_ship_date: Date
    tr_ship_id: String
    tr_ex_rate2: number
    tr_ex_ratetype: String
    tr_exru_seq: number
    tr_promise_date: Date
    tr_fldchg_cmtindx: number
    tr_domain: String
        
}
