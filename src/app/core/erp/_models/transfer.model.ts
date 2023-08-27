import { BaseModel } from "./base.model"

export class Transfer extends BaseModel {
    id = 0
    tr_nbr = ''
    tr_so_job = ''
    tr_effdate = ''
    tr_site    = ''
    tr_loc = ''
    
    clear() {
        this. id = null
        this. tr_nbr = ''
        this. tr_so_job = ''
        this. tr_effdate = ''
        this. tr_site = ''
        this. tr_loc = ''
       }
}
