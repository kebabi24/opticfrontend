import {BaseModel} from './base.model'

export class Entity extends BaseModel{
    id: Number
    en_entity: String
    en_name: String
    en_primary: Boolean
    en_curr: String
    en_adj_bs: String
    en_page_num: Number
    en_next_prot: Number
    en_src_desc_lang: String
    en_addr: String
    en_consolidation: Boolean
    en_type: String
    en_user1: String
    en_user2: String
    en_domain: String
    oid_en_mstr: Number

}