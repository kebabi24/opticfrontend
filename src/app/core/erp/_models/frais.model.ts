import {BaseModel} from './base.model'

export class Frais extends BaseModel{
    id: Number
    frp_inv_nbr: String
    frp_prh_nbr: String
    frp_effdate: String
    frp_val    : Number
    frp_type_affect: String
    frp_rmks: String
    frp_domain: String
    oid_frp_mstr: Number

}