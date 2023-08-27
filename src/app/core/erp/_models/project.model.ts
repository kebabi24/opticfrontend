import { BaseModel } from "./base.model"

export class Project extends BaseModel {
    id: Number
    pm_code: String

    pm_desc: Boolean
    pm_domain: String
    pm_status: String
    pm_cust: String
    pm_amt: Number
    pm_cost: Number
    pm_ord_date: String
}
