interface PremiumTypes {
    profiles: {
        type: string
        name:string 
        price:string 
        priceOneMoth:string 
        savePercent:string 
        savePercentText:string 
    }[]
    features: Array<string>
}
export default PremiumTypes