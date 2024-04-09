import React from 'react'
interface StatusProps {
    statusType: 'equal' | 'up' | 'down'
}
const Status = ({statusType}: StatusProps) => {
    const styles = {
        width: '32px', 
        height: 'auto'
    }
  return (
    <>
     {
        statusType === 'equal' ? (
            <svg xmlns="http://www.w3.org/2000/svg" style={styles} viewBox="0 0 26.191 26.191"><g data-name="Group 3" transform="translate(-626 -1915)"><circle data-name="Ellipse 494" cx="13.095" cy="13.095" r="13.095" transform="translate(626 1915)" fill="#8289a1"></circle><path d="M642.771 1928.989h-10.77v-1.82h10.77l-4.746-4.882 1.251-1.287 6.882 7.079-6.882 7.079-1.251-1.288z" fill="#fff"></path></g></svg>
        ) : statusType === 'down' ? (
            <svg xmlns="http://www.w3.org/2000/svg" style={styles} viewBox="0 0 26.191 26.191"><g data-name="Group 7171"><g data-name="final red"><circle data-name="Ellipse 494" cx="13.095" cy="13.095" r="13.095" fill="#b91b20"></circle></g><path d="M12.167 17.141V6.371h1.82v10.77l4.882-4.746 1.287 1.251-7.079 6.882-7.079-6.882 1.288-1.251z" fill="#fff"></path></g></svg>
        ) : statusType === 'up' ? (
            <svg xmlns="http://www.w3.org/2000/svg" style={styles} viewBox="0 0 26.191 26.191"><g data-name="Group 7170" transform="translate(-626 -1965.469)"><circle data-name="Ellipse 494" cx="13.095" cy="13.095" r="13.095" transform="translate(626 1965.469)" fill="#448118"></circle><path d="M639.989 1975.227v10.77h-1.82v-10.77l-4.882 4.746-1.287-1.251 7.079-6.882 7.079 6.882-1.288 1.251z" fill="#fff"></path></g></svg>
        ) : ""
     }
    </>
  )
}

export default Status
