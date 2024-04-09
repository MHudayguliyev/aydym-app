import React, { useState } from 'react';
// types
import { Localization } from '@app/types';
// styles
import styles from './Tab.module.scss';
import classNames from 'classnames/bind';
import { useLocale } from 'next-intl';

type TabValueType = 'song' | 'video' | 'album'
type TabProps = {
  tabs: {
    value: string, 
    label: Localization
}[]
  selectedValue: string;
  onChange: (value: TabValueType) => void
};

const cn = classNames.bind(styles);

const Tab = (props: TabProps) => {
  
  const locale = useLocale();
  const { tabs, selectedValue, onChange } = props;

  const [active, setActive] = useState(selectedValue);

  return (
    <ul className={styles.nav__tabs}>
      {tabs.map((tab, idx) => (
        <li
          className={styles.nav__item}
          key={idx}
          onClick={() => 
            {
              setActive(tab.value)
              onChange(tab.value as TabValueType)
            }
          }
          value={selectedValue}
        >
          <span
            className={cn({
              nav__link: true,
              active: tab.value === active,
            })}
          >
             {tab.label[locale as keyof Localization]}
          </span>
        </li>
      ))}
    </ul>
  );
};

export default Tab;
