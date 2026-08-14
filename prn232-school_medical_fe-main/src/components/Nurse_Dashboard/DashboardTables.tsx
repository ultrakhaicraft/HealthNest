import { ViewHealthCheckupEventDTO } from "../../feature/API/HealthCheckupEventService";
import { ViewVaccineEventDTO } from "../../feature/API/VaccineCheckupEventService";

interface DashboardTablesProps {
    healthCheckupEvents: ViewHealthCheckupEventDTO[];
    vaccineCheckupEvents: ViewVaccineEventDTO[];
}

const formatDate = (date: string | null | undefined) => {
  if (!date) return '—';
  return new Date(date).toLocaleDateString();
};


export const DashboardTables = ({ healthCheckupEvents, vaccineCheckupEvents }: DashboardTablesProps) => {

    return(
        <section className="dashboard-table-container">
                <div className="dashboard-table-wrapper" id="health-checkup-table">
                    <p>Upcoming Health Checkups</p>
                    <table className="dashboard-table">
                        <thead>
                            <tr>
                                <th>Title</th>
                                <th>Date Occurred</th>
                                <th>Date Signup Start</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {(!healthCheckupEvents || healthCheckupEvents.length === 0) ? (
                                <tr>
                                    <td colSpan={4} className="table-empty-state">No upcoming health checkups</td>
                                </tr>
                            ):
                            (healthCheckupEvents.map((event)=>(
                                <tr key={event.id}>
                                <td>{event.title}</td>
                                <td>{formatDate(event.dateOccurred)}</td>
                                <td>{formatDate(event.dateSignupStart)}</td>
                                <td><span className="table-status-badge">{event.status ?? '—'}</span></td>
                                </tr>
                                ))
                            
                            )}
                        </tbody>
                    </table>
                </div>
                <div className="dashboard-table-wrapper" id="health-vaccine-table">
                    <p>Upcoming Health Vaccine</p>
                    <table className="dashboard-table">
                        <thead>
                            <tr>
                                <th>Title</th>
                                <th>Date Occurred</th>
                                <th>Date Signup Start</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {vaccineCheckupEvents.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="table-empty-state">No upcoming health vaccines</td>
                                </tr>
                            ):(
                                vaccineCheckupEvents.map((event) => (
                                    <tr key={event.id}>
                                        <td>{event.title}</td>
                                        <td>{formatDate(event.dateOccurred)}</td>
                                        <td>{formatDate(event.dateSignupStart)}</td>
                                        <td><span className="table-status-badge">{event.status ?? '—'}</span></td>
                                    </tr>
                                ))
                            )}
                                
                        </tbody>
                    </table>
                </div>
            </section>
    )
}