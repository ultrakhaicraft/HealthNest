import React from 'react';
import styles from '../../CSS/Parent/ParentHomepage.module.css'



const announcementsData = [
  {
    id: 1,
    iconType: 'stethoscope', // or '/assets/stethoscope-icon.svg'
    title: 'Annual Health Checkup',
    tag: 'Upcoming',
    tagType: 'upcoming',
    date: 'June 15, 2025',
    description: 'Please ensure your child is present and brings their health card for the annual health evaluation conducted by our certified nurses.',
    postedDate: 'May 20, 2025',
  },
  {
    id: 2,
    iconType: 'vaccine', // or '/assets/vaccine-icon.svg'
    title: 'Flu Vaccine Drive',
    tag: 'Attention',
    tagType: 'attention',
    date: 'June 22, 2025',
    description: 'The school will be providing free flu vaccinations for all students. Consent forms must be submitted by June 18, 2025.',
    postedDate: 'May 18, 2025',
  },
];

const tagClassByType: Record<string, string> = {
  upcoming: styles.cardTagUpcoming,
  attention: styles.cardTagAttention,
};


function HealthAnnouncements() {
  return (
    <section className={styles.healthAnnouncementsSection}>
      <div className={styles.announcementsHeader}>
        <span className={styles.announcementsIcon} role="img" aria-label="announcements">📢</span>
        <h2 className={styles.announcementsTitle}>Health Announcements</h2>
      </div>
      <div className={styles.announcementsGrid}>
        {announcementsData.map((announcement) => (
          <AnnouncementCard key={announcement.id} {...announcement} />
        ))}
      </div>
    </section>
  );
}


// Helper to get icon based on type (replace with actual SVGs/images)
function getIcon({iconType}:{iconType: string}) {
  if (iconType === 'stethoscope') {
    return <span className="card-icon-svg" style={{color: '#4f46e5'}} role="img" aria-label="checkup">🩺</span>;
  }
  if (iconType === 'vaccine') {
    return <span className="card-icon-svg" style={{color: '#10b981'}} role="img" aria-label="vaccine">💉</span>;
  }
  return null;
}





function AnnouncementCard({ iconType, title, tag, tagType, date, description, postedDate }
  :{ iconType: string; title: string; tag: string; tagType: string; date: string; description: string; postedDate: string; }
){
  return (
    <div className={styles.announcementCard}>
      <div className={styles.cardHeader}>
        <div className={styles.cardIconWrapper}>
          {getIcon({ iconType })}
        </div>
        <h3 className={styles.cardTitle}>{title}</h3>
        <span className={`${styles.cardTag} ${tagClassByType[tagType] ?? ''}`}>{tag}</span>
      </div>
      <div className={styles.cardBody}>
        <p className={styles.cardEventDate}>Date: {date}</p>
        <p className={styles.cardDescription}>{description}</p>
      </div>
      <div className={styles.cardFooter}>
        <span className={styles.postedIcon} role="img" aria-label="posted">🕒</span>
        <p className={styles.cardPostedDate}>Posted {postedDate}</p>
      </div>
    </div>
  );
}



export default HealthAnnouncements;