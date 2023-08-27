import { BaseModel } from "./base.model"

export class Account extends BaseModel {
    id = 0
    ac_code = ''
    ac_desc = ''
    ac_type = ''
    ac_curr = ''
    ac_stat_acc = ''

    ac_active    = false
    
    
    clear() {
        this. id = null
        this. ac_code = ''
        this. ac_desc = ''
        this. ac_type = ''
        this. ac_curr = ''
        this.ac_stat_acc = ''
        this. ac_active = false
        
       }
}
