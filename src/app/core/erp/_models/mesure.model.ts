import { BaseModel } from "./base.model"

export class Mesure extends BaseModel {
    id = 0
    um_um = ''
    um_alt_um = ''
    um_part = ''
    um_conv = ''
    um_user1 = ''
    um_user2 = ''

    clear() {
        this. id = null
        this. um_um = ''
        this. um_alt_um = ''
        this. um_part = ''
        this. um_conv = ''
        this. um_user1 = ''
        this. um_user2 = ''
    }
}
