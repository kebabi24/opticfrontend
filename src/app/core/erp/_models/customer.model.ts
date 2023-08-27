import { BaseModel } from "./base.model"

export class Customer extends BaseModel{
    id: Number
   

    cm_addr: String
    cm_curr: String
      
    cm_cr_terms: String
    cm_buyer: String
    cm_disc_pct: number
    cm_shipvia: String
    cm_partial: Boolean
    cm_rmks: String
    cm_ar_acct: String
    cm_ar_sub: String
    cm_ar_cc: String
    cm_sort: String
    cm_balance: number
    cm_ship_balance: number
    cm_hold: Boolean
    cm_tax_id: String
    cm_taxable: Boolean
    cm_user1: String
    cm_user2: String
    cm_bank: String
    cm_pay_spec: Boolean
    cm_type: String
    cm_userid: String
    cm_mod_date: String
    cm_prepay: number
    cm_conrep_logic: String
    cm_pr_list: String
    cm_drft_bal: number
    cm_lc_bal: number
    cm_pr_list2: String
    cm_fix_pr: Boolean
    cm_fr_list: String
    cm_fr_min_wt: number
    cm_fr_terms: String
    cm_tid_notice: String
    cm_promo: String  
    cm_stmt: Boolean
    cm_stmt_cyc: number
    cm_dun: Boolean
    cm_fin: Boolean
    cm_inv_auto: Boolean
    cm_resale: String
    cm_region: String
    cm_lang: String
    cm_slspn: String
    cm_sic: String
    cm_pay_Date: Date
    cm_xslspsn2 : String
    cm_avg_pay: number
    cm_cr_hold: Boolean
    cm_cr_rating: String
    cm_high_cr: number
    cm_high_Date: Date
    cm_sale_Date: Date
    cm_invoices: number
    cm_fin_Date: Date
    cm_fst_id: String
    cm_pst_id: String
    cm_pst: Boolean
    cm_tax_in: Boolean
    cm_site: String
    cm_class: String
    cm_taxc: String
    cm_bill: String
    cm_cr_update: String
    cm_cr_review: String
    cm_coll_mthd: String  
    cm_drft_min: number
    cm_drft_max: number
    cm_drft_disc: Boolean
    cm_svc_list: String
    cm_po_reqd: Boolean
    cm_serv_terms: String
    cm_cr_limit: number
    cm_btb_cr: Boolean
    cm_btb_type: String
    cm_ship_lt: number
    cm_disc_comb: number
    cm_scurr: String
    cm_submit_prop: String
    cm_ex_ratetype: String
    cm_db: String
   
    
    cm_pay_method: String
    cm_domain: String

}