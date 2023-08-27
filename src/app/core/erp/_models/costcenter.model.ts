import {BaseModel} from './base.model'

export class Costcenter extends BaseModel{

    id: Number

    cc_ctr: String 
    cc_desc: String
    cc_active: Boolean
    cc_domain: String
}