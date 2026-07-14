import "../../app/CSS/nurseDashboard.css";
import { ViewHealthCheckupEventDTO } from "../../feature/API/HealthCheckupEventService";
import { ViewVaccineEventDTO } from "../../feature/API/VaccineCheckupEventService";
import { DashboardTables } from "./DashboardTables";
import { IncidentReportBarChart } from "./IncidentReportBarChart";


interface NurseDashboardProps {
  username: string;
}

interface MonthlyIncidentData {
  month: string;
  count: number;
}

const defaultIncidentData: MonthlyIncidentData[] = [
  { month: 'Jan', count: 4 },
  { month: 'Feb', count: 7 },
  { month: 'Mar', count: 3 },
  { month: 'Apr', count: 9 },
  { month: 'May', count: 5 },
  { month: 'Jun', count: 6 },
  { month: 'Jul', count: 2 },
  { month: 'Aug', count: 8 },
  { month: 'Sep', count: 5 },
  { month: 'Oct', count: 6 },
  { month: 'Nov', count: 3 },
  { month: 'Dec', count: 4 },
];

const VaccineCheckupData: ViewVaccineEventDTO[] = [
    {
    id: 'vac-001',
    title: 'Rabies Vaccine Checkup 2026',
    dateOccurred: '2026-07-14T00:00:00',
    dateSignupStart: '2026-07-08T00:00:00',
    dateSignupEnd: '2026-07-12T00:00:00',
    status: 'Upcoming',
  },
  {
    id: 'vac-002',
    title: 'Q4 Vaccine Checkup 2027',
    dateOccurred: '2027-12-15T00:00:00',
    dateSignupStart: '2027-11-20T00:00:00',
    dateSignupEnd: '2027-12-05T00:00:00',
    status: 'Upcoming',
  },
  {
    id: 'vac-003',
    title: 'Influenza Vaccine Drive 2026',
    dateOccurred: '2026-09-10T00:00:00',
    dateSignupStart: '2026-08-25T00:00:00',
    dateSignupEnd: '2026-09-05T00:00:00',
    status: 'Upcoming',
  },
  {
    id: 'vac-004',
    title: 'Hepatitis B Booster 2026',
    dateOccurred: '2026-10-22T00:00:00',
    dateSignupStart: '2026-10-01T00:00:00',
    dateSignupEnd: null,
    status: 'Pending',
  },
  {
    id: 'vac-005',
    title: 'Measles-Rubella Campaign 2026',
    dateOccurred: '2026-11-05T00:00:00',
    dateSignupStart: null,
    dateSignupEnd: null,
    status: 'Scheduled',
  },
]

const HealthCheckupData: ViewHealthCheckupEventDTO[] = [
    {
    id: 'chk-001',
    title: 'Q3 Health Checkup 2026',
    dateOccurred: '2026-08-15T00:00:00',
    dateSignupStart: '2026-07-12T00:00:00',
    dateSignupEnd: '2026-08-01T00:00:00',
    status: 'Upcoming',
  },
  {
    id: 'chk-002',
    title: 'Q4 Health Checkup 2026',
    dateOccurred: '2026-12-15T00:00:00',
    dateSignupStart: '2026-11-20T00:00:00',
    dateSignupEnd: '2026-12-05T00:00:00',
    status: 'Upcoming',
  },
  {
    id: 'chk-003',
    title: 'Annual Vision Screening 2026',
    dateOccurred: '2026-09-18T00:00:00',
    dateSignupStart: '2026-09-01T00:00:00',
    dateSignupEnd: '2026-09-12T00:00:00',
    status: 'Upcoming',
  },
  {
    id: 'chk-004',
    title: 'Dental Checkup Program 2026',
    dateOccurred: '2026-10-05T00:00:00',
    dateSignupStart: '2026-09-20T00:00:00',
    dateSignupEnd: null,
    status: 'Pending',
  },
  {
    id: 'chk-005',
    title: 'BMI & Growth Screening 2026',
    dateOccurred: '2026-11-12T00:00:00',
    dateSignupStart: null,
    dateSignupEnd: null,
    status: 'Scheduled',
  },
]


export const NurseDashboard = ({ username }: NurseDashboardProps) => {


    return (
        <main className="dashboard-container">
            <section className="dashboard-header">
                <h1>Nurse Dashboard</h1>
                <h2>Welcome nurse, {username} !</h2>
            </section>
            <section className="dashboard-number-cards">
                <div className="dashboard-card">
                    <p className="card-label">Active Incident Reports</p>
                    <p className="card-value">5</p>
                </div>
                <div className="dashboard-card">
                    <p className="card-label">Active Medicine Requests</p>
                    <p className="card-value">6</p>
                </div>
                <div className="dashboard-card">
                    <p className="card-label">Active Vaccine Appointments</p>
                    <p className="card-value">1</p>
                </div>
                <div className="dashboard-card">
                    <p className="card-label">Active Health Checkups</p>
                    <p className="card-value">0</p>
                </div>      
            </section>
            <IncidentReportBarChart data={defaultIncidentData}  />
            <DashboardTables healthCheckupEvents={HealthCheckupData} vaccineCheckupEvents={VaccineCheckupData} />
            <section className="dashboard-footer">
                <p>© 2024 HealthNest. All rights reserved.</p>
                <p>Having problem ? Contact your administrator.</p>
            </section>
        </main>
    )
}