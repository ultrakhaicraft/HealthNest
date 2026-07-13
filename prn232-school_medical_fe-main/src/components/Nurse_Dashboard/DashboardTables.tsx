

export const DashboardTables = () => {

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
                            <tr>
                                <td>Q3 Health Checkup 2026</td>
                                <td>15/08/2026</td>
                                <td>12/07/2026</td>
                                <td>Upcoming</td>
                            </tr>
                            <tr>
                                <td>Q4 Health Checkup 2026</td>
                                <td>15/12/2026</td>
                                <td>20/11/2026</td>
                                <td>Upcoming</td>
                            </tr>
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
                            <tr>
                               <td>Rabies Vaccine Checkup 2026</td>
                                <td>14/07/2026</td>
                                <td>08/07/2026</td>
                                <td>Upcoming</td>
                            </tr>
                            <tr>
                                <td>Q4 Vaccine Checkup 2027</td>
                                <td>15/12/2027</td>
                                <td>20/11/2027</td>
                                <td>Upcoming</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </section>
    )
}