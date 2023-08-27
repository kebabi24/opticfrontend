import {BaseModel} from './base.model'

export class LocationDetail extends BaseModel{
   
    id: Number
    ld_loc: String
    ld_part:  String
        
    ld_date:Date
    ld_qty_oh: number
    ld_lot: String
    ld_ref: String
    ld_cnt_date: Date
    ld_assay: number
    ld_expire:Date
    ld_user1: String
    ld_user2: String
    ld_site: String
    ld_status: String
    ld_qty_all: number
    ld_grade: String
    ld_qty_frz: number
    ld_date_frz:Date
    ld_vd_lot: String
    ld_cmtindx: number
    ld_work: number
    ld__chr01:String
    ld__chr02:String
    ld__chr03:String
    ld__chr04:String
    ld__chr05:String
    ld__dte01:Date
    ld__dte02:Date
    ld__dec01:number
    ld__dec02:number
    ld__log01:Boolean
    ld_cost:number
    ld_rev:String
    ld_cust_consign_qty:number
    ld_supp_consign_qty:number
    ld_domain:String


}