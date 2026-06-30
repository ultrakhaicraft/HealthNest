import React from 'react';



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


function HealthAnnouncements() {
  return (
    <section className="health-announcements-section">
      <div className="announcements-header">
        {/* Replace with <img src="/assets/megaphone-icon.svg" alt="Announcements" className="announcements-icon" /> */}
        <span className="announcements-icon" role="img" aria-label="announcements">📢</span>
        <h2 className="announcements-title">Health Announcements</h2>
      </div>
      <div className="announcements-grid">
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
    <div className="announcement-card">
      <div className="card-header">
        <div className="card-icon-wrapper">
          {/* Replace with <img src={iconSrc} alt="" className="card-icon-svg" /> */}
          {getIcon({iconType})}
        </div>
        <h3 className="card-title">{title}</h3>
        <span className={`card-tag card-tag-${tagType}`}>{tag}</span>
      </div>
      <div className="card-body">
        <p className="card-event-date">Date: {date}</p>
        <p className="card-description">{description}</p>
      </div>
      <div className="card-footer">
        {/* Replace with <img src="/assets/clock-icon.svg" alt="Posted" className="posted-icon" /> */}
        <span className="posted-icon" role="img" aria-label="posted">🕒</span>
        <p className="card-posted-date">Posted {postedDate}</p>
      </div>
    </div>
  );
}



export default HealthAnnouncements;