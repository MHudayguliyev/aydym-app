import Comment from './comment/Comment'
import styles from './comments-card.module.scss'

export default function CommentsCard() {
  return (
        <div className={styles.comment}>
          <div className={styles.section__head}>
            <h3>Teswirler</h3>
          </div>
          <div className={styles.row}>
            <div className={styles.col__xl__8}>
              {/* Forms */}
              <form className={`${styles.row} ${styles.margin__bottom__5}`}>
                <div className={`${styles.col__12} ${styles.margin__bottom__3} ${styles.ratings}`}>
                  <span>Bahalar: </span>
                  <div>
                    <select className={styles.form__select}>
                      <option value="1">1</option>
                      <option value="2">2</option>
                      <option value="3">3</option>
                      <option value="4">4</option>
                      <option value="5">5</option>
                    </select>
                  </div>
                </div>
                <div className={`${styles.col__6} ${styles.margin__bottom__3}`}>
                  <input 
                    type="text" 
                    className={styles.form__control} 
                    placeholder='Doly Adyňyz'
                  />
                </div>
                <div className={`${styles.col__6} ${styles.margin__bottom__3}`}>
                  <input 
                    type="text"
                    className={styles.form__control}
                    placeholder='Email ID'
                  />
                </div>
                <div className={`${styles.col__12} ${styles.margin__bottom__4}`}>
                  <textarea 
                    cols={30} 
                    rows={4} 
                    placeholder='Teswir ýaz'
                    className={styles.form__control}
                  />
                </div>
                <div className={`${styles.col__12}`}>
                  <button className={`${styles.btn} ${styles.btn__primary} `} style={{minWidth: '160px'}}>Ugrat</button>
                </div>
              </form>

              {/* Comments */}
              <Comment reply/>
              <Comment/>
            </div>
            <div className={styles.col__xl__4}></div>
          </div>

        </div>
  )
}
