import { ChangeEvent } from 'react';
import styles from './Sort.module.scss'
import { Localization } from '../../types';
import { useLocale } from 'next-intl';

interface SortProps { 
    data: {
        value: string, 
        option: Localization
    }[]
    selectedValue: string;
    onChange: (value: string) => void;  
}

    const Sort = (props:SortProps) => {
        const {data, selectedValue, onChange} = props;

        const handleSortChange = (event: ChangeEvent<HTMLSelectElement>) => {
            const { value } = event.target;
            onChange(value);
        };
        const locale = useLocale()

    return (
        <div className={styles.sort}>
            {/* <span>Tertipleme:</span> */}
            <select className={styles.form__select} value={selectedValue ?? ""} onChange={handleSortChange} >
                {data.map((item, idx) => (
                    <option key={idx} value={item.value}>
                        {item.option[locale as keyof Localization]}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default Sort;

//!USAGE
/*  
    !Add this code to your parent component:
        const sortOptions = [
            {option: 'Default', value: 'default'}, //!You can change to your own option and value
            {option: 'Popular', value: 'popular'},
            {option: 'A-Z', value: 'az'},
            {option: 'Z-A', value: 'za'},
        ] 
        const [selectedSort, setSelectedSort] = useState<string>('');

        const handleSortChange = (value: string) => {
            setSelectedSort(value);
        };
    !Then use like this:
    <Sort options={sortOptions} selectedValue={selectedSort} onChange={handleSortChange}/>
*/