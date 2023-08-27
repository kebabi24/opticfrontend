import { BaseModel } from "./base.model"

export class Pricelist extends BaseModel{
    id: Number
    pi_list: string
    pi_desc: string
    pi_cs_code: string
    pi_part_code: string
    pi_start:  string
    pi_expire:  string
    pi_comb_type: string
    pi_amt_type: string
    pi_break_cat: string
    pi_um: string
    pi_curr: string
    pi_qty_type: string
    pi_manual: Boolean
    pi_max_qty: Number
    pi_cost_set: string
    pi_disc_acct: string
    pi_disc_sub: string
    pi_disc_cc: string
    pi_disc_proj: string
    pi_list_id: string
    pi_confg_disc: Boolean
    pi_min_net: Number
    pi_max_ord: Number
    pi_list_price: Number
    pi_min_price: Number
    pi_max_price: Number
    pi_userid: string
    pi_mod_date:   Date
    pi_cs_type: string
    pi_part_type: string
    pi_user1: string
    pi_user2: string
    pi_terms: string
    pi_srch_type: Number
    pi_accr_cc: string
    pi_accr_proj: string
    pi_accr_acct: string
    pi_accr_sub: string
    pi_print: Boolean
    pi_disc_seq: Number
    pi_extrec: Boolean
    pi_promo1: string
    pi_promo2: string
    pi_promo3: string
    pi_promo4: string
    pi_pig_code: string      
    pi_domain: string
    oid_pi_mstr: Number

}