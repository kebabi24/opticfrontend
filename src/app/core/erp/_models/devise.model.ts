import { BaseModel } from "./base.model"

export class Devise extends BaseModel {
    id = 0
    cu_curr = ''
    cu_desc = ''
    cu_rnd_mthd = ''
    cu_active    = false
    cu_iso_curr = ''
    
    clear() {
        this. id = null
        this. cu_curr = ''
        this. cu_desc = ''
        this. cu_rnd_mthd = ''
        this. cu_active = false
        this. cu_iso_curr = ''
       }
}
