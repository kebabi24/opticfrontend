import { BaseModel } from "./base.model"

export class PurchaseReceive extends BaseModel{
    id: Number
    prh_nbr: String
    prh_line: number
    prh_part:  String
    prh_tax_code: String
    prh_rcp_date: String
    prh_rcvd: number
    prh_pur_cost: number
    prh_pur_std: number
    prh_receiver: String
    prh_vend: String
    prh_lot: String
    prh_ps_nbr: String
    prh_ps_qty: number
    prh_bo_qty: number
    prh_xinvoice: number
    prh_inv_nbr: String
    prh_xinv_dt: String
    prh_xinv_cst: number
    prh_rev: String
    prh_cyl: number
    prh_sph: number
    prh_qdd: number
    prh_type: String
    prh_print: boolean
    prh_taxable: boolean
    prh_lbr_std: number
    prh_mtl_std: number
    prh_bdn_std: number
    prh_ovh_std: number
    prh_sub_std: number
    prh_buyer: String
    prh_shipto: String
    prh_cst_up: boolean
    prh_um: String
    prh_um_conv: number
    prh_curr: String
    prh_rmks: String
    prh_ex_rate: number
    prh_curr_amt: number
    prh_pay_um: String
    prh_user1: String
    prh_user2: String
    prh_site: String
    prh_loc: String
    prh_serial: String
    prh_ship: String
    prh_qty_ord: number
    prh_per_date: String
    prh_rcp_type: String
    prh_reason: String
    prh_request: String
    prh_approve: String
    prh_tax_at: String
    prh_rma_type: String
    prh_fix_rate: number
    prh_po_site: String
    prh_cum_req: number
    prh_cum_rcvd: number
    prh_fsm_type: String
    prh_bank: String
    prh_curr_rlse_id: String
    prh_element: number
    prh_fix_pr: boolean
    prh_crt_int: number
    prh_tax_env: String
    prh_tax_usage: String
    prh_tax_in: boolean
    prh_taxc: String
    prh_vend_lot: String
    prh_ship_date: String
    prh_ex_rate2: number
    prh_ex_ratetype: String
    prh_exru_seq: number
    prh_amt : number
    prh_tax_amt : number
    prh_trl1_amt : number
    prh_cr_terms: String
    prh_domain: String   

    oid_prh_hist: number

}