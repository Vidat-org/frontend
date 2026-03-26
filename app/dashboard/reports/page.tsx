import { client } from "@/lib/orpc"

export default async function Page() {
  const query = await client.listReports()

  return (
    <div>
      <p>Balls</p>
      <ul>
        {query.map((report) => (
          <li key={report.reports.id}>
            <a href={`/dashboard/reports/${report.reports.id}`}>Öppna</a>
          </li>
        ))}
      </ul>
    </div>
  )
}
