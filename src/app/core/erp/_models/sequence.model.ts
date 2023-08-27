import {BaseModel} from './base.model'

export class Sequence extends BaseModel{
    id: Number
    seq_seq: String
    seq_desc: String
    seq_type: String
    seq_profile: String
    seq_appr1: String
    seq_appr1_lev: Number
    seq_appr1_thr: Number
    seq_appr2: String
    seq_appr2_lev: Number
    seq_appr2_thr: Number
    seq_appr3: String
    seq_appr3_lev: Number
    seq_appr3_thr: Number
    seq_valid_date_start: String
    seq_valid_date_end: String
    seq_prefix: String
    seq_dig_range_inf: Number
    seq_dig_range_sup: Number
    seq_curr_val: Number
    seq_domain: String
    oid_seq_mstr: Number
}