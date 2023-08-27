import {BaseModel} from './base.model'

export class Subaccount extends BaseModel{

    id: Number

    sb_sub: String 
    sb_desc: String
    sb_active: Boolean
    sb_domain: String
}