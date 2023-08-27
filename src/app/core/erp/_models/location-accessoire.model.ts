import {BaseModel} from './base.model'

export class LocationAccessoire extends BaseModel{
   
    id: Number
    lda_loc: String
    lda_part:  String
        
    lda_date:Date
    lda_qty_oh: number
    lda_lot: String
    lda_ref: String
    lda_cnt_date: Date
    lda_assay: number
    lda_expire:Date
    lda_user1: String
    lda_user2: String
    lda_site: String
    lda_status: String
    lda_qty_all: number
    lda_grade: String
    lda_qty_frz: number
    lda_date_frz:Date
    lda_vd_lot: String
    lda_cmtindx: number
    lda_work: number
    lda__chr01:String
    lda__chr02:String
    lda__chr03:String
    lda__chr04:String
    lda__chr05:String
    lda__dte01:Date
    lda__dte02:Date
    lda__dec01:number
    lda__dec02:number
    lda__log01:Boolean
    lda_cost:number
    lda_rev:String
    lda_cust_consign_qty:number
    lda_supp_consign_qty:number
    lda_domain:String


}