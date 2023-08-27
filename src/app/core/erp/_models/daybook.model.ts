import { BaseModel } from "./base.model"

export class Daybook extends BaseModel {
    id: Number
        
    dy_dy_code: String
       
    dy_desc: String 
    
    dy_type: String
    
    dy_next_pgdet: Number 
    
    dy_next_pgcen: Number 
    
    dy_last_entdet: String
    
    dy_last_entcen: String 
    
    dy_user1: String
    
    dy_user2: String 
    
    dy__qadc01: String

    dy_domain: String
    oid_dy_mstr: Number
}
