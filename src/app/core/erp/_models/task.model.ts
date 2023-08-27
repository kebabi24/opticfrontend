import { BaseModel } from "./base.model"

export class Task extends BaseModel {
    id: Number
    tk_code: String

    tk_desc: Boolean
    tk_um: String
    tk_price: Number
    tk_domain: String
    
}
