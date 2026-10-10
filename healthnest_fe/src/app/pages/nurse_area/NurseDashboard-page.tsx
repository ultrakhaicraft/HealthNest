
import { HealthCheckupEventService, ViewHealthCheckupEventDTO } from "../../../feature/API/HealthCheckupEventService";
import { VaccineCheckupEventService, ViewVaccineEventDTO } from "../../../feature/API/VaccineCheckupEventService";
import { DashboardTables } from "../../../components/Nurse_Dashboard/DashboardTables";
import { IncidentReportBarChart } from "../../../components/Nurse_Dashboard/IncidentReportBarChart";
import { useEffect, useState } from "react";
import { DashboardService, DashboardStatistic, IncidentRecordCountPerYear } from "../../../feature/API/DashboardService";
import { useUserName } from "../../../feature/Hooks/Account/AccountHooks";
import style from "../../../CSS/Nurse/Dashboard/DashboardSection.module.css"


interface NurseDashboardProps {
  username: string;
}

const MONTHS: { key: keyof Omit<IncidentRecordCountPerYear, 'year'>; label: string }[] = [
  { key: 'january', label: 'Jan' },
  { key: 'february', label: 'Feb' },
  { key: 'march', label: 'Mar' },
  { key: 'april', label: 'Apr' },
  { key: 'may', label: 'May' },
  { key: 'june', label: 'Jun' },
  { key: 'july', label: 'Jul' },
  { key: 'august', label: 'Aug' },
  { key: 'september', label: 'Sep' },
  { key: 'october', label: 'Oct' },
  { key: 'november', label: 'Nov' },
  { key: 'december', label: 'Dec' },
];



export const NurseDashboard = ({ username }: NurseDashboardProps) => {
  const [stat, setStat] = useState<DashboardStatistic | null>(null);
  const [healthCheckupEvents, setHealthCheckupEvents] = useState<ViewHealthCheckupEventDTO[]>([]);
  const [vaccineCheckupEvents, setVaccineCheckupEvents] = useState<ViewVaccineEventDTO[]>([]);
  const [incidentData, setIncidentData] = useState<IncidentRecordCountPerYear | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  //Get username 
  username=useUserName();

  useEffect(() => {
    let cancelled = false;

    const loadDashboard = async () => {
      try {
        setLoading(true);



        //Attempt to load all the data concurrently to reduce loading time
        const [statResult, incidentResult, healthCheckupResult, vaccineCheckupResult] = await Promise.all([
          DashboardService.getStatistic(),
          DashboardService.countAllIncidentInAYear(2026),
          HealthCheckupEventService.getTop5HealthCheckupEvents(),
          VaccineCheckupEventService.getTop5VaccineCheckupEvents(),
        ]);

        console.log(username);


        if (!cancelled) {
          setStat(statResult);
          setIncidentData(incidentResult);
          setHealthCheckupEvents(healthCheckupResult);
          setVaccineCheckupEvents(vaccineCheckupResult);
        }
      } catch (err) {
        if (!cancelled) setError('Failed to load dashboard data.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadDashboard();

    return () => {
      cancelled = true;
    };
  }, []);

  // Transforms the flat per-month object into the array shape the bar chart needs
  function toChartData(record: IncidentRecordCountPerYear | null) {
    if (!record) return [];
    return MONTHS.map(({ key, label }) => ({
      month: label,
      count: record[key],
    }));
  }



  return (
    <main className={style.dashboardContainer}>
      <section className={style.dashboardHeader}>
        <h1>Nurse Dashboard</h1>
        <h2>Welcome nurse, {username}!</h2>
      </section>
      {error && <p className={style.dashboardError}>{error}</p>}
      <section className={style.dashboardNumberCards}>
        <div className={style.dashboardCard}>
          <p className={style.cardLabel}>Active Incident Reports</p>
          <p className={style.cardValue}>{stat?.activeIncidentRecord ?? 0}</p>
        </div>
        <div className={style.dashboardCard}>
          <p className={style.cardLabel}>Pending Medicine Requests</p>
          <p className={style.cardValue}>{stat?.pendingMedicineRequest ?? 0}</p>
        </div>
        <div className={style.dashboardCard}>
          <p className={style.cardLabel}>Upcoming Vaccine Appointments</p>
          <p className={style.cardValue}>{stat?.upcomingVaccineEvent ?? 0}</p>
        </div>
        <div className={style.dashboardCard}>
          <p className={style.cardLabel}>Upcoming Health Checkups</p>
          <p className={style.cardValue}>{stat?.upcomingHealthCheckup ?? 0}</p>
        </div>
      </section>
      <IncidentReportBarChart data={toChartData(incidentData)} />
      <DashboardTables healthCheckupEvents={healthCheckupEvents} vaccineCheckupEvents={vaccineCheckupEvents} />

    </main>
  )
}