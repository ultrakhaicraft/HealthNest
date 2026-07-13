import "../../app/CSS/nurseDashboard.css";
import { DashboardTables } from "./DashboardTables";
import { IncidentReportBarChart } from "./IncidentReportBarChart";


interface NurseDashboardProps {
  username: string;
}

interface MonthlyIncidentData {
  month: string;
  count: number;
}

const defaultData: MonthlyIncidentData[] = [
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
            <IncidentReportBarChart data={defaultData}  />
            <DashboardTables />
            <section className="dashboard-footer">
                <p>© 2024 HealthNest. All rights reserved.</p>
                <p>Having problem ? Contact your administrator.</p>
            </section>
        </main>
    )
}