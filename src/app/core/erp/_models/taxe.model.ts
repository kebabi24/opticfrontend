import { BaseModel } from "./base.model"

export class Taxe extends BaseModel {
    id: Number
    tx2_tax_code:  String 
       
    tx2_tax_pct: Number 
    tx2_trl_taxable: Boolean 
    tx2_effdate:  String 
    tx2_max: Number 
    tx2_min: Number 
    tx2_userid:  String 
    tx2_user1:  String 
    tx2_user2:  String 
    tx2_mod_ :  String 
    tx2_tax_type:  String 
    tx2_method:   String 
    tx2_pt_taxc:  String 
    tx2_tax_usage:  String 
    tx2_desc:  String 
    tx2_base:  String 
    tx2_pct_recv: Number 
    tx2_by_line: Boolean 
    tx2_cmtindx: Number 
    tx2_curr:  String 
    tx2_inv_disc: Boolean 
    tx2_pmt_disc: Boolean 
    tx2_update_tax: Boolean 
    tx2_rcpt_tax_point: Boolean 
    tx2_ar_acct:  String 
    tx2_ar_cc:  String 
    tx2_ara_acct:  String 
    tx2_ara_cc:  String 
    tx2_ara_use: Boolean 
    tx2_ap_acct:  String 
    tx2_ap_cc:  String 
    tx2_apr_acct:  String 
    tx2_apr_cc:  String 
    tx2_apr_use: Boolean 
    tx2_tax_in: Boolean 
    tx2_exp_date:  String 
    tx2_ec_sales_list: Boolean 
    tx2_ec_process_work: Boolean 
    tx2_apr_sub:  String 
    tx2_ap_sub:  String 
    tx2_ara_sub:  String 
    tx2_ar_sub:  String 
    tx2_ap_disc_acct:  String 
    tx2_ap_disc_cc:  String 
    tx2_ap_disc_sub:  String 
    tx2_ar_disc_acct:  String 
    tx2_ar_disc_cc:  String 
    tx2_ar_disc_sub:  String 
    tx2_group:  String 
    tx2_stx_acct:  String 
    tx2_stx_cc:  String 
    tx2_stx_sub:  String 
    tx2_register:  String 
    tx2_usage_tax_point: Boolean 

}