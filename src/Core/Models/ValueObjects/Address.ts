import NullPropertyException from "../../../Core/Exceptions/NullPropertyException";
import ValueObject from "../ValueObject";
import ChracterDoesntMatchException from '../../Exceptions/CharacterDoesntMatchException';

export default class Address extends ValueObject {

    private readonly addressName:string
    private readonly addressOwnerName:string;
    private readonly addressOwnerSurname:string
    private readonly fullAddressInformation:string;
    private readonly addressCountry:string;
    private readonly addressProvince:string
    private readonly addressDistrict: string
    private readonly addressZipCode:string

    constructor(
        addressName:string,
        addressOwnerName:string,
        addressOwnerSurname:string,
        fullAddressInformation:string,
        addressCountry:string,
        addressProvince:string,
        addressDistrict:string,
        addressZipCode:string
    ){
        super()
        if(!addressName)            throw new NullPropertyException('address name');
        if(!addressOwnerName)       throw new NullPropertyException('address owner name');
        if(!addressOwnerSurname)    throw new NullPropertyException('address owner surname');
        if(!fullAddressInformation) throw new NullPropertyException('full address information');
        if(!addressCountry)         throw new NullPropertyException('address country');
        if(!addressProvince)        throw new NullPropertyException('address province');
        if(!addressDistrict)        throw new NullPropertyException('address district');
        if(!addressZipCode)         throw new NullPropertyException('address zip code');

        if(!addressOwnerName.match('([a-zA-Z])') || !addressOwnerSurname.match('([a-zA-Z])')){
            throw new ChracterDoesntMatchException('address owner name or/and surname');
        }

        this.addressName = addressName
        this.addressOwnerName = addressOwnerName
        this.addressOwnerSurname = addressOwnerSurname
        this.fullAddressInformation = fullAddressInformation
        this.addressCountry = addressCountry
        this.addressProvince = addressProvince
        this.addressZipCode = addressZipCode
    }
    getAddressName = () => this.addressName
    getAddressOwnerName = () => this.addressOwnerName
    getAddressOwnerSurname = () => this.addressOwnerSurname
    getFullAddressInformation = () => this.fullAddressInformation
    getAddressCountry = () => this.addressCountry
    getAddressProvince = () => this.addressProvince
    getAddressDistrict =() => this.addressDistrict
    getAddressZipCode = () => this.addressZipCode
    
    equals(obj: Object): boolean {
        if(obj === this) return true
        if(obj === null || undefined) return false
        
        const that = <Address> obj;

        return (
            this.addressName === that.getAddressName() &&
            this.addressOwnerName === that.getAddressOwnerName() &&
            this.addressOwnerSurname === that.getAddressOwnerSurname() &&
            this.fullAddressInformation === that.getFullAddressInformation() &&
            this.addressCountry === that.getAddressCountry() &&
            this.addressProvince === that.getAddressProvince() &&
            this.addressDistrict === that.getAddressDistrict() &&
            this.addressZipCode === that.getAddressZipCode()
        )
    }
}