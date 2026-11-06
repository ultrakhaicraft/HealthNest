import { useState, useEffect } from "react";
import { DashboardTables } from "../../../components/Nurse_Dashboard/DashboardTables";
import { IncidentReportBarChart } from "../../../components/Nurse_Dashboard/IncidentReportBarChart";
import { DashboardStatistic, IncidentRecordCountPerYear, DashboardService } from "../../../feature/API/DashboardService";
import { ViewHealthCheckupEventDTO, HealthCheckupEventService } from "../../../feature/API/HealthCheckupEventService";
import { ViewVaccineEventDTO, VaccineCheckupEventService } from "../../../feature/API/VaccineCheckupEventService";
import { useUserName } from "../../../feature/Hooks/Account/AccountHooks";
import style from "../../../CSS/Nurse/Dashboard/DashboardSection.module.css"

const AdminDashboardPage = () => {

    const [stat, setStat] = useState<DashboardStatistic | null>(null);
    const [healthCheckupEvents, setHealthCheckupEvents] = useState<ViewHealthCheckupEventDTO[]>([]);
    const [vaccineCheckupEvents, setVaccineCheckupEvents] = useState<ViewVaccineEventDTO[]>([]);
    const [incidentData, setIncidentData] = useState<IncidentRecordCountPerYear | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const username = useUserName();

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

    return (
        <main>
            <section className={style.dashboardHeader}>
                <h1>Admin Dashboard</h1>
                <h2>Welcome admin, {username}!</h2>
            </section>

            {error && <p className={style.dashboardError}>{error}</p>}
            <section className={style.dashboardNumberCards}>
                <div className={style.dashboardCard}>
                    <p className={style.cardLabel}>Total Daily Users</p>
                    <p className={style.cardValue}>{stat?.totalDailyUsers ?? 0}</p>
                </div>
                <div className={style.dashboardCard}>
                    <p className={style.cardLabel}>Total Students</p>
                    <p className={style.cardValue}>{stat?.totalStudents ?? 0}</p>
                </div>
                <div className={style.dashboardCard}>
                    <p className={style.cardLabel}>Total Parents</p>
                    <p className={style.cardValue}>{stat?.totalParents ?? 0}</p>
                </div>
                <div className={style.dashboardCard}>
                    <p className={style.cardLabel}>Total School Nurse</p>
                    <p className={style.cardValue}>{stat?.totalSchoolNurse ?? 0}</p>
                </div>


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
            <IncidentReportBarChart data={incidentData} />
            <DashboardTables healthCheckupEvents={healthCheckupEvents} vaccineCheckupEvents={vaccineCheckupEvents} />
        </main>
    )
}

export default AdminDashboardPage;