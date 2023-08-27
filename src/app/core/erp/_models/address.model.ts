import { BaseModel } from "./base.model"

export class Address extends BaseModel {
    ad_addr: String
    ad_name: String
    ad_line1: String
    ad_line2: String
    ad_city: String
    ad_state: String
    ad_zip: String
    ad_type: String
    ad_attn: String
    ad_phone: String
    ad_ext: String
    ad_ref: String
    ad_sort: String
    ad_country: String
    ad_attn2: String
    ad_phone2: String
    ad_ext2: String
    ad_fax: String
    ad_fax2: String
    ad_line3: String
    ad_user1: String
    ad_user2: String
    ad_lang: String
    ad_pst_id: String
    ad_date: Date
    ad_county: String
    ad_temp: Boolean
    ad_bk_acct1: String
    ad_bk_acct2: String
    ad_format: Number
    ad_vat_reg: String
    ad_coc_reg: String
    ad_gst_id: String
    ad_tax_type: String
    ad_taxc: String
    ad_taxable: Boolean
    ad_tax_in: Boolean
    ad_conrep: String
    ad_edi_tpid: String
    ad_edi_ctrl: String
    ad_timezone: String
    ad_userid: String
    ad_mod_date: Date
    ad_edi_id: String
    ad_barlbl_prt: String
    ad_barlbl_val: String
    ad_calendar: String
    ad_edi_std: String
    ad_edi_level: String
    ad_tp_loc_code: String
    ad_tax_zone: String
    ad_tax_usage: String
    ad_misc1_id: String
    ad_misc2_id: String
    ad_misc3_id: String
    ad_wk_offset: Number
    ad_inv_mthd: String
    ad_sch_mthd: String
    ad_po_mthd: String
    ad_asn_data: String
    ad_intr_division: String
    ad_tax_report: Boolean
    ad_name_control: String
    ad_last_file: Boolean
    ad_domain: String
    oid_ad_mstr: Number

    clear() {
        this.ad_name = ""
        this.ad_addr = ""
        this.ad_line1 = ""
        this.ad_line2 = ""
        this.ad_city = ""
        this.ad_state = ""
        this.ad_zip = ""
        this.ad_type = ""
        this.ad_phone = ""
        this.ad_attn = ""
        this.ad_ext = ""
        this.ad_ref = ""
        this.ad_sort = ""
        this.ad_country = ""
        this.ad_attn2 = ""
        this.ad_phone2 = ""
        this.ad_ext2 = ""
        this.ad_fax = ""
        this.ad_fax2 = ""
        this.ad_line3 = ""
        this.ad_user1 = ""
        this.ad_user2 = ""
        this.ad_lang = ""
        this.ad_pst_id = ""
        this.ad_date = new Date()
        this.ad_county = ""
        this.ad_temp = false
        this.ad_bk_acct1 = ""
        this.ad_bk_acct2 = ""
        this.ad_format = 0
        this.ad_vat_reg = ""
        this.ad_coc_reg = ""
        this.ad_gst_id = ""
        this.ad_tax_type = ""
        this.ad_taxc = ""
        this.ad_taxable = false
        this.ad_tax_in = false
        this.ad_conrep = ""
        this.ad_edi_tpid = ""
        this.ad_edi_ctrl = ""
        this.ad_timezone = ""
        this.ad_userid = ""
        this.ad_mod_date = new Date()
        this.ad_edi_id = ""
        this.ad_barlbl_prt = ""
        this.ad_barlbl_val = ""
        this.ad_calendar = ""
        this.ad_edi_std = ""
        this.ad_edi_level = ""
        this.ad_tp_loc_code = ""
        this.ad_tax_zone = ""
        this.ad_tax_usage = ""
        this.ad_misc1_id = ""
        this.ad_misc2_id = ""
        this.ad_misc3_id = ""
        this.ad_wk_offset = 0
        this.ad_inv_mthd = ""
        this.ad_sch_mthd = ""
        this.ad_po_mthd = ""
        this.ad_asn_data = ""
        this.ad_intr_division = ""
        this.ad_tax_report = false
        this.ad_name_control = ""
        this.ad_last_file = false
        this.ad_domain = ""
        this.oid_ad_mstr = 0
    }
}
