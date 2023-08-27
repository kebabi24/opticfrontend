import { BaseModel } from "./base.model"

export class Doctor extends BaseModel {
    id = 0
    dr_addr = ''
    dr_desc = ''
    dr_active = false
    dr_iso_curr = ''
    
    clear() {
        this.id = null
        this.dr_addr = ''
        this.dr_desc = ''
        this.dr_active = false
        this.dr_iso_curr = ''
       }
}
