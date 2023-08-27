import {BaseModel} from './base.model'

export class LocationGlasses extends BaseModel{
   
    id: Number
    ldg_loc: String
    ldg_part:  String
        
    ldg_date:Date
    ldg_qty_oh: number
    ldg_cyl: number
    ldg_sph: number
    ldg_add: number
    ldg_lot: String
    ldg_ref: String
    ldg_cnt_date: Date
    ldg_assay: number
    ldg_expire:Date
    ldg_user1: String
    ldg_user2: String
    ldg_site: String
    ldg_status: String
    ldg_qty_all: number
    ldg_grade: String
    ldg_qty_frz: number
    ldg_date_frz:Date
    ldg_vd_lot: String
    ldg_cmtindx: number
    ldg_work: number
    ldg__chr01:String
    ldg__chr02:String
    ldg__chr03:String
    ldg__chr04:String
    ldg__chr05:String
    ldg__dte01:Date
    ldg__dte02:Date
    ldg__dec01:number
    ldg__dec02:number
    ldg__log01:Boolean
    ldg_cost:number
    ldg_rev:String
    ldg_cust_consign_qty:number
    ldg_supp_consign_qty:number
    ldg_domain:String


}