import { BaseModel } from "./base.model"

export class CostSimulation extends BaseModel {
    id: number
    sct_sim: String
    sct_part: String
    sct_cst_tot: number
    sct_mtl_tl: number
    sct_lbr_tl: number
    sct_bdn_tl: number
    sct_ovh_tl: number
    sct_sub_tl: number
    sct_mtl_ll: number
    sct_lbr_ll: number
    sct_bdn_ll: number
    sct_ovh_ll: number
    sct_sub_ll: number
    sct_cst_date: String
    sct_user1: String
    sct_user2: String
    sct_serial: String
    sct_site: String
    sct_rollup: Boolean
    sct_rollup_id: String
    sct_nrv: number
    sct__qadc01: String
    sct_cost_changed: Boolean
    sct_domain: String
    oid_sct_det: number
}
