import { ProfileTypes } from "@lang/app/[locale]/types"

interface PremiumDataType {
    endingDate:string 
    startingDate:string
    profileType: ProfileTypes
    status: boolean
    username:string 
    profiles: {
        profileType:PremiumDataType['profileType']
        startingDate: PremiumDataType['startingDate']
        endingDate: PremiumDataType['endingDate']
    }[]
}
export default PremiumDataType